import { join } from 'path'
import fastGlob from 'fast-glob'
import { readFile } from './file'

export const wait = (seconds: number) =>
  new Promise<void>((done) => setTimeout(() => done(), seconds * 1000))

export const listFilesMatching = (matcher: string, folder = process.cwd()) =>
  fastGlob.sync([matcher], {
    cwd: folder,
    dot: true,
  }) as string[]

export const contentsForFilesMatching = (
  matcher: string,
  folder = process.cwd()
) => {
  const files = listFilesMatching(matcher, folder)

  return files.map((fileName) => ({
    name: fileName,
    contents: readFile(join(folder, fileName)) as string,
  }))
}
