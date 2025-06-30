// src/stories/usePreventZoom.stories.tsx
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import usePreventZoom from "../../views/Components/usePreventZoom";

/**
 * Componente: usePreventZoom (Demo)
 *
 * Descripción:
 * Este componente de demostración utiliza el hook personalizado `usePreventZoom` para desactivar los mecanismos de zoom
 * predeterminados del navegador. Resulta especialmente útil en aplicaciones donde el escalado visual puede interferir con la precisión del diseño,
 * como visores médicos, editores gráficos o interfaces con layouts fijos.
 *
 * Dependencias:
 * - `React`: ciclo de vida y estructura funcional.
 * - `usePreventZoom`: hook personalizado que gestiona eventos globales del navegador.
 *
 * Funcionalidad:
 * - Previene el zoom con `Ctrl + Scroll` (rueda del ratón).
 * - Previene el zoom con combinaciones de teclado como `Ctrl + + / -`.
 * - Permite activar/desactivar ambos mecanismos de forma independiente mediante parámetros booleanos.
 */

const UsePreventZoomDemo: React.FC = () => {
  usePreventZoom(true, true); // Bloquea tanto zoom por scroll como por teclado

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold mb-4">Demo: usePreventZoom</h2>
      <p>
        Prueba realizar <strong>Ctrl + Scroll</strong> o{" "}
        <strong>Ctrl + + / -</strong>. El navegador no responderá con zoom
        gracias a la acción del hook.
      </p>
      <p className="mt-4 text-gray-500">
        Este comportamiento es útil en interfaces sensibles al escalado, como
        editores, dashboards o visores clínicos.
      </p>
    </div>
  );
};

const meta: Meta<typeof UsePreventZoomDemo> = {
  title: "Components/usePreventZoom",
  component: UsePreventZoomDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
El hook **usePreventZoom** desactiva la funcionalidad de zoom predeterminado del navegador, comúnmente activado por:

- Combinación de teclas: \`Ctrl + + / -\`
- Rueda del ratón: \`Ctrl + Scroll\`

### Sintaxis de uso:

\`\`\`tsx
usePreventZoom();           // Previene zoom por teclado y scroll
usePreventZoom(true, false); // Solo bloquea zoom con scroll
usePreventZoom(false, true); // Solo bloquea zoom con teclado
\`\`\`

### Aplicaciones recomendadas:
- Interfaces gráficas con resolución fija.
- Editores de imagen, vídeo o lienzos interactivos.
- Plataformas clínicas con estructuras visuales críticas.

Este hook puede utilizarse a nivel de componente o vista, y se recomienda aplicarlo con precaución para no interferir con accesibilidad si no es estrictamente necesario.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof UsePreventZoomDemo>;

export const Default: Story = {
  name: "Vista por defecto",
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo por defecto que previene el zoom por scroll y combinaciones de teclado al activar el hook con ambos flags en true.",
      },
    },
  },
};
