import { promises as fs } from 'node:fs'
import path from 'node:path'

const contentRoot = path.resolve(process.cwd(), 'content')
const localeRoots = ['/en', '/zh-CN', '/ja']

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
  const withoutExtension = relativePath.slice(0, -3)
  return `/${withoutExtension}`
}

function extractUpdatedAt(content: string): string | undefined {
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (!frontMatterMatch) {
    return undefined
  }
  const frontMatter = frontMatterMatch[1].split('\n')
  const updatedLine = frontMatter.find(line => line.startsWith('updatedAt:'))
  if (!updatedLine) {
    return undefined
  }
  const value = updatedLine.slice('updatedAt:'.length).trim()
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return undefined
  }
  return date.toISOString()
}

export default defineEventHandler(async () => {
  const files = await collectMarkdownFiles(contentRoot)
  const urls = new Map<string, string | undefined>()

  for (const filePath of files) {
    const loc = toRoutePath(filePath)
    if (!loc) {
      continue
    }
    const content = await fs.readFile(filePath, 'utf8')
    const lastmod = extractUpdatedAt(content)
    if (!urls.has(loc)) {
      urls.set(loc, lastmod)
    }
  }

  for (const loc of localeRoots) {
    if (!urls.has(loc)) {
      urls.set(loc, undefined)
    }
  }

  return [...urls.entries()].map(([loc, lastmod]) => {
    if (lastmod) {
      return { loc, lastmod }
    }
    return { loc }
  })
})
