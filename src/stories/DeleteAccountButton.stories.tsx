
import type { Meta, StoryObj } from '@storybook/react';
import DeleteAccountButton from '../views/Components/DeleteAccountButton';
// Configuración del componente
const meta: Meta<typeof DeleteAccountButton> = {
  title: 'Views/DeleteAccountButton',
  component: DeleteAccountButton,
  tags: ['autodocs'],
};

export default meta;

// Historia base (sin props en este caso)
type Story = StoryObj<typeof DeleteAccountButton>;

export const Default: Story = {};