import React, { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useAuthRouteViewModel } from "../../viewmodels/useAuthRouteViewModel";
import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";

/**
 * Componente de demostración para el hook `useAuthRouteViewModel`.
 * Simula el control de rutas protegidas y públicas según el estado de autenticación
 * y el rol del usuario, mostrando mensajes de carga y redireccionamientos.
 */
const AuthRouteViewModelDemo: React.FC = () => {
  const { loading, user } = useAuthRouteViewModel();

  if (loading) {
    return <p>Cargando estado de autenticación...</p>;
  }

  if (!user) {
    return <p>Usuario no autenticado. Redirigiendo a Login...</p>;
  }

  return <p>Usuario autenticado: {user.email}</p>;
};

const meta: Meta<typeof AuthRouteViewModelDemo> = {
  title: "ViewModels/useAuthRouteViewModel",
  component: AuthRouteViewModelDemo,
  tags: ["autodocs"],

  parameters: {
    docs: {
      description: {
        component: `
Viewmodel \`useAuthRouteViewModel\` encargado de controlar el acceso a rutas según el estado de autenticación y rol del usuario.

### Funcionalidad:
- Escucha cambios de autenticación con \`AuthDAO\`.
- Verifica si el usuario está verificado y autenticado.
- Consulta el rol del usuario mediante \`UserDAO\`.
- Redirige a páginas públicas o privadas según estado y rol.
- Muestra estados de carga y controla navegación con \`react-router-dom\`.

### Uso:
Se recomienda emplear este viewmodel en componentes de enrutamiento o layout para proteger rutas sensibles en la aplicación. Es por ello que se utilzia en el Router, cada vez que se intenta acceder a secciones o rutas privadas.

---


        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof AuthRouteViewModelDemo>;

export const Default: Story = {
  name: "Demo de control de rutas autenticadas",
};
