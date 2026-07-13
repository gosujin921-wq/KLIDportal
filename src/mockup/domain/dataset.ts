/**
 * 학습 데이터셋 공통 표현 (아이콘·기준 컬러).
 * 메인·데이터 현황·워크스페이스 등 데이터셋을 나타내는 모든 화면에서 공통 사용한다.
 * 페이지별로 아이콘(Layers/Database/FolderOpen)이 제각각이던 것을 이 상수 1종으로 통일.
 * 기준 컬러는 브랜드 cobalt (CLAUDE.md Primary 1색 원칙). 아이콘 칩은 bg-cobalt-50 / text-cobalt-600.
 */
import { Database } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/** 데이터셋 표준 아이콘 (전 페이지 통일) */
export const DATASET_ICON: LucideIcon = Database

/** 데이터셋 기준 컬러 = 브랜드 cobalt. 아이콘 칩 배경/글자 토큰 */
export const DATASET_ICON_CHIP = 'bg-cobalt-50 text-cobalt-600'
