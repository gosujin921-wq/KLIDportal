import type { Meta, StoryObj } from '@storybook/react-vite'
import { Search } from 'lucide-react'
import { Input } from './Input'

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
  args: {
    label: '데이터셋 이름',
    placeholder: '예: 산불 데이터셋',
    size: 'md',
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Required: Story = {
  args: { required: true },
}

export const WithHint: Story = {
  args: { hint: '검색에 사용할 데이터셋 이름을 입력하세요.' },
}

export const WithError: Story = {
  args: { error: '이미 존재하는 이름입니다.', defaultValue: '산불 데이터셋' },
}

export const WithAddon: Story = {
  args: { label: '검색', leftAddon: <Search className="size-4" />, placeholder: '키워드 검색' },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-4">
      <Input {...args} size="sm" label="Small" />
      <Input {...args} size="md" label="Medium" />
      <Input {...args} size="lg" label="Large" />
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: '수정 불가' },
}
