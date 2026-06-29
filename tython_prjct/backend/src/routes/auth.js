import { Router } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { users } from "../lib/store.js"
import { unauthorized } from "../lib/httpError.js"
import { requireAuth } from "../middleware/auth.js"
import { validate } from "../middleware/validate.js"

const router = Router()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

router.post("/login", validate(loginSchema), (request, response, next) => {
  const user = users.find((entry) => entry.email === request.body.email)

  if (!user || !bcrypt.compareSync(request.body.password, user.passwordHash)) {
    next(unauthorized("Invalid credentials"))
    return
  }

  const secret = process.env.JWT_SECRET || "dev-secret"
  const token = jwt.sign({ sub: user.id, role: user.role }, secret, { expiresIn: "8h" })

  response.json({ token, user: sanitizeUser(user) })
})

router.get("/me", requireAuth, (request, response, next) => {
  const user = users.find((entry) => entry.id === request.user.id)

  if (!user) {
    next(unauthorized("User not found"))
    return
  }

  response.json({ user: sanitizeUser(user) })
})

function sanitizeUser(user) {
  const { passwordHash, ...rest } = user
  return rest
}

export default router