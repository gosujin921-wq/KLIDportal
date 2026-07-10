import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert } from './Alert'

const meta = {
  title: 'KRDS/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['information', 'success', 'warning', 'danger'],
    },
  },
  args: {
    tone: 'information',
    title: '데이터 반출 안내',
    children: '반출 데이터셋은 다운로드 기한이 지나면 자동으로 삭제됩니다.',
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-3" style={{ maxWidth: 560 }}>
      <Alert
        tone="information"
        title="데이터 반출 안내"
        onClose={() => {}}
      >
        반출 데이터셋은 다운로드 기한이 지나면 자동으로 삭제됩니다.
      </Alert>
      <Alert
        tone="success"
        title="반출 요청이 완료되었습니다"
        onClose={() => {}}
      >
        워크스페이스에서 처리 상태와 다운로드 기한을 확인하실 수 있습니다.
      </Alert>
      <Alert
        tone="warning"
        title="다운로드 기한이 임박했습니다"
        onClose={() => {}}
      >
        해당 데이터셋의 유효기간이 3일 남았습니다. 기한 내 다운로드를 완료해 주십시오.
      </Alert>
      <Alert
        tone="danger"
        title="업로드가 제한되었습니다"
        onClose={() => {}}
      >
        개인정보가 포함된 데이터는 업로드할 수 없습니다. 관리자 정책을 확인해 주십시오.
      </Alert>
    </div>
  ),
}

export const Dismissible: Story = {
  args: {
    tone: 'warning',
    title: '다운로드 기한이 임박했습니다',
    children: '해당 데이터셋의 유효기간이 3일 남았습니다.',
    onClose: () => {},
  },
}
