import React, { useRef, useEffect, useState } from 'react';
import Toolbox from './Toolbox';
import EditorCanvas from './EditorCanvas';
import '../../App.css';
import * as fabric from 'fabric';
import { Canvas, PencilBrush, CircleBrush, SprayBrush, FabricImage, filters, Image, Object as FabricObject } from 'fabric';
import logoHCC_AI from "./assets/images/logo_hcc_ai.jpg";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useLocation } from 'react-router-dom';

const FabricEditor: React.FC = () => {
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);

  const imageUrl = new URLSearchParams(location.search).get('imageUrl');

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new Canvas(canvasRef.current, { backgroundColor: 'white' });
      fabricCanvas.setDimensions({ width: 500, height: 500 });

      const brush = new PencilBrush(fabricCanvas);
      brush.color = 'black';
      brush.width = 5;
      fabricCanvas.freeDrawingBrush = brush;

      setCanvas(fabricCanvas);

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, []);

  useEffect(() => {

      
    if (imageUrl && canvas) {
        const loadImage = async () => {
          try {
            // Carga la imagen con el parámetro crossOrigin
            const image = await fabric.Image.fromURL(imageUrl, {
              crossOrigin: 'anonymous',
            });
            
            // Ajuste de tamaño de la imagen
            const maxWidth = 500;
            const maxHeight = 500;
            const scaleX = maxWidth / image.width!;
            const scaleY = maxHeight / image.height!;
            const scale = Math.min(scaleX, scaleY);
            
            image.scale(scale);
            image.set({
              left: 100,
              top: 100,
              selectable: false,
              lockMovementX: true,
              lockMovementY: true,
              hasControls: false,
              lockRotation: true,
              lockScalingX: true,
              lockScalingY: true,
            });
            
            canvas.add(image);
            canvas.centerObject(image);
            canvas.setActiveObject(image);
          } catch (error) {
            console.error('Error loading image:', error);
          }
        };
      
        loadImage();
        toast.success("Imagen cargada!");
      }
      
      
  }, [imageUrl, canvas]);

  return (
    <div className="editor">
    <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />

      <div className="editor-left">
        <Toolbox canvas={canvas} />
        <EditorCanvas ref={canvasRef} canvas={canvas} />
        <button className="predict-button">Predecir</button>
      </div>

      <div className="editor-right">
        <div className="result-display">
          Resultado de la predicción aparecerá aquí.
        </div>
      </div>
    </div>
  );
};

export default FabricEditor;