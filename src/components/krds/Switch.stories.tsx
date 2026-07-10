import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Switch } from './Switch'

const meta = {
  title: 'KRDS/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: '이메일 알림 받기',
    checked: true,
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <Switch
        label="반출 완료 시 알림"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    )
  },
}

export const States: Story = {
  render: () => {
    const [on, setOn] = useState(true)
    const [off, setOff] = useState(false)
    return (
      <div className="flex flex-col gap-3">
        <Switch label="켜짐" checked={on} onChange={(e) => setOn(e.target.checked)} />
        <Switch label="꺼짐" checked={off} onChange={(e) => setOff(e.target.checked)} />
        <Switch label="비활성 꺼짐" checked={false} disabled />
        <Switch label="비활성 켜짐" checked disabled />
      </div>
    )
  },
}
