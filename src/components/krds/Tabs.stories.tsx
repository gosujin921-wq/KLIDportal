import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from './Tabs'

const items = [
  { id: 'overview', label: '개요' },
  { id: 'search', label: '데이터 검색' },
  { id: 'export', label: '반출 현황' },
  { id: 'workspace', label: '워크스페이스' },
]

const meta = {
  title: 'KRDS/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: { items, value: 'overview' },
  argTypes: {
    value: { control: false },
    onChange: { control: false },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('overview')
    return <Tabs items={items} value={value} onChange={setValue} />
  },
}

const iconItems = [
  { id: 'home', label: '홈', icon: 'home' },
  { id: 'data', label: '데이터', icon: 'description' },
  { id: 'billing', label: '반출 관리', icon: 'payments' },
]

export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = useState('home')
    return <Tabs items={iconItems} value={value} onChange={setValue} />
  },
}
