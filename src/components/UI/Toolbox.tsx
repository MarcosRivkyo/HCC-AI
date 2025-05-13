import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "fabric";
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
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import * as fabric from "fabric";

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
  const [brushWidth, setBrushWidth] = useState(5);
  const [textColor, setTextColor] = useState("#000000");

  const [zoomLevel, setZoomLevel] = useState(1);

  const [history, setHistory] = useState<any[]>([]); // Para guardar el historial de acciones
  const [historyIndex, setHistoryIndex] = useState<number>(-1); // Para llevar un índice en el historial

  const [brushType, setBrushType] = useState("pen"); // Estado para el tipo de pincel

  const [isDrawingRect, setIsDrawingRect] = useState(false);
  const [isDrawingCircle, setIsDrawingCircle] = useState(false);

  const [isDrawing, setIsDrawing] = useState(false); // Para saber si estamos dibujando

  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null,
  );
  const distanceTextRef = useRef<Text | null>(null);
  const tempLineRef = useRef<Line | null>(null);

  const saveStateToHistory = () => {
    if (!canvas) return;

    // Obtener el estado actual del canvas
    const currentState = canvas.toJSON();

    // Guardar el estado en el historial, comenzando desde el índice actual + 1
    setHistory((prevHistory) => {
      const updatedHistory = [
        ...prevHistory.slice(0, historyIndex + 1),
        currentState,
      ];
      return updatedHistory;
    });
    setHistoryIndex((prevIndex) => prevIndex + 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      restoreStateFromHistory(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      restoreStateFromHistory(historyIndex + 1);
    }
  };

  const restoreStateFromHistory = (index: number) => {
    if (!canvas || index < 0 || index >= history.length) return;

    canvas.loadFromJSON(history[index], () => {
      // Restaurar zoom en el centro
      const zoomPoint = new fabric.Point(
        canvas.getWidth() / 2,
        canvas.getHeight() / 2,
      );
      canvas.zoomToPoint(zoomPoint, zoomLevel);

      // Limpiar selección activa (por si causa glitch visual)
      canvas.discardActiveObject();
      canvas.discardActiveGroup?.();

      // Forzar render completo
      canvas.renderAll();
      canvas.requestRenderAll();
    });

    setHistoryIndex(index);
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

  // useEffect(() => {
  //   if (!canvas) return;

  //   const loadImage = async () => {
  //     const imageUrl = ejemplo; // La URL de la imagen que quieras cargar
  //     const image = await Image.fromURL(imageUrl);

  //     // Escalado proporcional para que quepa dentro de 500x500 sin deformarse
  //     const maxWidth = 500;
  //     const maxHeight = 500;
  //     const scaleX = maxWidth / image.width!;
  //     const scaleY = maxHeight / image.height!;
  //     const scale = Math.min(scaleX, scaleY); // Escala uniforme

  //     image.scale(scale);
  //     image.set({
  //       left: 100,
  //       top: 100,
  //       selectable: false, // Hacemos que la imagen no sea seleccionable
  //       lockMovementX: true, // Bloqueamos el movimiento en el eje X
  //       lockMovementY: true, // Bloqueamos el movimiento en el eje Y
  //       hasControls: false,
  //       lockRotation: true,
  //       lockScalingX: true,
  //       lockScalingY: true,
  //     });

  //     canvas.add(image);
  //     canvas.centerObject(image); // Centramos la imagen en el lienzo
  //     canvas.setActiveObject(image); // Establecemos la imagen como el objeto activo
  //     saveStateToHistory();

  //   };

  //   loadImage();

  // }, [canvas]); // Solo se ejecuta cuando se monta el componente o se cambia el canvas

  // Función para activar/desactivar el modo de medición
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
    setIsDrawingRect(true);
    canvas.selection = false;
    canvas.defaultCursor = "crosshair";
  };

  const startCircleDrawing = () => {
    setIsDrawingCircle(true);
    canvas.selection = false;
    canvas.defaultCursor = "crosshair";
  };

  useEffect(() => {
    if (!canvas) return;

    let rect: fabric.Rect | null = null;
    let startPoint: { x: number; y: number } | null = null;

    const onMouseDown = (options: fabric.TEvent) => {
      if (!isDrawingRect) return;
      startPoint = canvas.getPointer(options.e);
      rect = new fabric.Rect({
        left: startPoint?.x || 0,
        top: startPoint?.y || 0,
        width: 0,
        height: 0,
        stroke: "green",
        strokeWidth: 2,
        fill: "transparent",
      });
      canvas.add(rect);
    };

    const onMouseMove = (options: fabric.TEvent) => {
      if (!isDrawingRect || !rect || !startPoint) return;
      const pointer = canvas.getPointer(options.e);
      const width = Math.abs(pointer.x - startPoint.x);
      const height = Math.abs(pointer.y - startPoint.y);
      rect.set({
        width: width,
        height: height,
        left: Math.min(startPoint.x, pointer.x),
        top: Math.min(startPoint.y, pointer.y),
      });
      canvas.renderAll();
    };

    const onMouseUp = () => {
      if (!isDrawingRect || !rect) return;
      setIsDrawingRect(false);
      canvas.selection = true;
      canvas.defaultCursor = "default";

      const area = Math.round(rect.width! * rect.height!);

      // Crear un texto con el área
      const areaText = new fabric.Text(`Área: ${area} px²`, {
        left: rect.left,
        top: rect.top! - 20,
        fontSize: 14,
        fill: "green",
      });

      canvas.add(areaText);
      canvas.renderAll();
    };

    canvas.on("mouse:down", onMouseDown as (e: fabric.TEvent) => void);
    canvas.on("mouse:move", onMouseMove as (e: fabric.TEvent) => void);
    canvas.on("mouse:up", onMouseUp as (e: fabric.TEvent) => void);

    return () => {
      canvas.off("mouse:down", onMouseDown);
      canvas.off("mouse:move", onMouseMove);
      canvas.off("mouse:up", onMouseUp);
    };
    saveStateToHistory();
  }, [canvas, isDrawingRect]);

  useEffect(() => {
    if (!canvas) return;

    let circle: fabric.Circle | null = null;
    let startPoint: { x: number; y: number } | null = null;

    const onMouseDown = (options: fabric.TEvent) => {
      if (!isDrawingCircle) return;
      startPoint = canvas.getPointer(options.e);
      circle = new fabric.Circle({
        left: startPoint?.x || 0,
        top: startPoint?.y || 0,
        radius: 0,
        stroke: "green",
        strokeWidth: 2,
        fill: "transparent",
      });
      canvas.add(circle);
    };

    const onMouseMove = (options: fabric.TEvent) => {
      if (!isDrawingCircle || !circle || !startPoint) return;
      const pointer = canvas.getPointer(options.e);
      const radius = Math.sqrt(
        Math.pow(pointer.x - startPoint.x, 2) +
          Math.pow(pointer.y - startPoint.y, 2),
      );
      circle.set({ radius: radius });
      canvas.renderAll();
    };

    const onMouseUp = () => {
      if (!isDrawingCircle || !circle) return;
      setIsDrawingCircle(false);
      canvas.selection = true;
      canvas.defaultCursor = "default";

      const volume = Math.round(
        (4 / 3) * Math.PI * Math.pow(circle.radius!, 3),
      );

      const volumeText = new fabric.Text(`Volumen: ${volume} px³`, {
        left: circle.left,
        top: circle.top! - 20,
        fontSize: 14,
        fill: "green",
      });

      canvas.add(volumeText);
      canvas.renderAll();
    };

    canvas.on("mouse:down", onMouseDown);
    canvas.on("mouse:move", onMouseMove);
    canvas.on("mouse:up", onMouseUp);

    return () => {
      canvas.off("mouse:down", onMouseDown);
      canvas.off("mouse:move", onMouseMove);
      canvas.off("mouse:up", onMouseUp);
    };
    saveStateToHistory();
  }, [canvas, isDrawingCircle]);

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
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 3)); // Aumenta el zoom, hasta un máximo de 3x
  };

  const zoomOut = () => {
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
        const scale = Math.min(scaleX, scaleY); // Escala uniforme

        image.scale(scale);
        image.set({
          left: 100,
          top: 100,
          selectable: false, // Hacemos que la imagen no sea seleccionable
          lockMovementX: true, // Bloqueamos el movimiento en el eje X
          lockMovementY: true, // Bloqueamos el movimiento en el eje Y
          hasControls: false,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
        });

        canvas.add(image);
        canvas.centerObject(image); // Centramos la imagen en el lienzo
        canvas.setActiveObject(image); // Establecemos la imagen como el objeto activo
      }
    };

    reader.readAsDataURL(file); // Leemos la imagen como URL de datos base64
    e.target.value = ""; // Reseteamos el valor del input para permitir seleccionar la misma imagen varias veces
  };
  const addText = () => {
    if (!canvas) return;

    const userText = prompt("Introduce el texto que deseas agregar:");
    if (!userText) return;

    const text = new IText(userText, {
      left: 100,
      top: 100,
      fontSize: 30,
      fill: textColor, // ← usar color del estado
    });

    canvas.add(text);
    canvas.centerObject(text);
    canvas.setActiveObject(text);
    saveStateToHistory();
  };

  // Función para activar/desactivar el modo de dibujo
  const toggleDrawingMode = () => {
    saveStateToHistory();

    if (!canvas) return;

    // Alternar entre el modo de dibujo y el modo normal
    canvas.isDrawingMode = !canvas.isDrawingMode;
    setDrawingMode(canvas.isDrawingMode);

    // Establecer el color y la anchura del pincel al activar el modo de dibujo
    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.color = brushColor;
      canvas.freeDrawingBrush.width = brushWidth;
    }
  };

  // Función para cambiar el color del pincel
  const handleBrushColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrushColor(e.target.value);

    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.color = e.target.value; // Actualizamos el color del pincel
    }
  };

  // Función para cambiar la anchura del pincel
  const handleBrushWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrushWidth(parseInt(e.target.value, 10));

    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.width = parseInt(e.target.value, 10); // Actualizamos la anchura del pincel
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

      canvas.freeDrawingBrush.color = brushColor; // Actualizamos el color del pincel
      canvas.freeDrawingBrush.width = brushWidth; // Actualizamos el tamaño del pincel
    }
  };

  function clearAll() {
    if (window.confirm("Are you sure you want to clear all?")) {
      canvas.remove(...canvas.getObjects());
    }
  }

  function downloadImage() {
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

    // Puedes crear un botón fuera o aquí temporalmente:
    const cropBtn = document.createElement("button");
    cropBtn.innerText = "Confirmar recorte";
    cropBtn.onclick = () => {
      confirmCrop();
      cropBtn.remove();
    };
    document.body.appendChild(cropBtn); // solo para pruebas
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
        <button
          title="Descargar imagen"
          onClick={downloadImage}
          disabled={drawingMode}
        >
          <FontAwesomeIcon icon={faDownload} />
        </button>

        <button title="Borrar todo" onClick={clearAll} disabled={drawingMode}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <div className="h-[2px] w-full bg-white opacity-40 my-2 rounded" />

      {/* Fila 2: Añadir texto */}
      <div className="flex justify-center">
        <button title="Agregar texto" onClick={addText} disabled={drawingMode}>
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
          className={drawingMode ? "bg-yellow-900 p-1 rounded" : ""}
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
            className="w-full bg-gray-800 text-white rounded p-1"
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
          <input
            type="number"
            min="1"
            max="100"
            value={brushWidth}
            onChange={handleBrushWidthChange}
            className="w-full p-1 rounded bg-gray-800 text-white"
          />
        </div>
      )}
      <div className="h-[2px] w-full bg-white opacity-40 my-2 rounded" />

      {/* Fila 4: Rectángulo y Círculo */}
      <div className="flex justify-between gap-2">
        <button
          title="Dibujar rectángulo"
          onClick={startRectDrawing}
          disabled={drawingMode || isDrawingRect}
        >
          <FontAwesomeIcon icon={faDrawPolygon} />
        </button>
        <button
          title="Dibujar círculo"
          onClick={startCircleDrawing}
          disabled={drawingMode || isDrawingCircle}
        >
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
        <button title="Zoom In" onClick={zoomIn} disabled={drawingMode}>
          <FontAwesomeIcon icon={faSearchPlus} />
        </button>
        <button title="Zoom Out" onClick={zoomOut} disabled={drawingMode}>
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
