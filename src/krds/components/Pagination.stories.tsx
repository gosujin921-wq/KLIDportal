import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pagination } from './Pagination'

const meta = {
  title: 'KRDS/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { page: 1, totalPages: 12 },
  argTypes: {
    page: { control: false },
    onChange: { control: false },
    totalPages: { control: { type: 'number' } },
    maxButtons: { control: { type: 'number' } },
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    return <Pagination page={page} totalPages={12} onChange={setPage} />
  },
}

export const MidRange: Story = {
  render: () => {
    const [page, setPage] = useState(6)
    return <Pagination page={page} totalPages={12} onChange={setPage} />
  },
}

export const WiderRange: Story = {
  render: () => {
    const [page, setPage] = useState(5)
    return <Pagination page={page} totalPages={20} maxButtons={7} onChange={setPage} />
  },
}
