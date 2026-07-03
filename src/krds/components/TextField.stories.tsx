import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextField } from './TextField'

const meta = {
  title: 'KRDS/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['medium', 'large'] },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    iconLeft: { control: 'text' },
  },
  args: {
    label: '기관명',
    placeholder: '기관명을 입력하세요',
    hint: '사업자등록증에 기재된 기관명을 입력합니다.',
    size: 'medium',
    required: false,
    disabled: false,
    readOnly: false,
  },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <TextField {...args} value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <TextField label="보통 크기" size="medium" placeholder="medium" />
      <TextField label="큰 크기" size="large" placeholder="large" />
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <div className="w-80">
      <TextField
        label="담당자 이름"
        required
        placeholder="이름을 입력하세요"
        hint="필수 입력 항목입니다."
      />
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <TextField label="검색어" iconLeft="search" placeholder="검색어를 입력하세요" />
      <TextField label="비밀번호" type="password" iconLeft="lock" placeholder="비밀번호" />
      <TextField label="요청 금액" suffix="원" placeholder="0" />
    </div>
  ),
}

export const ErrorState: Story = {
  render: () => (
    <div className="w-80">
      <TextField
        label="이메일"
        required
        defaultValue="invalid-email"
        error="올바른 이메일 형식이 아닙니다."
        iconLeft="person"
      />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <TextField label="비활성 입력" disabled defaultValue="수정할 수 없습니다." />
      <TextField label="읽기 전용" readOnly defaultValue="조회만 가능합니다." />
    </div>
  ),
}
