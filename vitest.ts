import { beforeEach, afterEach, vi } from 'vitest'

// @ts-ignore
global.jest = {
  spyOn: vi.spyOn,
}

// @ts-ignore
global.beforeEach = beforeEach
// @ts-ignore
global.afterEach = afterEach
