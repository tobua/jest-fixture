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
  let currentDirectorySpy = jest.spyOn(process, 'cwd')
  const setCwd = (path: string) => {
    currentDirectorySpy = jest.spyOn(process, 'cwd')
    currentDirectorySpy.mockReturnValue(path)
  }
  const fixturePath = join(CWD, 'test/fixture', testSuiteName)

  // Lifecycle methods added by the user will also run, multiple can be registered.
  beforeEach(() => {
    setCwd(fixturePath)
  })

  afterEach(() => {
    remove(fixturePath)
    currentDirectorySpy.mockRestore()
  })

  return [fixturePath, setCwd] as [string, (path: string) => void]
}
