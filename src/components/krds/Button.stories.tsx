import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'

const meta = {
  title: 'KRDS/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'tertiary', 'danger'],
    },
    size: {
      control: 'inline-radio',
      options: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
    },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    iconLeft: { control: 'text' },
    iconRight: { control: 'text' },
  },
  args: {
    variant: 'primary',
    size: 'medium',
    disabled: false,
    fullWidth: false,
    children: '신청하기',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">기본 동작</Button>
      <Button variant="secondary">보조 동작</Button>
      <Button variant="tertiary">텍스트 동작</Button>
      <Button variant="danger">삭제하기</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xsmall">아주 작게</Button>
      <Button size="small">작게</Button>
      <Button size="medium">보통</Button>
      <Button size="large">크게</Button>
      <Button size="xlarge">아주 크게</Button>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary" iconLeft="download">
        다운로드
      </Button>
      <Button variant="secondary" iconRight="chevron_right">
        다음 단계
      </Button>
      <Button variant="tertiary" iconLeft="add">
        항목 추가
      </Button>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary" disabled>
        기본 동작
      </Button>
      <Button variant="secondary" disabled>
        보조 동작
      </Button>
      <Button variant="danger" disabled>
        삭제하기
      </Button>
    </div>
  ),
}

export const FullWidth: Story = {
  render: () => (
    <div className="w-80">
      <Button variant="primary" fullWidth iconLeft="check">
        반출 요청 제출
      </Button>
    </div>
  ),
}
