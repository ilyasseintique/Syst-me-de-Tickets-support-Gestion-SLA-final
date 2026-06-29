export function notFound(_request, response) {
  response.status(404).json({ error: "Not found" })
}

export function errorHandler(error, _request, response, _next) {
  const status = error.status || 500
  response.status(status).json({ error: error.message || "Internal server error" })
}