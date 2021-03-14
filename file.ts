import { readFileSync, writeFileSync } from 'fs'
import { isAbsolute, join } from 'path'

export const readFile = (name: string, options: { json?: boolean } = {}) => {
  let path = name

  if (!isAbsolute(path)) {
    path = join(process.cwd(), path)
  }

  let content = readFileSync(path, 'utf8')

  if (options.json || /^.*\.json$/.test(path)) {
    return JSON.parse(content)
  }

  return content
}

export const writeFile = (
  name: string,
  content: string | Object = '',
  options: { json?: boolean } = {}
) => {
  let path = name

  if (!isAbsolute(path)) {
    path = join(process.cwd(), path)
  }

  let writeContent = ''

  if (options.json || /^.*\.json$/.test(path)) {
    writeContent = JSON.stringify(content, null, 2)
  }

  if (typeof content === 'string') {
    writeContent = content
  }

  writeFileSync(path, writeContent)
}
