import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from './Select'

const regionOptions = [
  { value: 'seoul', label: '서울특별시' },
  { value: 'gangwon', label: '강원특별자치도' },
  { value: 'busan', label: '부산광역시' },
  { value: 'jeju', label: '제주특별자치도' },
]

const meta = {
  title: 'KRDS/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['medium', 'large'] },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
  },
  args: {
    label: '지역 선택',
    placeholder: '지역을 선택하세요',
    hint: '데이터를 조회할 지역을 선택합니다.',
    options: regionOptions,
    size: 'medium',
    required: false,
    disabled: false,
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <Select {...args} value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Select label="보통 크기" size="medium" options={regionOptions} />
      <Select label="큰 크기" size="large" options={regionOptions} />
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <div className="w-80">
      <Select label="이벤트 유형" required options={['산불', '침수', '화재', '유괴']} hint="필수 선택 항목입니다." />
    </div>
  ),
}

export const ErrorState: Story = {
  render: () => (
    <div className="w-80">
      <Select label="지역 선택" required options={regionOptions} error="지역을 선택해 주세요." />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <Select label="비활성 선택" disabled options={regionOptions} hint="현재 선택할 수 없습니다." />
    </div>
  ),
}
