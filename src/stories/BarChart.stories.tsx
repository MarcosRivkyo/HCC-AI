// BarChart.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import BarChart from '../views/Components/BarChart';

const meta: Meta<typeof BarChart> = {
  title: 'Views/BarChart',
  component: BarChart,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof BarChart>;

export const Default: Story = {
  args: {
    labels: ['Class A', 'Class B', 'Class C'],
    probabilities: [0.85, 0.1, 0.05],
    theme: 'light',
  },
};
