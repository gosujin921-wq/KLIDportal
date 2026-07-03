import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Tag } from './Tag'

const meta = {
  title: 'KRDS/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    selected: { control: 'boolean' },
    removable: { control: 'boolean' },
  },
  args: {
    children: '산불',
    selected: false,
    removable: false,
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Selectable: Story = {
  render: () => {
    const [selected, setSelected] = useState('산불')
    const options = ['산불', '침수', '화재', '유괴']
    return (
      <div className="flex flex-wrap items-center gap-2">
        {options.map((opt) => (
          <Tag
            key={opt}
            selected={selected === opt}
            onClick={() => setSelected(opt)}
          >
            {opt}
          </Tag>
        ))}
      </div>
    )
  },
}

export const Removable: Story = {
  render: () => {
    const [tags, setTags] = useState(['강원', '경기', '충북'])
    return (
      <div className="flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <Tag
            key={tag}
            removable
            onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))}
          >
            {tag}
          </Tag>
        ))}
        {tags.length === 0 && <span className="text-sm text-gray-500">선택된 지역이 없습니다.</span>}
      </div>
    )
  },
}
