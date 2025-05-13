import React, { useEffect, useRef, ForwardedRef } from "react";
import * as fabric from "fabric";

interface EditorCanvasProps {
  canvas: fabric.Canvas | null;
}

const EditorCanvas = React.forwardRef<HTMLCanvasElement, EditorCanvasProps>(
  ({ canvas }, ref: ForwardedRef<HTMLCanvasElement>) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
      if (canvasRef.current && !canvas) {
        const fabricCanvas = new fabric.Canvas(canvasRef.current);
        fabricCanvas.setDimensions({ width: 1000, height: 500 });

        return () => {
          fabricCanvas.dispose();
        };
      }
    }, [canvas]);

    useEffect(() => {
      function handleKeyDown(e: KeyboardEvent) {
        if (!canvas) return;

        if (e.key === "Delete") {
          for (const obj of canvas.getActiveObjects()) {
            canvas.remove(obj);
          }
          canvas.discardActiveObject();
        }

        if (
          ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
        ) {
          const activeObject = canvas.getActiveObject();
          if (activeObject) {
            const step = 10; // Move step size
            switch (e.key) {
              case "ArrowUp":
                activeObject.top = (activeObject.top as number) - step;
                break;
              case "ArrowDown":
                activeObject.top = (activeObject.top as number) + step;
                break;
              case "ArrowLeft":
                activeObject.left = (activeObject.left as number) - step;
                break;
              case "ArrowRight":
                activeObject.left = (activeObject.left as number) + step;
                break;
              default:
                break;
            }
            activeObject.setCoords();
            canvas.renderAll();
          }
        }
      }

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [canvas]);

    return <canvas ref={ref || canvasRef} />;
  },
);

export default EditorCanvas;
