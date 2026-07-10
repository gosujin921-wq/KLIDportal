import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'KRDS/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    label: '이용약관에 동의합니다.',
    checked: false,
    indeterminate: false,
    disabled: false,
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked ?? false)
    return <Checkbox {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)} />
  },
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox label="선택 안 됨" checked={false} />
      <Checkbox label="선택됨" checked />
      <Checkbox label="부분 선택" indeterminate />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox label="비활성 (선택 안 됨)" disabled />
      <Checkbox label="비활성 (선택됨)" checked disabled />
      <Checkbox label="비활성 (부분 선택)" indeterminate disabled />
    </div>
  ),
}

export const Group: Story = {
  render: () => {
    const items = ['산불', '침수', '화재', '유괴']
    const [checked, setChecked] = useState<string[]>(['산불'])
    const allChecked = checked.length === items.length
    const someChecked = checked.length > 0 && !allChecked
    return (
      <div className="flex flex-col gap-3">
        <Checkbox
          label="전체 선택"
          checked={allChecked}
          indeterminate={someChecked}
          onChange={(e) => setChecked(e.target.checked ? [...items] : [])}
        />
        <div className="ml-6 flex flex-col gap-2">
          {items.map((item) => (
            <Checkbox
              key={item}
              label={item}
              checked={checked.includes(item)}
              onChange={(e) =>
                setChecked((prev) =>
                  e.target.checked ? [...prev, item] : prev.filter((v) => v !== item)
                )
              }
            />
          ))}
        </div>
      </div>
    )
  },
}
