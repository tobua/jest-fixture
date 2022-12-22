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

## `listFilesMatching` and `contentsForFilesMatching`

Reads all files matching a glob pattern in a specific folder or `process.cwd()`.

```js
import { join } from 'path'
import { listFilesMatching, contentsForFilesMatching } from 'jest-fixture'

const files = listFilesMatching('*.js')
const sourceMapFilesInDist = listFilesMatching('*.map.js', join(process.cwd(), 'dist'))

// files === ['index.js', 'components.js']

const contents = contentsForFilesMatching('*.css')

// contents === [{ name: styles.css, contents: 'body { display: none; }' }]
```

## `wait`

Wait for a number of seconds to pass.

```js
import { wait } from 'jest-fixture'

// Waits 5 seconds.
await wait(5)
```

## `environment` and `prepare`

Use the `environment` before a test suite to create a dedicated folder inside `test/fixture` where `process.cwd` is set to this folder `beforeEach` test and the contents are removed `afterEach`. Prepare will setup the passed files inside the `fixturePath` so these files can then be used by tests separate from the files of other test suites.

```js
const [fixturePath, setCwd] = environment('suite')

test('Some test.', async () => {
  // fixturePath === 'test/fixture/suite'
  const { dist } = prepare([file('index.js', "console.log('hello')")])
  // dist === 'test/fixture/suite/dist'
  // test/fixture/suite/index.js created
})
```

## `file`, `json`, `packageJson` and `interface File`

`prepare` expects a list of `File[]`s. Such a `File` object can be manually constructed or through one of the helpers in the second code example for commonly used files.

```js
interface File {
  // Name of the file relative to the `fixturePath`.
  name: string
  // Optionally, write Object contents as JSON.
  json?: true
  // Contents of the file as a string or Object for JSON files.
  contents?: string | Object
  // Alternative to contents, filePath where to copy contents from.
  copy?: string
}
```

```js
import { file, json, packageJson, prepare } from 'jest-fixture'

const javaScriptFile = file('index.js', "console.log('hello world')")
const jsonFile = json('phone-book.json', [
  { name: 'Bob', number: '123' },
  { name: 'John', number: '456' },
])
const packageJson = packageJson('my-plugin', {
  description: 'Meh',
  version: '1.0.0',
})

prepare([javaScriptFile, jsonFiles, packageJson])
```

## vitest

Import this polyfill to support vitest.

```js
import 'jest-fixture/vitest'
import { file, json, packageJson, prepare } from 'jest-fixture'
```

**Or**, use the following test setup code to polyfill jest globals with matching vitest globals.

```js
import { beforeEach, afterEach, vi } from 'vitest'

global.jest = {
  spyOn: vi.spyOn,
}

global.beforeEach = beforeEach
global.afterEach = afterEach
```
