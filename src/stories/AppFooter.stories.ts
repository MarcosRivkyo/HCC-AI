
import type { Meta, StoryObj } from '@storybook/react';
import Footer from "../views/Components/AppFooter";

// Configuración del componente
const meta: Meta<typeof Footer> = {
  title: 'Views/Footer',
  component: Footer,
  tags: ['autodocs'],
};

export default meta;

// Historia base (sin props en este caso)
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};