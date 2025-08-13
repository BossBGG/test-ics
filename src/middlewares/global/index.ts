// const modules = import.meta.globEager('./*.ts')
const modules = import.meta.glob('./*.ts', { eager: true })

const middlewares = {}
for (const key in modules) {
  const name = key.replace(/(^.\/)|(\.ts$)/g, '')
  if (name.charAt(0) !== '_')
    middlewares[name] = modules[key].default
}

export default middlewares
