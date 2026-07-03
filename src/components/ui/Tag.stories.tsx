import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tag } from './Tag'

const meta = {
  title: 'UI/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'primary', 'success', 'warning', 'danger', 'info'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    closable: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    variant: 'default',
    size: 'md',
    children: '산불',
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Tag variant="default">기본</Tag>
      <Tag variant="primary">강원</Tag>
      <Tag variant="success">완료</Tag>
      <Tag variant="warning">검토중</Tag>
      <Tag variant="danger">산불</Tag>
      <Tag variant="info">침수</Tag>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Tag size="sm">Small</Tag>
      <Tag size="md">Medium</Tag>
      <Tag size="lg">Large</Tag>
    </div>
  ),
}

export const Closable: Story = {
  args: { closable: true, variant: 'primary', onClose: () => {} },
}

export const Disabled: Story = {
  args: { disabled: true, closable: true },
}
