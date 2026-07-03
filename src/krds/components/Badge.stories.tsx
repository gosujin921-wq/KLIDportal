import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const meta = {
  title: 'KRDS/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'primary', 'success', 'danger', 'warning', 'information'],
    },
    variant: { control: 'inline-radio', options: ['soft', 'solid'] },
    icon: { control: 'text' },
  },
  args: {
    tone: 'primary',
    variant: 'soft',
    children: '처리중',
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Tones: Story = {
  // soft/solid 를 톤별 컬럼으로 정렬: 6컬럼 grid(각 컬럼 폭 = 콘텐츠 최대폭)에
  // soft 행 6개 → solid 행 6개를 순서대로 배치하면 위아래가 정확히 맞는다.
  render: () => (
    <div
      className="grid w-fit items-center gap-x-3 gap-y-2"
      style={{ gridTemplateColumns: 'repeat(6, max-content)' }}
    >
      <Badge tone="neutral" variant="soft">대기</Badge>
      <Badge tone="primary" variant="soft">처리중</Badge>
      <Badge tone="success" variant="soft">완료</Badge>
      <Badge tone="danger" variant="soft">반려</Badge>
      <Badge tone="warning" variant="soft">검토</Badge>
      <Badge tone="information" variant="soft">안내</Badge>
      <Badge tone="neutral" variant="solid">대기</Badge>
      <Badge tone="primary" variant="solid">처리중</Badge>
      <Badge tone="success" variant="solid">완료</Badge>
      <Badge tone="danger" variant="solid">반려</Badge>
      <Badge tone="warning" variant="solid">검토</Badge>
      <Badge tone="information" variant="solid">안내</Badge>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge tone="success" variant="soft" icon="check_circle">반출 완료</Badge>
      <Badge tone="information" variant="soft" icon="info">안내</Badge>
      <Badge tone="warning" variant="solid" icon="warning">기한 임박</Badge>
      <Badge tone="danger" variant="solid" icon="error">만료</Badge>
    </div>
  ),
}
