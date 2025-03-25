import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

const ImageEditor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const [drawingMode, setDrawingMode] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const canvasEl = document.createElement('canvas');
    canvasEl.width = 600;
    canvasEl.height = 400;
    canvasEl.style.border = '1px solid black';

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(canvasEl);

    const canvas = new fabric.Canvas(canvasEl, {
      isDrawingMode: false,
    });

    canvasRef.current = canvas;

    // Limpieza al desmontar
    return () => {
      canvas.dispose();
    };
  }, []);

  // Maneja la carga de la imagen
  const handleUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const imgElement = new Image();
      imgElement.src = e.target.result;

      imgElement.onload = () => {
        const imgInstance = new fabric.Image(imgElement, {
          left: 0,
          top: 0,
          scaleX: canvasRef.current?.width! / imgElement.width,
          scaleY: canvasRef.current?.height! / imgElement.height,
        });

        // Establecer la imagen como fondo
        if (canvasRef.current) {
          canvasRef.current.backgroundImage = imgInstance;
          canvasRef.current.renderAll(); // Asegura que se renderice correctamente
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const addRectangle = () => {
    if (!canvasRef.current) return;
    const rect = new fabric.Rect({
      left: 50,
      top: 50,
      fill: 'rgba(0,0,255,0.5)',
      width: 100,
      height: 60,
    });
    canvasRef.current.add(rect);
  };

  const addCircle = () => {
    if (!canvasRef.current) return;
    const circle = new fabric.Circle({
      left: 150,
      top: 100,
      fill: 'rgba(255,0,0,0.5)',
      radius: 40,
    });
    canvasRef.current.add(circle);
  };

  const addLine = () => {
    if (!canvasRef.current) return;
    const line = new fabric.Line([50, 50, 200, 100], {
      stroke: 'green',
      strokeWidth: 3,
    });
    canvasRef.current.add(line);
  };

  const toggleDrawing = () => {
    if (!canvasRef.current) return;
    const mode = !drawingMode;
    canvasRef.current.isDrawingMode = mode;
    setDrawingMode(mode);
    canvasRef.current.renderAll(); // Asegura que se actualice el lienzo al cambiar el modo
  };

  const addText = () => {
    if (!canvasRef.current) return;
    const text = new fabric.IText('Anotación...', {
      left: 100,
      top: 200,
      fontSize: 20,
      fill: 'black',
    });
    canvasRef.current.add(text);
  };

  const clearCanvas = () => {
    canvasRef.current?.clear();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <input type="file" accept="image/*" onChange={handleUploadImage} />
        <button onClick={addRectangle} className="px-3 py-1 bg-blue-500 text-white rounded">Rectángulo</button>
        <button onClick={addCircle} className="px-3 py-1 bg-red-500 text-white rounded">Círculo</button>
        <button onClick={addLine} className="px-3 py-1 bg-green-500 text-white rounded">Línea</button>
        <button onClick={toggleDrawing} className="px-3 py-1 bg-yellow-500 text-black rounded">
          {drawingMode ? 'Desactivar Dibujo' : 'Dibujar a mano'}
        </button>
        <button onClick={addText} className="px-3 py-1 bg-gray-500 text-white rounded">Anotar</button>
        <button onClick={clearCanvas} className="px-3 py-1 bg-black text-white rounded">Limpiar</button>
      </div>

      <div ref={containerRef} className="w-full h-auto" />
    </div>
  );
};

export default ImageEditor;
