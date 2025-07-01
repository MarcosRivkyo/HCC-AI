// src/views/Components/Toolbox.tsx

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image, IText, PencilBrush, FabricImage, Line, Text } from "fabric";
import {
  faImage,
  faFont,
  faPencil,
  faTrash,
  faDownload,
  faSearchMinus,
  faSearchPlus,
  faRuler,
  faCrop,
  faDrawPolygon,
  faCircle,
  faUndo,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import * as fabric from "fabric";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

library.add(
  faImage,
  faFont,
  faPencil,
  faTrash,
  faDownload,
  faSearchMinus,
  faSearchPlus,
  faRuler,
  faCrop,
  faDrawPolygon,
  faCircle,
  faUndo,
  faRedo,
);

interface ToolboxProps {
  canvas: any;
}

const Toolbox: React.FC<ToolboxProps> = ({ canvas }) => {
  const [drawingMode, setDrawingMode] = useState(false);
  const [brushColor, setBrushColor] = useState("#00ff00");
  const [brushWidth, setBrushWidth] = useState(2);
  const [textColor, setTextColor] = useState("#000000");

  const [zoomLevel, setZoomLevel] = useState(1);

  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const [brushType, setBrushType] = useState("pen");

  const [isDrawingRect, setIsDrawingRect] = useState(false);
  const [isDrawingCircle, setIsDrawingCircle] = useState(false);

  const [isDrawing, setIsDrawing] = useState(false);

  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null,
  );
  const distanceTextRef = useRef<Text | null>(null);
  const tempLineRef = useRef<Line | null>(null);

  useEffect(() => {
    if (!canvas) return;
    const bgImage = canvas
      .getObjects()
      .find((o: fabric.Object) => o.get("id") === "backgroundImage");

    if (bgImage) {
      bgImage.set({
        selectable: false,
        evented: false,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        hasBorders: false,
        hasControls: false,
      });
      canvas.renderAll();
    }
  }, [historyIndex]);

  useEffect(() => {
    if (!(fabric.Object.prototype as any)._customToObjectExtended) {
      const originalToObject = fabric.Object.prototype.toObject;
      fabric.Object.prototype.toObject = function (
        propertiesToInclude?: string[],
      ) {
        return {
          ...originalToObject.call(this, propertiesToInclude),
          id: (this as any).id,
        };
      };
      (fabric.Object.prototype as any)._customToObjectExtended = true;
    }
  }, []);

  const saveStateToHistory = () => {
    if (!canvas) return;

    const currentState = canvas.toDatalessJSON(["id"]);

    setHistory((prev) => {
      const updated = [...prev.slice(0, historyIndex + 1), currentState];

      setHistoryIndex(updated.length - 1);
      return updated;
    });
  };

  const restoreStateFromHistory = (index: number) => {
    if (!canvas || index < 0 || index >= history.length) return;

    canvas.loadFromJSON(history[index], () => {
      setTimeout(() => {
        canvas.renderAll();
        canvas.setWidth(canvas.getWidth());
        canvas.setHeight(canvas.getHeight());

        canvas.isDrawingMode = drawingMode;
        canvas.selection = true;
        canvas.defaultCursor = "default";

        if (drawingMode) {
          canvas.freeDrawingBrush.color = brushColor;
          canvas.freeDrawingBrush.width = brushWidth;
        }

        const zoomPoint = new fabric.Point(
          canvas.getWidth() / 2,
          canvas.getHeight() / 2,
        );
        canvas.zoomToPoint(zoomPoint, zoomLevel);

        const bgImage = canvas
          .getObjects()
          .find((o: fabric.Object) => o.get("id") === "backgroundImage");

        if (bgImage) {
          bgImage.set({
            selectable: false,
            evented: false,
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            hasBorders: false,
            hasControls: false,
          });
        }

        canvas.renderAll();
      }, 0);
    });

    setHistoryIndex(index);
  };

  const undo = () => {
    if (historyIndex > 0) {
      restoreStateFromHistory(historyIndex - 1);
    } else {
      toast.info("No hay más acciones para deshacer.");
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      restoreStateFromHistory(historyIndex + 1);
    } else {
      toast.info("No hay más acciones para rehacer.");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "z") {
        undo();
      }
      if (e.ctrlKey && e.key === "y") {
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyIndex, history]);

  const toggleLineDrawing = () => {
    setIsDrawingLine(!isDrawingLine);
  };

  useEffect(() => {
    if (!canvas) return;

    const handleMouseDown = (event: fabric.TEvent) => {
      if (!isDrawingLine) return;
      clear();

      const pointer = canvas.getPointer(event.e);
      setStartPoint({ x: pointer.x, y: pointer.y });

      const line = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        stroke: "blue",
        strokeWidth: 2,
        selectable: false,
        evented: false,
      });

      tempLineRef.current = line;
      canvas.add(line);
      canvas.renderAll();
    };

    const handleMouseMove = (event: fabric.TEvent) => {
      if (!isDrawingLine || !tempLineRef.current || !startPoint) return;

      const pointer = canvas.getPointer(event.e);
      const endPoint = { x: pointer.x, y: pointer.y };

      tempLineRef.current.set({ x2: endPoint.x, y2: endPoint.y });
      tempLineRef.current.setCoords();
      canvas.renderAll();

      // Calcula la distancia entre los puntos
      const distance = Math.sqrt(
        Math.pow(endPoint.x - startPoint.x, 2) +
          Math.pow(endPoint.y - startPoint.y, 2),
      );

      // Actualiza o crea el texto con la distancia
      if (distanceTextRef.current) {
        canvas.remove(distanceTextRef.current); // Elimina el texto anterior
      }

      const newDistanceText = new Text(distance.toFixed(2) + " px", {
        left: endPoint.x + 5,
        top: endPoint.y + 5,
        fontSize: 16,
        fill: "black",
        backgroundColor: "white",
        selectable: false,
        evented: false,
      });

      canvas.add(newDistanceText);
      distanceTextRef.current = newDistanceText;
      canvas.renderAll();
    };

    const handleMouseUp = () => {
      if (!isDrawingLine || !tempLineRef.current || !startPoint) return;

      // Limpia la línea y el texto
      canvas.remove(tempLineRef.current);
      if (distanceTextRef.current) {
        canvas.remove(distanceTextRef.current);
      }

      tempLineRef.current = null;
      distanceTextRef.current = null;
      setStartPoint(null);
      setIsDrawingLine(false);

      canvas.renderAll();
    };

    // Activa o desactiva los event listeners basados en el estado isDrawingLine
    if (isDrawingLine) {
      canvas.on("mouse:down", handleMouseDown);
      canvas.on("mouse:move", handleMouseMove);
      canvas.on("mouse:up", handleMouseUp);
    } else {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
    }

    // Limpia los event listeners cuando el componente se desmonta o isDrawingLine cambia
    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
    };
  }, [canvas, isDrawingLine, startPoint]);

  const clear = () => {
    canvas.getObjects().forEach((obj: fabric.Object) => {
      if (obj.type === "i-text") {
        canvas.remove(obj);
      }
    });
    if (tempLineRef.current) {
      canvas.remove(tempLineRef.current);
      tempLineRef.current = null;
    }
    canvas.renderAll();
  };

  const startRectDrawing = () => {
    if (drawingMode || isDrawingCircle || isDrawingLine || isDrawingRect) {
      toast.warning("Desactiva el modo dibujo para realizar la operación.");
      return;
    }

    setIsDrawingRect(true);
    canvas.selection = false;
    canvas.defaultCursor = "crosshair";
  };

  const startCircleDrawing = () => {
    if (drawingMode || isDrawingCircle || isDrawingLine || isDrawingRect) {
      toast.warning("Desactiva el modo dibujo para realizar la operación.");
      return;
    }
    setIsDrawingCircle(true);
    canvas.selection = false;
    canvas.defaultCursor = "crosshair";
  };

  useEffect(() => {
    if (!canvas) return;

    let shape: fabric.Rect | fabric.Circle | fabric.Line | null = null;
    let startPoint: { x: number; y: number } | null = null;
    let distanceText: fabric.Text | null = null;

    const onMouseDown = (options: fabric.TEvent) => {
      const pointer = canvas.getPointer(options.e);
      startPoint = { x: pointer.x, y: pointer.y };

      if (isDrawingRect) {
        shape = new fabric.Rect({
          left: startPoint.x,
          top: startPoint.y,
          width: 0,
          height: 0,
          stroke: "green",
          strokeWidth: 2,
          fill: "transparent",
        });
        canvas.add(shape);
      }

      if (isDrawingCircle) {
        shape = new fabric.Circle({
          left: startPoint.x,
          top: startPoint.y,
          radius: 0,
          stroke: "green",
          strokeWidth: 2,
          fill: "transparent",
        });
        canvas.add(shape);
      }

      if (isDrawingLine) {
        shape = new fabric.Line(
          [startPoint.x, startPoint.y, startPoint.x, startPoint.y],
          {
            stroke: "blue",
            strokeWidth: 2,
          },
        );
        canvas.add(shape);
      }

      canvas.renderAll();
    };

    const onMouseMove = (options: fabric.TEvent) => {
      if (!shape || !startPoint) return;

      const pointer = canvas.getPointer(options.e);

      if (isDrawingRect && shape instanceof fabric.Rect) {
        shape.set({
          width: Math.abs(pointer.x - startPoint.x),
          height: Math.abs(pointer.y - startPoint.y),
          left: Math.min(startPoint.x, pointer.x),
          top: Math.min(startPoint.y, pointer.y),
        });
      }

      if (isDrawingCircle && shape instanceof fabric.Circle) {
        const radius = Math.sqrt(
          Math.pow(pointer.x - startPoint.x, 2) +
            Math.pow(pointer.y - startPoint.y, 2),
        );
        shape.set({ radius });
      }

      if (isDrawingLine && shape instanceof fabric.Line) {
        shape.set({ x2: pointer.x, y2: pointer.y });

        const distance = Math.sqrt(
          Math.pow(pointer.x - startPoint.x, 2) +
            Math.pow(pointer.y - startPoint.y, 2),
        );

        if (distanceText) canvas.remove(distanceText);

        distanceText = new fabric.Text(`${distance.toFixed(2)} px`, {
          left: pointer.x + 5,
          top: pointer.y + 5,
          fontSize: 16,
          fill: "black",
          backgroundColor: "white",
          selectable: false,
          evented: false,
        });

        canvas.add(distanceText);
      }

      canvas.renderAll();
    };

    const onMouseUp = () => {
      if (!shape) return;

      if (isDrawingRect && shape instanceof fabric.Rect) {
        const area = Math.round(shape.width! * shape.height!);
        const text = new fabric.Text(`Área: ${area} px²`, {
          left: shape.left!,
          top: shape.top! - 20,
          fontSize: 14,
          fill: "green",
        });
        canvas.add(text);
        shape.set({ selectable: true, evented: true });
        setIsDrawingRect(false);
      }

      if (isDrawingCircle && shape instanceof fabric.Circle) {
        const volume = Math.round(
          (4 / 3) * Math.PI * Math.pow(shape.radius!, 3),
        );
        const text = new fabric.Text(`Volumen: ${volume} px³`, {
          left: shape.left!,
          top: shape.top! - 20,
          fontSize: 14,
          fill: "green",
        });
        canvas.add(text);
        setIsDrawingCircle(false);
      }

      if (isDrawingLine) {
        if (distanceText) {
          canvas.remove(distanceText);
          distanceText = null;
        }
        canvas.remove(shape);
        setIsDrawingLine(false);
      }

      shape = null;
      startPoint = null;
      canvas.selection = true;
      canvas.defaultCursor = "default";

      // Fondo al fondo si está presente
      const bgImage = canvas
        .getObjects()
        .find((o: fabric.Object) => o.get("id") === "backgroundImage");

      canvas.renderAll();
      saveStateToHistory();
    };

    // Asignar listeners
    canvas.on("mouse:down", onMouseDown);
    canvas.on("mouse:move", onMouseMove);
    canvas.on("mouse:up", onMouseUp);

    return () => {
      canvas.off("mouse:down", onMouseDown);
      canvas.off("mouse:move", onMouseMove);
      canvas.off("mouse:up", onMouseUp);
    };
  }, [canvas, isDrawingRect, isDrawingCircle, isDrawingLine]);

  useEffect(() => {
    if (!canvas) return;

    // Centrar el zoom en el centro del lienzo
    const zoomPoint = new fabric.Point(
      canvas.getWidth() / 2,
      canvas.getHeight() / 2,
    );
    canvas.zoomToPoint(zoomPoint, zoomLevel);

    canvas.renderAll();

    // Guardar el estado después de aplicar el zoom
    saveStateToHistory();
  }, [zoomLevel]);

  const zoomIn = () => {
    if (drawingMode) {
      toast.warning("Desactiva el modo dibujo para realizar la operación.");
      return;
    }
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 3)); // Aumenta el zoom, hasta un máximo de 3x
  };

  const zoomOut = () => {
    if (drawingMode) {
      toast.warning("Desactiva el modo dibujo para realizar la operación.");
      return;
    }
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 0.5)); // Disminuye el zoom, hasta un mínimo de 0.5x
  };

  const fileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      if (event.target?.result) {
        const image = await Image.fromURL(event.target.result as string);

        // Escalado proporcional para que quepa dentro de 500x500 sin deformarse
        const maxWidth = 500;
        const maxHeight = 500;

        const scaleX = maxWidth / image.width!;
        const scaleY = maxHeight / image.height!;
        const scale = Math.min(scaleX, scaleY);

        image.scale(scale);

        image.set({
          selectable: false,
          evented: false,
          lockMovementX: true,
          lockMovementY: true,
          lockScalingX: true,
          lockScalingY: true,
          lockRotation: true,
          hasBorders: false,
          hasControls: false,
        });

        image.set("id", "backgroundImage");

        canvas.add(image);
        canvas.centerObject(image);
        saveStateToHistory();
        canvas.renderAll();
      }
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const addText = () => {
    if (!canvas) return;

    if (drawingMode) {
      toast.warning("Desactiva el modo dibujo para realizar la operación.");
      return;
    }

    const userText = prompt("Introduce el texto que deseas agregar:");
    if (!userText) return;

    const text = new IText(userText, {
      left: 100,
      top: 100,
      fontSize: 30,
      fill: textColor,
    });

    canvas.add(text);
    canvas.centerObject(text);
    canvas.setActiveObject(text);
    saveStateToHistory();
  };

  // Función para activar/desactivar el modo de dibujo
  const toggleDrawingMode = () => {
    if (!canvas) return;

    // Alternar entre el modo de dibujo y el modo normal
    canvas.isDrawingMode = !canvas.isDrawingMode;
    setDrawingMode(canvas.isDrawingMode);

    // Establecer el color y la anchura del pincel al activar el modo de dibujo
    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.color = brushColor;
      canvas.freeDrawingBrush.width = brushWidth;
    }
    saveStateToHistory();
  };

  // Función para cambiar el color del pincel
  const handleBrushColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrushColor(e.target.value);

    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.color = e.target.value;
    }
  };

  // Función para cambiar la anchura del pincel
  const handleBrushWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrushWidth(parseInt(e.target.value, 10));

    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.width = parseInt(e.target.value, 10);
    }
  };

  const handleBrushTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setBrushType(type);

    if (canvas.isDrawingMode) {
      switch (type) {
        case "pen":
          canvas.freeDrawingBrush = new fabric.PencilBrush(canvas); // Pincel de lápiz
          break;
        case "circle":
          canvas.freeDrawingBrush = new fabric.CircleBrush(canvas); // Pincel circular
          break;
        case "spray":
          canvas.freeDrawingBrush = new fabric.SprayBrush(canvas); // Pincel de spray
          break;
        default:
          break;
      }

      canvas.freeDrawingBrush.color = brushColor; // Actualiza el color del pincel
      canvas.freeDrawingBrush.width = brushWidth; // Actualiza el tamaño del pincel
    }
  };

  function clearAll() {
    if (drawingMode) {
      toast.warning("Desactiva el modo dibujo para realizar la operación.");
      return;
    }
    if (window.confirm("Esta operación es irreversible, desea borrarlo?")) {
      canvas.remove(...canvas.getObjects());
    }
  }

  function downloadImage() {
    if (drawingMode) {
      toast.warning("Desactiva el modo dibujo para realizar la operación.");
      return;
    }
    const link = document.createElement("a");
    link.download = "photo_editor_image.png";
    link.href = canvas.toDataURL();
    link.click();
  }

  const [isCropping, setIsCropping] = useState(false);
  const [cropRect, setCropRect] = useState<fabric.Rect | null>(null);

  const handleStartCropping = () => {
    if (!canvas) return;

    const img = canvas
      .getObjects()
      .find((obj: fabric.Object) => obj.type === "image") as fabric.Image;
    if (!img) return;

    // Crear un rectángulo para seleccionar área a recortar
    const cropRect = new fabric.Rect({
      left: img.left! + 50,
      top: img.top! + 50,
      width: 100,
      height: 100,
      fill: "rgba(0,0,0,0.3)",
      hasBorders: true,
      hasControls: true,
      selectable: true,
      lockRotation: true,
      lockScalingFlip: true,
      objectCaching: false,
    });

    canvas.add(cropRect);
    canvas.setActiveObject(cropRect);
    canvas.renderAll();

    const confirmCrop = () => {
      const active = canvas.getActiveObject();
      if (!active || active.type !== "rect") return;

      const {
        left,
        top,
        width,
        height,
        scaleX: rectScaleX,
        scaleY: rectScaleY,
      } = active;
      const { scaleX: imgScaleX = 1, scaleY: imgScaleY = 1 } = img;

      const actualWidth = width! * rectScaleX!;
      const actualHeight = height! * rectScaleY!;

      const cropX = (left! - img.left!) / imgScaleX;
      const cropY = (top! - img.top!) / imgScaleY;
      const cropW = actualWidth / imgScaleX;
      const cropH = actualHeight / imgScaleY;

      img.set({
        cropX,
        cropY,
        width: cropW,
        height: cropH,
        scaleX: imgScaleX,
        scaleY: imgScaleY,
      });

      img.left = left;
      img.top = top;

      canvas.remove(active);
      canvas.setActiveObject(img);
      canvas.renderAll();
    };

    const cropBtn = document.createElement("button");
    cropBtn.innerText = "Confirmar recorte";
    cropBtn.onclick = () => {
      confirmCrop();
      cropBtn.remove();
    };
    document.body.appendChild(cropBtn);
    saveStateToHistory();
  };

  const handleSelectedObjectColorChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const color = e.target.value;
    setTextColor(color);

    const activeObject = canvas?.getActiveObject();
    if (!activeObject) return;

    const applyColorToObject = (obj: fabric.Object) => {
      if (obj.type === "i-text" || obj.type === "text") {
        obj.set("fill", color);
      } else if (obj.type === "rect" || obj.type === "circle") {
        obj.set({
          stroke: color,
        });
      }
    };

    if (activeObject.type === "activeSelection") {
      (activeObject as fabric.ActiveSelection)
        .getObjects()
        .forEach(applyColorToObject);
    } else {
      applyColorToObject(activeObject);
    }

    canvas.renderAll();
    saveStateToHistory();
  };

  return (
    <div className="toolbox bg-gray-900 p-4 rounded-xl space-y-1 text-white w-full max-w-[220px]">
      {/* Fila 1: Descargar y Borrar */}
      <div className="flex justify-between gap-2">
        <button title="Descargar imagen" onClick={downloadImage}>
          <FontAwesomeIcon icon={faDownload} />
        </button>

        <button title="Borrar todo" onClick={clearAll}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <div className="h-[2px] w-full bg-white opacity-40 my-2 rounded" />

      {/* Fila 2: Añadir texto */}
      <div className="flex justify-center">
        <button title="Agregar texto" onClick={addText}>
          <FontAwesomeIcon icon={faFont} />
        </button>
      </div>
      <div className="flex flex-col items-center mt-2">
        <input
          type="color"
          id="element-color"
          value={textColor}
          onChange={handleSelectedObjectColorChange}
          className="w-10 h-10 border rounded"
          disabled={drawingMode}
        />
      </div>

      <div className="h-[2px] w-full bg-white opacity-40 my-2 rounded" />

      {/* Fila 3: Pintar */}
      <div className="flex justify-center">
        <button
          title="Modo dibujo"
          onClick={toggleDrawingMode}
          className={`p-2 rounded transition font-bold relative ${
            drawingMode
              ? "ring-4 ring-yellow-400 shadow-md shadow-yellow-300"
              : "ring-0"
          } bg-gray-800 text-white`}
        >
          <FontAwesomeIcon icon={faPencil} />
        </button>
      </div>

      {/* Opciones de dibujo si está activado */}
      {drawingMode && (
        <div className="space-y-2">
          <select
            value={brushType}
            onChange={handleBrushTypeChange}
            className="w-full bg-gray-900 text-white rounded p-1"
          >
            <option value="pen">Lápiz</option>
            <option value="circle">Círculo</option>
            <option value="spray">Spray</option>
          </select>

          <input
            type="color"
            value={brushColor}
            onChange={handleBrushColorChange}
            className="w-full h-8 p-0"
          />

          {/* Label a la izquierda del input */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="brush-width"
              className="text-sm text-white whitespace-nowrap"
            >
              Ancho
            </label>
            <input
              id="brush-width"
              type="number"
              min="1"
              max="100"
              value={brushWidth}
              onChange={handleBrushWidthChange}
              className="flex-1 p-1 rounded bg-gray-900 text-white"
            />
          </div>
        </div>
      )}

      <div className="h-[2px] w-full bg-white opacity-40 my-2 rounded" />

      {/* Fila 4: Rectángulo y Círculo */}
      <div className="flex justify-between gap-2">
        <button title="Dibujar rectángulo" onClick={startRectDrawing}>
          <FontAwesomeIcon icon={faDrawPolygon} />
        </button>
        <button title="Dibujar círculo" onClick={startCircleDrawing}>
          <FontAwesomeIcon icon={faCircle} />
        </button>
      </div>
      <div className="h-[2px] w-full bg-white opacity-40 my-2 rounded" />

      {/* Fila 5: Regla */}
      <div className="flex justify-center">
        <button
          title="Medir distancia"
          onClick={toggleLineDrawing}
          disabled={drawingMode}
        >
          <FontAwesomeIcon icon={faRuler} />
        </button>
      </div>
      <div className="h-[2px] w-full bg-white opacity-40 my-2 rounded" />

      {/* Fila 6: Zoom */}
      <div className="flex justify-between gap-2">
        <button title="Zoom In" onClick={zoomIn}>
          <FontAwesomeIcon icon={faSearchPlus} />
        </button>
        <button title="Zoom Out" onClick={zoomOut}>
          <FontAwesomeIcon icon={faSearchMinus} />
        </button>
      </div>
      <div className="h-[2px] w-full bg-white opacity-40 my-2 rounded" />

      {/* Fila 7: Deshacer / Rehacer */}
      <div className="flex justify-between gap-2">
        <button onClick={undo} title="Deshacer" disabled={drawingMode}>
          <FontAwesomeIcon icon={faUndo} />
        </button>
        <button onClick={redo} title="Rehacer" disabled={drawingMode}>
          <FontAwesomeIcon icon={faRedo} />
        </button>
      </div>
    </div>
  );
};

export default Toolbox;
