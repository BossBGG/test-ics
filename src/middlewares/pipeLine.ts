async function middlewarePipeline(context, middleware, index) {
  console.log('context: ', context);
  const nextMiddleware = middleware[index]
  console.log('nextMiddleware: ', nextMiddleware);

  if (!nextMiddleware) {
    return context.next
  }

  return async () => {
    const nextPipeline = middlewarePipeline(context, middleware, index + 1)

    const a = await nextMiddleware({ ...context, next: await nextPipeline })
    console.log('a: ', a);

    return "index" + index + 1
  }
}

export default middlewarePipeline
