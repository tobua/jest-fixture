export interface File {
  name: string
  json?: true
  contents?: string | Object
  copy?: string
}

export const file = (name: string, contents: string) => ({
  name,
  contents,
})

export const json = (name: string, contents: Object) =>
  ({
    name,
    json: true,
    contents,
  } as File)

export const packageJson = (name: string, others = {}) =>
  ({
    name: 'package.json',
    json: true,
    contents: {
      name,
      ...others,
    },
  } as File)
