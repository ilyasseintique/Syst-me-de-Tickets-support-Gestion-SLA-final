export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export function badRequest(message) {
  return new HttpError(400, message)
}

export function unauthorized(message) {
  return new HttpError(401, message)
}

export function forbidden(message) {
  return new HttpError(403, message)
}

export function notFound(message) {
  return new HttpError(404, message)
}