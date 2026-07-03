import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Radio } from './Radio'

const meta = {
  title: 'KRDS/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    name: 'sample',
    value: 'option-1',
    label: '영상과 이미지 세트',
    checked: true,
  },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Group: Story = {
  render: () => {
    const [value, setValue] = useState('video-image')
    const options = [
      { value: 'video-image', label: '영상과 이미지 세트' },
      { value: 'image-only', label: '이미지만 반출' },
      { value: 'video-only', label: '영상만 반출' },
    ]
    return (
      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <Radio
            key={opt.value}
            name="export-unit"
            value={opt.value}
            label={opt.label}
            checked={value === opt.value}
            onChange={() => setValue(opt.value)}
          />
        ))}
      </div>
    )
  },
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Radio name="states" value="checked" label="선택됨" checked />
      <Radio name="states" value="unchecked" label="선택 안됨" />
      <Radio name="states" value="disabled" label="비활성" disabled />
      <Radio name="states-2" value="disabled-checked" label="비활성 선택됨" checked disabled />
    </div>
  ),
}
