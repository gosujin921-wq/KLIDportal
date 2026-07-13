import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  savedSearchSeed,
  savedSignature,
  autoSavedName,
  type SavedSearch,
} from '@/mockup/mocks/mypage'

/** 저장한 검색 조건 초안 (id·name 은 저장 시 확정) */
type SavedSearchDraft = Omit<SavedSearch, 'id' | 'name'> & { name?: string }

/**
 * 데모용 "내 검색조건" 스토어 (실제 서버 없음).
 * 검색 화면의 "이 조건 저장" · 워크스페이스 즐겨찾기 탭이 같은 상태를 공유해
 * 저장 → 즉시 노출되는 흐름을 시연한다.
 */
interface SavedSearchStore {
  items: SavedSearch[]
  /** 조건 저장. 이미 같은 조건이 있으면 추가하지 않고 기존 항목을 반환. */
  add: (draft: SavedSearchDraft) => { item: SavedSearch; created: boolean }
  remove: (id: string) => void
  rename: (id: string, name: string) => void
  /** 같은 조건이 이미 저장돼 있는지 */
  has: (draft: Pick<SavedSearch, 'types' | 'region' | 'times' | 'kinds' | 'sources' | 'query'>) => boolean
}

const SavedSearchContext = createContext<SavedSearchStore | null>(null)

let seq = savedSearchSeed.length

export function SavedSearchProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SavedSearch[]>(() => savedSearchSeed.map((s) => ({ ...s })))

  const add = useCallback<SavedSearchStore['add']>((draft) => {
    const sig = savedSignature(draft)
    const existing = items.find((s) => savedSignature(s) === sig)
    if (existing) return { item: existing, created: false }
    const item: SavedSearch = {
      id: `ss-${(seq += 1)}`,
      name: draft.name?.trim() || autoSavedName(draft),
      types: draft.types,
      region: draft.region,
      times: draft.times,
      kinds: draft.kinds,
      sources: draft.sources,
      query: draft.query,
    }
    setItems((prev) => [item, ...prev])
    return { item, created: true }
  }, [items])

  const remove = useCallback<SavedSearchStore['remove']>((id) => {
    setItems((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const rename = useCallback<SavedSearchStore['rename']>((id, name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, name: trimmed } : s)))
  }, [])

  const has = useCallback<SavedSearchStore['has']>(
    (draft) => {
      const sig = savedSignature(draft)
      return items.some((s) => savedSignature(s) === sig)
    },
    [items],
  )

  const value = useMemo<SavedSearchStore>(
    () => ({ items, add, remove, rename, has }),
    [items, add, remove, rename, has],
  )

  return <SavedSearchContext.Provider value={value}>{children}</SavedSearchContext.Provider>
}

export function useSavedSearches(): SavedSearchStore {
  const ctx = useContext(SavedSearchContext)
  if (!ctx) throw new Error('useSavedSearches must be used within SavedSearchProvider')
  return ctx
}
