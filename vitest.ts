export const registerVitest = (beforeEach: Function, afterEach: Function, vi: { spyOn: any }) => {
  // @ts-ignore
  global.jest = {
    spyOn: vi.spyOn,
  }

  // @ts-ignore
  global.beforeEach = beforeEach
  // @ts-ignore
  global.afterEach = afterEach
}
