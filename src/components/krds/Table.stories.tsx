import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table } from './Table'

const meta = {
  title: 'KRDS/Table',
  component: Table,
  tags: ['autodocs'],
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const columns = [
  { key: 'region', header: '지역', width: '120px' },
  { key: 'event', header: '이벤트 유형' },
  { key: 'videos', header: '영상 수', align: 'right' as const, width: '120px' },
  { key: 'status', header: '상태', align: 'center' as const, width: '120px' },
]

const rows = [
  { region: '강원특별자치도', event: '산불', videos: '1,240', status: '제공중' },
  { region: '부산광역시', event: '침수', videos: '860', status: '제공중' },
  { region: '경기도', event: '화재', videos: '2,015', status: '검토중' },
  { region: '전라남도', event: '유괴', videos: '312', status: '준비중' },
]

export const Default: Story = {
  args: {
    caption: '지역별 데이터 제공 현황',
    columns,
    rows,
  },
}

export const WithoutCaption: Story = {
  args: {
    columns,
    rows,
  },
}
