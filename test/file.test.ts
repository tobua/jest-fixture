import { environment, prepare, readFile, writeFile } from '../index'

environment('file')

test('Ensure new line options for writeFile works properly.', () => {
  prepare([])

  writeFile('index.ts', "console.log('Hello')")

  let contents = readFile('index.ts')

  expect(contents.endsWith('\n')).toBe(true)

  writeFile('index.ts', "console.log('Hello')", {
    ensureNewLine: false,
  })

  contents = readFile('index.ts')

  expect(contents.endsWith('\n')).toBe(false)

  writeFile('package.json', { hello: 'world' })

  contents = readFile('package.json', { json: false })

  expect(contents.endsWith('\n')).toBe(true)

  writeFile(
    'package.json',
    { hello: 'world' },
    {
      ensureNewLine: false,
    }
  )

  contents = readFile('package.json', { json: false })

  expect(contents.endsWith('\n')).toBe(false)
})
