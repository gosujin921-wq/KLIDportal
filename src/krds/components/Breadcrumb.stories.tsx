import type { Meta, StoryObj } from '@storybook/react-vite'
import { Breadcrumb } from './Breadcrumb'

const meta = {
  title: 'KRDS/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: {
    items: [
      { label: '데이터 검색', href: '#' },
      { label: '검색 결과', href: '#' },
      { label: '상세 정보' },
    ],
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FourLevels: Story = {
  args: {
    items: [
      { label: '워크스페이스', href: '#' },
      { label: '반출 현황', href: '#' },
      { label: '요청 상세', href: '#' },
      { label: '다운로드 관리' },
    ],
  },
}
