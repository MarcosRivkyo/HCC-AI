import React, { useRef, useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import EditorCanvas from "../../views/Components/EditorCanvas";
import * as fabric from "fabric";

/**
 * Componente: EditorCanvas
 *
 * Descripción:
 * `EditorCanvas` es un componente que encapsula un canvas interactivo utilizando la librería `fabric.js`. 
 * Está diseñado para permitir la creación y manipulación de objetos gráficos en tiempo real mediante eventos del usuario, 
 * como pulsaciones de teclado y acciones de arrastre.
 *
 * Dependencias:
 * - `fabric`: librería para manipulación avanzada de elementos en un canvas HTML5.
 *
 * Funcionalidad:
 * - Inicializa una instancia de `fabric.Canvas` dentro del componente.
 * - Permite agregar, mover y eliminar objetos gráficos sobre el lienzo.
 * - Escucha eventos de teclado para habilitar funcionalidades como movimiento mediante flechas y eliminación con la tecla Supr/Backspace.
 * - No incluye objetos por defecto; requiere que el desarrollador inicialice o importe los elementos a representar.
 */

const meta: Meta<typeof EditorCanvas> = {
  title: "Components/EditorCanvas",
  component: EditorCanvas,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
El componente **EditorCanvas** implementa un lienzo gráfico interactivo mediante la librería \`fabric.js\`, 
permitiendo al usuario manipular objetos en un entorno de dibujo vectorial dentro de la aplicación web.

### Características técnicas:
- Se basa en una instancia de \`fabric.Canvas\`.
- Permite añadir elementos visuales dinámicamente (por ejemplo: rectángulos, líneas, texto).
- Soporta interacción mediante teclado: flechas para mover, tecla Supr para eliminar.
- Es extensible para escenarios de edición de imágenes, anotaciones o generación de gráficos interactivos.

Este componente está pensado como base para herramientas visuales avanzadas en contextos clínicos o educativos, 
donde se requiere una interfaz editable y controlada.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EditorCanvas>;

export const Default: Story = {
  name: "Vista por defecto",  
  parameters: {
    docs: {
      description: {
        story: "Ejemplo básico del lienzo con un rectángulo añadido y soporte de teclado habilitado para pruebas de interacción.",
      },
    },
  },
};
