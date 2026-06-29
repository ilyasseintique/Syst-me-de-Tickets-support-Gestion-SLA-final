export function validate(schema, source = "body") {
  return (request, _response, next) => {
    const result = schema.safeParse(request[source])

    if (!result.success) {
      next({ status: 400, message: result.error.issues.map((issue) => issue.message).join("; ") })
      return
    }

    request[source] = result.data
    next()
  }
}