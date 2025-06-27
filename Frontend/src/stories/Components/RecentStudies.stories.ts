import type { Meta, StoryObj } from "@storybook/react";
import EstudiosRecientes from "../../views/Components/RecentStudies_storybook";


const meta: Meta<typeof EstudiosRecientes> = {
  title: "Components/EstudiosRecientes",
  component: EstudiosRecientes,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Componente **EstudiosRecientes** que permite listar, filtrar, descargar y eliminar estudios clínicos recientes.

### Características:
- Búsqueda por nombre, estado y fecha.
- Soporta paginación.
- Muestra menú de acciones por estudio.
- Modal de confirmación para eliminar.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof EstudiosRecientes>;

export const Default: Story = {
  name: "Vista por defecto",  
  args: {
    mockData: {
      paginaActual: 1,
      estudiosPaginados: [
        {
          id: "1",
          studieName: "Estudio Hepático 01",
          status: "Finalizado",
          studieDate: {
            toDate: () => new Date("2024-01-15T14:30:00"),
          },
        },
        {
          id: "2",
          studieName: "Control Quirúrgico",
          status: "En Progreso",
          studieDate: {
            toDate: () => new Date("2024-02-20T09:00:00"),
          },
        },
      ],
      estudiosFiltrados: [
        {
          id: "1",
          studieName: "Estudio Hepático 01",
          status: "Finalizado",
          studieDate: {
            toDate: () => new Date("2024-01-15T14:30:00"),
          },
        },
        {
          id: "2",
          studieName: "Control Quirúrgico",
          status: "En Progreso",
          studieDate: {
            toDate: () => new Date("2024-02-20T09:00:00"),
          },
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Estudios recientes simulados con opciones de filtro, acciones y eliminación.",
      },
    },
  },
};
