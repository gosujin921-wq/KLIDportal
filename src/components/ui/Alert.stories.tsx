import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert } from './Alert'

const meta = {
  title: 'UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'danger'],
    },
    closable: { control: 'boolean' },
  },
  args: {
    variant: 'info',
    title: '안내',
    children: '개인정보가 포함된 데이터는 업로드할 수 없습니다.',
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div className="flex w-[28rem] flex-col gap-3">
      <Alert variant="info" title="안내">
        반출 데이터는 유효기간 만료 시 자동 삭제됩니다.
      </Alert>
      <Alert variant="success" title="완료">
        반출 요청이 정상 접수되었습니다.
      </Alert>
      <Alert variant="warning" title="확인 필요">
        다운로드 기한이 3일 남았습니다.
      </Alert>
      <Alert variant="danger" title="오류">
        업로드 용량 한도를 초과했습니다.
      </Alert>
    </div>
  ),
}

export const Closable: Story = {
  args: { closable: true },
}

export const WithoutTitle: Story = {
  args: { title: undefined, children: '제목 없이 본문만 표시되는 알림입니다.' },
}
