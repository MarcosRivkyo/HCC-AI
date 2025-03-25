import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';

const CanvasComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current);

    // Crear un rectángulo y añadirlo al canvas
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'red',
      width: 100,
      height: 100,
    });

    canvas.add(rect);
  }, []);

  return (
    <div>
      <h2>Canvas con Fabric.js</h2>
      <canvas ref={canvasRef} width={500} height={400} style={{ border: '1px solid black' }} />
    </div>
  );
};

export default CanvasComponent;
