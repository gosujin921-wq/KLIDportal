// 디자인 컨셉서 v2 "기획 장점" 슬라이드용 화면 캡쳐.
// dev 서버가 떠 있어야 함.  실행:  BASE=http://localhost:5175 node scripts/capture-concept.mjs
import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../docs/01_디자인컨셉서/assets')
const BASE = process.env.BASE || 'http://localhost:5175'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const CLIP = { x: 0, y: 0, width: 1440, height: 900 }

async function run() {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  })
  const page = await ctx.newPage()

  const shoot = async (name, clip = CLIP) => {
    await page.screenshot({ path: resolve(OUT, `${name}.png`), clip })
    process.stdout.write(`  ✓ ${name}\n`)
  }
  const open = async (path) => {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
    await wait(600)
    await page.evaluate(() => window.scrollTo(0, 0))
    await wait(200)
  }

  // 찾기 · 이벤트 유형 검색
  await open('/search')
  await shoot('cap-search')

  // 만들기 · 저작도구 (라벨링 에디터, 로그인 게이트 아님)
  await open('/workspace/authoring/at-009')
  await shoot('cap-authoring')

  // 로그인 (데모 인증) 후 SPA 세션 유지
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.getByRole('main').getByRole('button', { name: '로그인' }).click()
  await page.waitForURL('**/workspace', { timeout: 8000 })
  await wait(800)
  await page.evaluate(() => window.scrollTo(0, 0))

  // 챙기기 · 워크스페이스 대시보드 (진행 상태·기한)
  await shoot('cap-workspace')

  // 만들기 · 데이터 증강 (생성형 통합)
  await page.locator('aside').getByRole('link', { name: '데이터 증강' }).click()
  await page.waitForURL('**/workspace/augment', { timeout: 8000 })
  await wait(700)
  await page.evaluate(() => window.scrollTo(0, 0))
  await shoot('cap-augment')

  await browser.close()
  process.stdout.write('done\n')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
