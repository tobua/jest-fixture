import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import rimraf from 'rimraf'
import { writeFile } from './file'
import { File } from './structures'

// Access directory, before it's modified for tests.
const CWD = process.cwd()

// Create file structure required to test the plugins.
export const setup = (structure: File[], fixturePath: string) => {
  // Cleanup in case leftovers from previous runs exist.
  rimraf.sync(fixturePath)

  // Create test/fixture directory to put files.
  mkdirSync(fixturePath, { recursive: true })

  structure.forEach((file: File) => {
    const filePath = join(fixturePath, file.name)
    const fileDirectory = dirname(filePath)

    if (!existsSync(fileDirectory)) {
      mkdirSync(fileDirectory, { recursive: true })
    }

    if (typeof file.copy === 'string') {
      copyFileSync(join(CWD, file.copy), filePath)
    } else {
      writeFile(filePath, file.contents, {
        json: file.json,
      })
    }
  })
}

// Remove test suites created during setup.
export const remove = (fixturePath: string) => {
  rimraf.sync(fixturePath)
}
