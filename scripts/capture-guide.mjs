// One-off: capture guide screen examples for HowToPage (/guide/how).
// Dev server must be running on BASE.  Run:  node scripts/capture-guide.mjs
//
// Notes from the state map:
//  - /workspace/* is login-gated (in-memory auth). We log in once via /login,
//    then navigate with in-app LNB links (no reload) to keep the session.
//  - /workspace/authoring/:taskId is NOT gated and is a single fixed-layout
//    editor (no wizard) → steps 6/7/8 are three region crops of one screen.
//  - AugmentPage is one page → steps 9/10/11 are field/banner states of the
//    form, step 12 is the 증강 이력 table lower down.
import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../src/mockup/assets/guide')
const BASE = process.env.BASE || 'http://localhost:5174'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const FULL = { x: 0, y: 0, width: 1440, height: 860 }

async function run() {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
    reducedMotion: 'reduce', // Reveal renders instantly under reduced-motion
  })
  const page = await ctx.newPage()

  const shoot = async (name, clip = FULL) => {
    await page.screenshot({ path: resolve(OUT, `${name}.png`), clip })
    process.stdout.write(`  ✓ ${name}\n`)
  }
  const open = async (path) => {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
    await wait(500)
    await page.evaluate(() => window.scrollTo(0, 0))
    await wait(150)
  }

  // ── Phase 1: public pages ──────────────────────────────────────────────
  process.stdout.write('phase 1 (public)\n')

  await open('/search')
  await shoot('search-1')

  await open('/search/ds-2026-0087')
  await shoot('search-2')

  // download-request modal on the detail page
  await page.getByRole('button', { name: '다운로드 신청' }).first().click()
  await page.getByRole('heading', { name: '다운로드 신청' }).waitFor({ timeout: 5000 })
  await wait(400)
  await shoot('search-3')

  // 저작도구: single editor, three region crops (offsets from the 64px GNB)
  await open('/workspace/authoring/at-009')
  await shoot('authoring-2', { x: 228, y: 64, width: 956, height: 836 }) // 프레임 추출 (캔버스+스트립)
  await shoot('authoring-3', { x: 0, y: 64, width: 1440, height: 836 }) // 객체 라벨링 (전체 에디터)
  await shoot('authoring-4', { x: 900, y: 64, width: 540, height: 836 }) // 검수·완료 (객체 패널)

  // ── Phase 2: logged-in SPA session (no reload after login) ─────────────
  process.stdout.write('phase 2 (logged-in)\n')
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.getByRole('main').getByRole('button', { name: '로그인' }).click()
  await page.waitForURL('**/workspace', { timeout: 8000 })
  await wait(700)
  await page.evaluate(() => window.scrollTo(0, 0))
  await shoot('search-4') // 워크스페이스 대시보드 (진행중 다운로드)

  // 업로드 영상 (LNB in-app nav)
  await page.locator('aside').getByRole('link', { name: '업로드 영상' }).click()
  await page.waitForURL('**/workspace/upload', { timeout: 8000 })
  await wait(600)
  await page.evaluate(() => window.scrollTo(0, 0))
  await shoot('authoring-1')

  // 데이터 증강
  await page.locator('aside').getByRole('link', { name: '데이터 증강' }).click()
  await page.waitForURL('**/workspace/augment', { timeout: 8000 })
  await wait(600)
  await page.evaluate(() => window.scrollTo(0, 0))
  await shoot('ai-1') // 원본 선택 (기본 폼)

  // 조건 설정: 원본 선택 + 4배 + 조건 체크
  await page.locator('form select').first().selectOption({ index: 1 })
  await page.locator('form').getByRole('button', { name: '4배' }).click()
  const boxes = page.locator('form input[type=checkbox]')
  await boxes.nth(0).check()
  await boxes.nth(1).check()
  await wait(300)
  await shoot('ai-2')

  // 실행: 증강 실행 → 성공 배너
  await page.locator('form').getByRole('button', { name: '증강 실행' }).click()
  await page.getByText('증강 작업이 시작되었습니다').waitFor({ timeout: 5000 })
  await wait(300)
  await shoot('ai-3')

  // 결과 다운로드: 증강 이력 테이블로 스크롤
  await page.getByRole('heading', { name: '증강 이력' }).evaluate((el) =>
    el.scrollIntoView({ block: 'start' }),
  )
  await wait(400)
  await shoot('ai-4')

  await browser.close()
  process.stdout.write('done\n')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
