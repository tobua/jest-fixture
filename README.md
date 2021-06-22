# jest-fixture

<img align="right" src="https://github.com/tobua/jest-fixture/raw/main/logo.png" width="20%" alt="jest-fixture Logo" />

Helpers to create file based fixtures for use with jest.

## Installation & Usage

```
npm i jest-fixture --save-dev
```

```js
import { environment, prepare, file, packageJson } from 'jest-fixture'
import { build } from '../my-build-plugin'

const [fixturePath, setCwd] = environment('build')

test('Build generates required files with modules.', async () => {
  const { dist } = prepare([
    file('index.js', "import 'imported.js'"),
    file('imported.js', "console.log('Hello World!')"),
    packageJson('build', { type: 'module' }),
  ])

  await build()

  const files = listFilesMatching('*.js.map', dist)

  // Source map file is generated.
  expect(files.length).toEqual(1)
  expect(files[0]).toEqual('index.js.map')

  const contents = contentsForFilesMatching('*.js', dist)

  // Contents of imported files included in generated file.
  expect(contents.length).toBeGreaterThan(0)
  expect(contents[0].name).toEqual('index.js')
  expect(contents[0].contents).toContain('Hello World')
})
```

## `readFile` and `writeFile`

```js
import { readFile, writeFile } from 'jest-fixture'

const fileContentsAsString = readFile('index.js')
const { name, version } = readFile('package.json')

// With options:
const { presets } = readFile('.babelrc', {
  // Default false, or detected from .json extension.
  json: true,
})

writeFile('index.js', `alert('Knock, knock. Who's there?')`)
writeFile('package.json', {
  name: 'my-app',
  version: '1.0.0',
})

// With options:
writeFile(
  '.babelrc',
  {
    presets: ['@babel/preset-env'],
  },
  {
    // Default false, or detected from .json extension.
    json: true,
    // Default true, will add newline if not present already.
    ensureNewLine: false,
  }
)
```
