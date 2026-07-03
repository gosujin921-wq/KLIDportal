import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    dot: { control: 'boolean' },
    count: { control: 'number' },
    maxCount: { control: 'number' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    children: 'NEW',
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="sm">SM</Badge>
      <Badge size="md">MD</Badge>
      <Badge size="lg">LG</Badge>
    </div>
  ),
}

export const Count: Story = {
  args: { count: 8 },
}

export const CountOverflow: Story = {
  args: { count: 128, maxCount: 99, variant: 'danger' },
}

export const Dot: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge dot variant="primary" />
      <Badge dot variant="success" />
      <Badge dot variant="danger" />
    </div>
  ),
}
