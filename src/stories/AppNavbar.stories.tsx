
import type { Meta, StoryObj } from '@storybook/react';
import Navbar from '../views/Components/AppNavbar';

// Configuración del componente
const meta: Meta<typeof Navbar> = {
  title: 'Views/Navbar',
  component: Navbar,
  tags: ['autodocs'],
};

export default meta;

// Historia base (sin props en este caso)
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {};