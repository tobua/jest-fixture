import { join } from 'path'
import { setup, remove } from './fixture'
import { File } from './structures'

// Access directory, before it's modified for tests.
const CWD = process.cwd()

export const prepare = (fixture: File[], path = process.cwd()) => {
  setup(fixture, path)

  return {
    dist: join(path, 'dist'),
  }
}

export const environment = (testSuiteName: string) => {
  const currentDirectorySpy = jest.spyOn(process, 'cwd')
  const setCwd = (_path: string) => currentDirectorySpy.mockReturnValue(_path)
  const fixturePath = join(CWD, 'test/fixture', testSuiteName)

  // Lifecycle methods added by the user will also run, multiple can be registered.
  beforeEach(() => {
    setCwd(fixturePath)
  })

  afterEach(() => {
    remove(fixturePath)
  })

  return [fixturePath, setCwd] as [string, (path: string) => void]
}
