import {
  readFileSync,
  writeFileSync,
  unlinkSync,
  existsSync,
  rmdirSync,
  lstatSync,
  mkdirSync,
} from 'fs'
import { dirname, isAbsolute, join } from 'path'

export const readFile = (name: string, options: { json?: boolean } = {}) => {
  let path = name

  if (!isAbsolute(path)) {
    path = join(process.cwd(), path)
  }

  const content = readFileSync(path, 'utf8')

  if (options.json || (options.json !== false && /^.*\.json$/.test(path))) {
    return JSON.parse(content)
  }

  return content
}

export const writeFile = (
  name: string,
  content: string | Object = '',
  options: { json?: boolean; ensureNewLine?: boolean } = {}
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

  if (options.ensureNewLine !== false && !writeContent.endsWith('\n') && writeContent.length > 0) {
    writeContent += '\n'
  }

  const directory = dirname(path)

  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true })
  }

  writeFileSync(path, writeContent)
}

export const removeFile = (name: string) => {
  let path = name

  if (!isAbsolute(path)) {
    path = join(process.cwd(), path)
  }

  if (existsSync(path)) {
    if (lstatSync(path).isDirectory()) {
      rmdirSync(path, { recursive: true })
    } else {
      unlinkSync(path)
    }
  }
}
