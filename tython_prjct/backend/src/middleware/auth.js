import jwt from "jsonwebtoken"
import { unauthorized, forbidden } from "../lib/httpError.js"

export function requireAuth(request, _response, next) {
  const authHeader = request.headers.authorization || ""
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null

  if (!token) {
    next(unauthorized("Missing bearer token"))
    return
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret")

    if (!payload?.sub || !payload?.role) {
      next(unauthorized("Invalid token"))
      return
    }

    request.user = { id: payload.sub, role: payload.role }
    next()
  } catch {
    next(unauthorized("Invalid token"))
  }
}

export function requireRole(...allowedRoles) {
  return (request, _response, next) => {
    if (!allowedRoles.includes(request.user?.role)) {
      next(forbidden("Insufficient permissions"))
      return
    }

    next()
  }
}