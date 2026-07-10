import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconButton } from './IconButton'

const meta = {
  title: 'KRDS/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['ghost', 'filled', 'outline'],
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
    },
    disabled: { control: 'boolean' },
    icon: { control: 'text' },
    label: { control: 'text' },
  },
  args: {
    icon: 'search',
    label: '검색',
    variant: 'ghost',
    size: 'medium',
    disabled: false,
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <IconButton variant="ghost" icon="search" label="검색" />
      <IconButton variant="filled" icon="add" label="추가" />
      <IconButton variant="outline" icon="close" label="닫기" />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <IconButton size="small" icon="person" label="내 정보" variant="outline" />
      <IconButton size="medium" icon="person" label="내 정보" variant="outline" />
      <IconButton size="large" icon="person" label="내 정보" variant="outline" />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <IconButton variant="ghost" icon="download" label="다운로드" disabled />
      <IconButton variant="filled" icon="add" label="추가" disabled />
      <IconButton variant="outline" icon="close" label="닫기" disabled />
    </div>
  ),
}
