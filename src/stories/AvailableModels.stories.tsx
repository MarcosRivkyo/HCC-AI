import type { Meta, StoryObj } from '@storybook/react';
import ModelosDisponibles from '../views/Components/AvailableModels'; // o './ModelosDisponibles'
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../config/i18n';
import { ModelData } from '../models/AiModels';

const meta: Meta<typeof ModelosDisponibles> = {
  title: 'Views/ModelosDisponibles',
  component: ModelosDisponibles,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
        <I18nextProvider i18n={i18n}>
          <Story />
        </I18nextProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ModelosDisponibles>;

const exampleModels: ModelData[] = [
  {
    modelId: '1',
    modelName: 'Clasificador Hepático',
    modelType: 'Clasificación',
    accuracy: 0.92,
    description: 'Detecta hígado graso con alta precisión.',
    trainDate: {
      toDate: () => new Date('2024-05-15T10:00:00'),
    },
  },
  {
    modelId: '2',
    modelName: 'Segmentador CT',
    modelType: 'Segmentación',
    accuracy: 0.88,
    description: 'Segmentación de tomografías computarizadas.',
    trainDate: {
      toDate: () => new Date('2024-04-01T14:30:00'),
    },
  },
];

export const Default: Story = {
  args: {
    models: exampleModels,
  },
};