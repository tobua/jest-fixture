// package.json jest config is overridden by padua since vitest is also present.
/** @type {import('jest').Config} */
const config = {
  testPathIgnorePatterns: ['/vitest/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
}

export default config
