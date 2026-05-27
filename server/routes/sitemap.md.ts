import { promises as fs } from 'node:fs'
import path from 'node:path'

const contentRoot = path.resolve(process.cwd(), 'content')
const localeRoots = ['/en', '/zh-CN', '/ja']
const SITE_URL = 'https://jannchie.com'
const buildLastmod = new Date().toISOString()

interface Entry {
  loc: string
  lastmod: string
  title?: string
  description?: string
}

async function collectMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await collectMarkdownFiles(fullPath))
      continue
    }
    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath)
    }
  }
  return files
}

function toRoutePath(filePath: string): string | null {
  const relativePath = path.relative(contentRoot, filePath).replaceAll('\\', '/')
  if (!relativePath.endsWith('.md')) {
    return null
  }
  return `/${relativePath.slice(0, -3)}`
}

function readFrontMatterField(content: string, key: string): string | undefined {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match || !match[1]) {
    return undefined
  }
  const line = match[1].split('\n').find(l => l.startsWith(`${key}:`))
  if (!line) {
    return undefined
  }
  return line.slice(key.length + 1).trim().replaceAll(/^['"]|['"]$/g, '')
}

async function resolveLastmod(filePath: string, content: string): Promise<string> {
  const explicit = readFrontMatterField(content, 'updatedAt')
  if (explicit) {
    const date = new Date(explicit)
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString()
    }
  }
  try {
    const stat = await fs.stat(filePath)
    return stat.mtime.toISOString()
  }
  catch {
    return buildLastmod
  }
}

function escapeMd(value: string): string {
  return value.replaceAll(/([\\`*_{}[\]()#+\-!])/g, String.raw`\$1`)
}

function groupKey(loc: string): string {
  const segments = loc.split('/').filter(Boolean)
  if (segments.length <= 1) {
    return segments[0] ?? ''
  }
  return `${segments[0]}/${segments[1]}`
}

export default defineEventHandler(async (event) => {
  const files = await collectMarkdownFiles(contentRoot)
  const map = new Map<string, Entry>()

  for (const filePath of files) {
    const loc = toRoutePath(filePath)
    if (!loc) {
      continue
    }
    const content = await fs.readFile(filePath, 'utf8')
    if (map.has(loc)) {
      continue
    }
    map.set(loc, {
      loc,
      lastmod: await resolveLastmod(filePath, content),
      title: readFrontMatterField(content, 'title'),
      description: readFrontMatterField(content, 'description'),
    })
  }

  for (const loc of localeRoots) {
    if (!map.has(loc)) {
      map.set(loc, { loc, lastmod: buildLastmod })
    }
  }

  const entries = [...map.values()].sort((a, b) => a.loc.localeCompare(b.loc))

  const grouped = new Map<string, Entry[]>()
  for (const entry of entries) {
    const key = groupKey(entry.loc)
    const list = grouped.get(key) ?? []
    list.push(entry)
    grouped.set(key, list)
  }

  const lines: string[] = ['# Jannchie Sitemap', '', `> Markdown sitemap for [${SITE_URL}](${SITE_URL}). Generated ${buildLastmod}.`, '', 'Each entry links to the canonical HTML page; append `.md` to any URL to retrieve the markdown source.', '']

  for (const [key, list] of grouped) {
    lines.push(`## /${key}`, '')
    for (const entry of list) {
      const title = entry.title ? escapeMd(entry.title) : entry.loc
      const url = `${SITE_URL}${entry.loc}`
      const mdUrl = `${url}.md`
      const desc = entry.description ? ` — ${escapeMd(entry.description)}` : ''
      lines.push(`- [${title}](${url}) ([markdown](${mdUrl})) — updated ${entry.lastmod}${desc}`)
    }
    lines.push('')
  }

  setResponseHeaders(event, {
    'Content-Type': 'text/markdown; charset=utf-8',
    'Cache-Control': 'public, max-age=300',
  })
  return lines.join('\n')
})
