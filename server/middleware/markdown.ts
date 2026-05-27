import { promises as fs } from 'node:fs'
import path from 'node:path'

const contentRoot = path.resolve(process.cwd(), 'content')
const SITE_URL = 'https://jannchie.com'
const DEFAULT_LOCALE = 'en'
const LOCALES = ['en', 'zh-CN', 'ja'] as const
const TOP_SECTIONS = ['posts', 'essays', 'notes', 'docs', 'anime', 'game', 'use'] as const

const SKIP_PREFIXES = [
  '/api/',
  '/_nuxt',
  '/_payload',
  '/_ipx',
  '/__',
  '/imgs/',
  '/videos/',
  '/openapi.json',
  '/robots.txt',
  '/llms.txt',
  '/llms-full.txt',
  '/sitemap.xml',
  '/sitemap.md',
  '/sitemap_index.xml',
  '/manifest.webmanifest',
  '/sw.js',
  '/registerSW.js',
  '/workbox-',
  '/favicon',
  '/docs/api',
]

const SKIP_EXTENSIONS = new Set([
  '.js',
  '.mjs',
  '.css',
  '.map',
  '.json',
  '.xml',
  '.txt',
  '.ico',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.svg',
  '.avif',
  '.bmp',
  '.woff',
  '.woff2',
  '.ttf',
  '.otf',
  '.eot',
  '.mp4',
  '.webm',
  '.mp3',
  '.wav',
  '.ogg',
  '.pdf',
  '.zip',
])

const AI_UA_PATTERNS = [
  /GPTBot/i,
  /ChatGPT-User/i,
  /OAI-SearchBot/i,
  /OpenAI/i,
  /ClaudeBot/i,
  /Claude-User/i,
  /Claude-SearchBot/i,
  /anthropic-ai/i,
  /Anthropic/i,
  /PerplexityBot/i,
  /Perplexity-User/i,
  /Google-Extended/i,
  /GoogleOther/i,
  /CCBot/i,
  /Bytespider/i,
  /Mistral/i,
  /YouBot/i,
  /Meta-ExternalAgent/i,
  /Meta-ExternalFetcher/i,
  /Applebot-Extended/i,
  /cohere-ai/i,
  /Diffbot/i,
  /DuckAssistBot/i,
  /Vercel-Agent/i,
  /AgentReadability/i,
]

interface MarkdownIntent {
  reason: 'extension' | 'accept' | 'user-agent'
  stripExt: boolean
}

function shouldSkipPath(pathname: string): boolean {
  if (SKIP_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return true
  }
  const ext = path.extname(pathname).toLowerCase()
  if (ext && ext !== '.md' && SKIP_EXTENSIONS.has(ext)) {
    return true
  }
  return false
}

function detectMarkdownIntent(event: any): MarkdownIntent | null {
  const rawPath = (event.path || '').split('?')[0] || ''
  if (rawPath.endsWith('.md')) {
    return { reason: 'extension', stripExt: true }
  }
  const headers = getRequestHeaders(event)
  const accept = (headers.accept ?? '').toLowerCase()
  if (accept.includes('text/markdown') || accept.includes('text/x-markdown')) {
    return { reason: 'accept', stripExt: false }
  }
  const ua = headers['user-agent'] ?? ''
  if (ua && AI_UA_PATTERNS.some(re => re.test(ua))) {
    return { reason: 'user-agent', stripExt: false }
  }
  return null
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(filePath)
    return stat.isFile()
  }
  catch {
    return false
  }
}

async function findContentFile(pathname: string): Promise<string | null> {
  const cleaned = pathname.replaceAll(/^\/+|\/+$/g, '')
  const candidates: string[] = cleaned
    ? [path.join(contentRoot, `${cleaned}.md`), path.join(contentRoot, cleaned, 'index.md')]
    : [path.join(contentRoot, DEFAULT_LOCALE, 'index.md'), path.join(contentRoot, `${DEFAULT_LOCALE}.md`)]
  for (const candidate of candidates) {
    if (!candidate.startsWith(contentRoot)) {
      continue
    }
    if (await fileExists(candidate)) {
      return candidate
    }
  }
  return null
}

function localeFromPath(pathname: string): string | null {
  const cleaned = pathname.replaceAll(/^\/+|\/+$/g, '')
  if (!cleaned) {
    return DEFAULT_LOCALE
  }
  if ((LOCALES as readonly string[]).includes(cleaned)) {
    return cleaned
  }
  return null
}

async function listSectionEntries(locale: string, section: string): Promise<{ slug: string, title?: string }[]> {
  const dir = path.join(contentRoot, locale, section)
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const items: { slug: string, title?: string }[] = []
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith('.md')) {
        continue
      }
      const slug = entry.name.slice(0, -3)
      const filePath = path.join(dir, entry.name)
      let title: string | undefined
      try {
        const content = await fs.readFile(filePath, 'utf8')
        const match = content.match(/^---\n([\s\S]*?)\n---/)
        if (match && match[1]) {
          const titleLine = match[1].split('\n').find(l => l.startsWith('title:'))
          if (titleLine) {
            title = titleLine.slice(6).trim().replaceAll(/^['"]|['"]$/g, '')
          }
        }
      }
      catch {}
      items.push({ slug, title })
    }
    return items
  }
  catch {
    return []
  }
}

async function buildHomeMarkdown(locale: string): Promise<string> {
  const lines: string[] = [`# Jannchie's Home`, '', `> Developer resources, API documentation, and AI agent integration guides for jannchie.com.`, '', `- Canonical URL: ${SITE_URL}/${locale}`, `- Markdown sitemap: ${SITE_URL}/sitemap.md`, `- Agent summary: ${SITE_URL}/llms.txt`, `- Full bundle: ${SITE_URL}/llms-full.txt`, '']

  for (const section of TOP_SECTIONS) {
    const items = await listSectionEntries(locale, section)
    if (items.length === 0) {
      continue
    }
    lines.push(`## ${section}`, '')
    for (const { slug, title } of items) {
      const href = `${SITE_URL}/${locale}/${section}/${slug}`
      lines.push(`- [${title ?? slug}](${href}) ([markdown](${href}.md))`)
    }
    lines.push('')
  }
  return lines.join('\n')
}

function buildPlaceholderMarkdown(pathname: string): string {
  const url = `${SITE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`
  return [
    `# Page not found`,
    ``,
    `> Requested URL: ${url}`,
    ``,
    `The requested page is not available on jannchie.com.`,
    ``,
    `## Where to look next`,
    ``,
    `- [Sitemap (markdown)](${SITE_URL}/sitemap.md) — full list of available pages`,
    `- [llms.txt](${SITE_URL}/llms.txt) — high-level summary for agents`,
    `- [llms-full.txt](${SITE_URL}/llms-full.txt) — full documentation bundle`,
    `- [Homepage](${SITE_URL}/) — Jannchie's Home`,
    ``,
  ].join('\n')
}

function stripMarkdownExtension(pathname: string): string {
  if (pathname === '/.md' || pathname === '.md') {
    return '/'
  }
  if (pathname.endsWith('.md')) {
    return pathname.slice(0, -3) || '/'
  }
  return pathname
}

export default defineEventHandler(async (event) => {
  const method = event.method
  if (method !== 'GET' && method !== 'HEAD') {
    return
  }
  const rawPath = (event.path || '').split('?')[0] || '/'
  if (shouldSkipPath(rawPath)) {
    return
  }
  const intent = detectMarkdownIntent(event)
  if (!intent) {
    return
  }

  const logicalPath = intent.stripExt ? stripMarkdownExtension(rawPath) : rawPath
  const file = await findContentFile(logicalPath)

  setResponseStatus(event, 200)
  setResponseHeaders(event, {
    'Content-Type': 'text/markdown; charset=utf-8',
    'Vary': 'Accept, User-Agent',
    'X-Robots-Tag': 'index, follow',
    'Cache-Control': 'public, max-age=300',
  })

  if (file) {
    return await fs.readFile(file, 'utf8')
  }
  const localeRoot = localeFromPath(logicalPath)
  if (localeRoot) {
    return await buildHomeMarkdown(localeRoot)
  }
  return buildPlaceholderMarkdown(logicalPath)
})
