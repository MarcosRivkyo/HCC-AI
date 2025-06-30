import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useAppNavbarViewModel } from "../../viewmodels/useAppNavbarViewModel";

/**
 * Componente de demostración para el hook `useAppNavbarViewModel`.
 * Muestra cómo exponer y manipular el estado de la barra de navegación principal,
 * incluyendo usuario autenticado, control de menú, navegación y sección activa.
 */
const ViewModelDemo: React.FC = () => {
  const {
    user,
    userData,
    selectedSection,
    isOpen,
    setIsOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    dropdownRef,
    navigate,
    scrollToSection,
  } = useAppNavbarViewModel();

  return (
    <div style={{ padding: 20 }}>
      <h2>useAppNavbarViewModel Demo</h2>
      <p>
        <b>Usuario autenticado:</b> {user ? user.email : "No autenticado"}
      </p>
      <p>
        <b>Datos del usuario:</b>{" "}
        {userData ? JSON.stringify(userData) : "No cargados"}
      </p>
      <p>
        <b>Sección seleccionada:</b> {selectedSection}
      </p>
      <p>
        <b>Menú desplegable abierto:</b>{" "}
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Sí (Cerrar)" : "No (Abrir)"}
        </button>
      </p>
      <p>
        <b>Menú móvil abierto:</b>{" "}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? "Sí (Cerrar)" : "No (Abrir)"}
        </button>
      </p>
      <div
        ref={dropdownRef}
        style={{ border: "1px solid #ccc", padding: 10, marginTop: 10 }}
      >
        <p>Este div simula el dropdown (click afuera lo cierra).</p>
      </div>
      <div style={{ marginTop: 20 }}>
        <button onClick={() => scrollToSection("home")}>Ir a Home</button>{" "}
        <button onClick={() => scrollToSection("technology")}>
          Ir a Tecnología
        </button>
      </div>
    </div>
  );
};

const meta: Meta<typeof ViewModelDemo> = {
  title: "ViewModels/useAppNavbarViewModel",
  component: ViewModelDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Viewmodel \`useAppNavbarViewModel\` que gestiona el estado y comportamiento de la barra de navegación principal.

### Estados y funciones expuestas:
- \`user\`: usuario autenticado actual.
- \`userData\`: datos adicionales del usuario.
- \`selectedSection\`: id de la sección actualmente visible o seleccionada.
- \`isOpen\`: controla si el menú desplegable está abierto.
- \`setIsOpen\`: función para abrir/cerrar el menú desplegable.
- \`mobileMenuOpen\`: controla si el menú móvil está abierto.
- \`setMobileMenuOpen\`: función para abrir/cerrar el menú móvil.
- \`dropdownRef\`: referencia al contenedor dropdown para detectar clicks fuera.
- \`navigate\`: función para navegación programática.
- \`scrollToSection\`: función para hacer scroll animado a secciones específicas.

### Uso recomendado:
Ideal para integrarse en la barra de navegación principal de la aplicación, controlando la experiencia responsiva, navegación y estados visuales.

Este demo simula interacción básica para validar el viewmodel y sus funciones.
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ViewModelDemo>;

export const Default: Story = {
  name: "Demo básico del ViewModel",
};
