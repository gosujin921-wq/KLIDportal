import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { EventTypeKey } from '@/mockup/domain/eventTypes'
import type { Dataset } from '@/mockup/mocks/datasets'
import {
  exportRequests as exportSeed,
  myDatasets as myDatasetSeed,
  augmentJobs as augmentSeed,
  workJobs as workJobSeed,
  type ExportRequest,
  type MyDataset,
  type AugmentJob,
  type WorkJob,
} from '@/mockup/mocks/workspace'
import { daysAgo, dDay } from '@/mockup/mocks/dates'

/**
 * 데모용 "워크스페이스" 스토어 (실제 서버 없음).
 *
 * 검색 → 다운로드 신청 → 워크스페이스 반출 현황 → 증강까지 한 시나리오가
 * 같은 상태를 공유해 실제로 이어지도록 한다. 라이브 간담회 시연 기준으로
 * 상태 전환은 짧은 타이머로 자동 진행한다(심사중→승인완료, 증강 진행중→완료).
 *
 * 기존 mocks/workspace.ts 배열을 시드로 깔아 화면은 채워진 채 시작하고,
 * 사용자 액션이 그 위에 얹힌다.
 */

/** 시연용 상태 전환 타이밍 (ms). 짧게 잡아 "반응"이 바로 보이게 한다. */
const APPROVE_DELAY = 2600
const AUGMENT_TICK = 550
const AUGMENT_STEP = 16

/** 증강 원본 후보 (반출받은 데이터 + 저작 결과물) */
export interface AugmentSource {
  id: string
  title: string
  type: EventTypeKey
  origin: '반출' | '저작'
}

interface RunAugmentInput {
  sourceTitle: string
  sourceType: EventTypeKey
  options: string[]
  multiple: string
}

interface DemoWorkspaceStore {
  exportRequests: ExportRequest[]
  myDatasets: MyDataset[]
  augmentJobs: AugmentJob[]
  workJobs: WorkJob[]
  /** 증강 화면 원본 드롭다운용 (반출 완료분 + 저작 결과물) */
  augmentSources: AugmentSource[]
  /** 검색 상세에서 다운로드 신청. 반출요청 생성 후 자동 승인. */
  requestExport: (dataset: Dataset) => ExportRequest
  /** 반출 데이터 다운로드. 완료 표시 + 증강 원본으로 편입. */
  downloadExport: (reqId: string) => void
  /** 증강 실행. 이력 + 대시보드 진행중 작업에 반영 후 자동 완료. */
  runAugment: (input: RunAugmentInput) => void
}

const DemoWorkspaceContext = createContext<DemoWorkspaceStore | null>(null)

let reqSeq = 9000
let agSeq = 9000

export function DemoWorkspaceProvider({ children }: { children: ReactNode }) {
  const [exportRequests, setExportRequests] = useState<ExportRequest[]>(() =>
    exportSeed.map((r) => ({ ...r })),
  )
  const [myDatasets] = useState<MyDataset[]>(() => myDatasetSeed.map((d) => ({ ...d })))
  const [augmentJobs, setAugmentJobs] = useState<AugmentJob[]>(() => augmentSeed.map((a) => ({ ...a })))
  const [workJobs, setWorkJobs] = useState<WorkJob[]>(() => workJobSeed.map((j) => ({ ...j })))

  const requestExport = useCallback<DemoWorkspaceStore['requestExport']>((dataset) => {
    const id = `req-${(reqSeq += 1)}`
    const req: ExportRequest = {
      id,
      datasetId: dataset.id,
      datasetTitle: dataset.title,
      type: dataset.type,
      requestedAt: daysAgo(0),
      status: 'reviewing',
      sizeGb: dataset.sizeGb,
    }
    setExportRequests((prev) => [req, ...prev])
    // 자동 승인 (심사중 → 승인완료, D-7 기한 부여)
    window.setTimeout(() => {
      setExportRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'approved', dueLabel: dDay(7) } : r)),
      )
    }, APPROVE_DELAY)
    return req
  }, [])

  const downloadExport = useCallback<DemoWorkspaceStore['downloadExport']>((reqId) => {
    setExportRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, downloaded: true } : r)),
    )
  }, [])

  const runAugment = useCallback<DemoWorkspaceStore['runAugment']>((input) => {
    const agId = `ag-${(agSeq += 1)}`
    const jobId = `job-${agId}`
    const now = daysAgo(0)
    const newAug: AugmentJob = {
      id: agId,
      source: input.sourceTitle,
      options: input.options,
      multiple: input.multiple,
      status: 'inProgress',
      requestedAt: now,
    }
    const newJob: WorkJob = {
      id: jobId,
      kind: '증강',
      title: `${input.sourceTitle} 증강`,
      type: input.sourceType,
      status: 'inProgress',
      progress: 6,
      updatedAt: now,
    }
    setAugmentJobs((prev) => [newAug, ...prev])
    setWorkJobs((prev) => [newJob, ...prev])

    // 진행바 자동 증가 → 완료 (이력·대시보드 동시 반영)
    let progress = 6
    const tick = () => {
      progress = Math.min(100, progress + AUGMENT_STEP)
      setWorkJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, progress } : j)))
      if (progress >= 100) {
        setWorkJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status: 'done', progress: 100 } : j)),
        )
        setAugmentJobs((prev) =>
          prev.map((a) => (a.id === agId ? { ...a, status: 'done', expireLabel: dDay(30) } : a)),
        )
      } else {
        window.setTimeout(tick, AUGMENT_TICK)
      }
    }
    window.setTimeout(tick, AUGMENT_TICK)
  }, [])

  const augmentSources = useMemo<AugmentSource[]>(() => {
    const fromExports: AugmentSource[] = exportRequests
      .filter((r) => r.downloaded)
      .map((r) => ({ id: r.id, title: r.datasetTitle, type: r.type, origin: '반출' }))
    const fromMine: AugmentSource[] = myDatasets
      .filter((d) => d.status !== 'expired')
      .map((d) => ({ id: d.id, title: d.title, type: d.type, origin: '저작' }))
    return [...fromExports, ...fromMine]
  }, [exportRequests, myDatasets])

  const value = useMemo<DemoWorkspaceStore>(
    () => ({
      exportRequests,
      myDatasets,
      augmentJobs,
      workJobs,
      augmentSources,
      requestExport,
      downloadExport,
      runAugment,
    }),
    [exportRequests, myDatasets, augmentJobs, workJobs, augmentSources, requestExport, downloadExport, runAugment],
  )

  return <DemoWorkspaceContext.Provider value={value}>{children}</DemoWorkspaceContext.Provider>
}

export function useDemoWorkspace(): DemoWorkspaceStore {
  const ctx = useContext(DemoWorkspaceContext)
  if (!ctx) throw new Error('useDemoWorkspace must be used within DemoWorkspaceProvider')
  return ctx
}
