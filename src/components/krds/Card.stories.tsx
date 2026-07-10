import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardHeader } from './Card'

const meta = {
  title: 'KRDS/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    padding: {
      control: 'inline-radio',
      options: ['none', 'small', 'medium', 'large'],
    },
    interactive: { control: 'boolean' },
  },
  args: {
    padding: 'large',
    interactive: false,
    children: 'AI 영상학습 데이터 포털 카드 표면입니다.',
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const PaddingVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Card padding="none">여백 없음 (none)</Card>
      <Card padding="small">작은 여백 (small)</Card>
      <Card padding="medium">중간 여백 (medium)</Card>
      <Card padding="large">큰 여백 (large)</Card>
    </div>
  ),
}

export const Interactive: Story = {
  args: {
    interactive: true,
    children: '클릭 가능한 카드입니다. 마우스를 올리면 테두리와 그림자가 강조됩니다.',
    onClick: () => {},
  },
}

export const WithHeader: Story = {
  render: () => (
    <Card padding="large" style={{ maxWidth: 480 }}>
      <CardHeader
        icon="payments"
        title="데이터 반출 요청"
        description="이벤트 유형과 기간을 선택하여 영상 및 이미지 세트를 신청합니다."
        action={<span style={{ font: 'var(--krds-detail-medium)', color: 'var(--krds-color-text-subtle)' }}>3건</span>}
      />
      <p style={{ font: 'var(--krds-body-small)', color: 'var(--krds-color-text-subtle)', margin: 0 }}>
        반출 데이터는 유효기간이 지나면 자동으로 삭제됩니다.
      </p>
    </Card>
  ),
}
