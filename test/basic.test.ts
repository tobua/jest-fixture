import { existsSync } from 'fs'
import { join } from 'path'
import { performance } from 'perf_hooks'
import {
  environment,
  prepare,
  readFile,
  writeFile,
  json,
  file,
  listFilesMatching,
  contentsForFilesMatching,
  wait,
} from '../index'

const initialPath = process.cwd()

const environmentName = 'basic'

const [fixturePath, setCwd] = environment(environmentName)

test('Correct fixture path.', () => {
  expect(join(initialPath, `test/fixture/${environmentName}`)).toEqual(
    fixturePath
  )
  // process.cwd() will point to fixture path.
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

  // Fixture directory exists.
  expect(existsSync(fixturePath)).toEqual(true)

  writeFile('index.ts', "console.log('Hello')")

  const contents = readFile('index.ts')

  expect(contents).toContain('Hello')

  // File is written to the fixture path.
  expect(existsSync(join(fixturePath, 'index.ts'))).toEqual(true)

  // Also support JSON.
  writeFile('index.json', { hello: 'world' })

  const jsonObject = readFile('index.json')
  const jsonObjectWithOption = readFile('index.json', { json: true })

  expect(jsonObject.hello).toEqual('world')
  expect(jsonObjectWithOption.hello).toEqual('world')
})

test('Prepare creates files listed.', () => {
  prepare([
    file('index.js', 'JavaScript'),
    json('index.json', { type: 'JSON' }),
  ])

  const files = listFilesMatching('*', fixturePath)

  expect(files).toEqual(['index.js', 'index.json'])

  const contents = contentsForFilesMatching('*')

  expect(contents).toEqual([
    {
      name: 'index.js',
      contents: 'JavaScript\n',
    },
    {
      name: 'index.json',
      contents: { type: 'JSON' },
    },
  ])
})

test('Prepare can create nested files.', () => {
  prepare([file('nested/further/test.js', ''), json('/deep/index.json', {})])

  const files = listFilesMatching('**/*', fixturePath)

  expect(files).toEqual(['deep/index.json', 'nested/further/test.js'])

  const contents = contentsForFilesMatching('**/*')

  expect(contents).toEqual([
    {
      name: 'deep/index.json',
      contents: {},
    },
    {
      name: 'nested/further/test.js',
      contents: '',
    },
  ])
})

test('Timer elapses time passed.', async () => {
  const before = performance.now()
  await wait(1)
  const after = performance.now()

  expect(after - before).toBeGreaterThan(1000)
  expect(after - before).toBeLessThan(1100)
})
