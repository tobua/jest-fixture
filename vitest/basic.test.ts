import { existsSync } from 'fs'
import { test, expect } from 'vitest'
import { join } from 'path'
import '../vitest'
import { environment, prepare, readFile, writeFile } from '../index'

const initialPath = process.cwd()
const environmentName = 'vitest'
const [fixturePath, setCwd] = environment(environmentName)

test('Correct fixture path.', () => {
  expect(join(initialPath, `test/fixture/${environmentName}`)).toEqual(fixturePath)
  expect(process.cwd()).toEqual(fixturePath)
  const publicFolder = join(fixturePath, 'public')
  setCwd(publicFolder)
  expect(process.cwd()).toEqual(publicFolder)
})

test('Modified CWD is reset on next test.', () => {
  expect(process.cwd()).toEqual(fixturePath)
})

test('Helpers for reading and writing files work properly.', () => {
  prepare([])
  expect(existsSync(fixturePath)).toEqual(true)
  writeFile('index.ts', "console.log('Hello')")
  const contents = readFile('index.ts')
  expect(contents).toContain('Hello')
})
