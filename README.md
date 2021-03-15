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
