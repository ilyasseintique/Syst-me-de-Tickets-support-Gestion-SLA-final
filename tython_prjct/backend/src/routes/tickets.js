import { Router } from "express"
import { z } from "zod"
import { comments, tickets, users } from "../lib/store.js"
import { badRequest, forbidden, notFound } from "../lib/httpError.js"
import { requireAuth, requireRole } from "../middleware/auth.js"
import { validate } from "../middleware/validate.js"

const router = Router()

const ticketSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  priority: z.enum(["low", "medium", "high"]),
  assignedTo: z.string().min(1).optional().or(z.literal("")),
})

const statusSchema = z.object({
  status: z.enum(["open", "in_progress", "resolved", "closed"]),
})

const assignSchema = z.object({
  assignedTo: z.string().min(1),
})

const commentSchema = z.object({
  message: z.string().min(1),
})

router.use(requireAuth)

router.post("/", validate(ticketSchema), (request, response) => {
  const nextTicket = {
    id: `t-${Date.now()}`,
    title: request.body.title,
    description: request.body.description,
    priority: request.body.priority,
    status: "open",
    createdBy: request.user.id,
    assignedTo: request.body.assignedTo || null,
    createdAt: new Date().toISOString(),
  }

  tickets.unshift(nextTicket)
  response.status(201).json({ ticket: nextTicket })
})

router.get("/", (request, response) => {
  const { status, priority, assignedTo, search } = request.query

  const result = tickets.filter((ticket) => {
    const matchesStatus = !status || status === "all" || ticket.status === status
    const matchesPriority = !priority || priority === "all" || ticket.priority === priority
    const matchesAssignedTo = !assignedTo || assignedTo === "all" || ticket.assignedTo === assignedTo
    const matchesSearch = !search || `${ticket.title} ${ticket.description}`.toLowerCase().includes(String(search).toLowerCase())
    return matchesStatus && matchesPriority && matchesAssignedTo && matchesSearch
  })

  response.json({ tickets: result })
})

router.get("/:id", (request, response, next) => {
  const ticket = tickets.find((entry) => entry.id === request.params.id)

  if (!ticket) {
    next(notFound("Ticket not found"))
    return
  }

  response.json({ ticket })
})

router.put("/:id", validate(ticketSchema.partial()), (request, response, next) => {
  const ticket = tickets.find((entry) => entry.id === request.params.id)

  if (!ticket) {
    next(notFound("Ticket not found"))
    return
  }

  Object.assign(ticket, request.body)
  response.json({ ticket })
})

router.patch("/:id/status", validate(statusSchema), (request, response, next) => {
  const ticket = tickets.find((entry) => entry.id === request.params.id)

  if (!ticket) {
    next(notFound("Ticket not found"))
    return
  }

  if (request.body.status === "closed" && ticket.status !== "resolved") {
    next(badRequest("A ticket must be resolved before it can be closed"))
    return
  }

  ticket.status = request.body.status
  response.json({ ticket })
})

router.patch("/:id/assign", requireRole("admin", "agent"), validate(assignSchema), (request, response, next) => {
  const ticket = tickets.find((entry) => entry.id === request.params.id)
  const assignee = users.find((entry) => entry.id === request.body.assignedTo && entry.role === "agent")

  if (!ticket) {
    next(notFound("Ticket not found"))
    return
  }

  if (!assignee) {
    next(badRequest("Assigned user must be an agent"))
    return
  }

  ticket.assignedTo = assignee.id
  response.json({ ticket })
})

router.post("/:id/comments", validate(commentSchema), (request, response, next) => {
  const ticket = tickets.find((entry) => entry.id === request.params.id)

  if (!ticket) {
    next(notFound("Ticket not found"))
    return
  }

  if (ticket.status === "closed") {
    next(forbidden("Cannot comment on a closed ticket"))
    return
  }

  const nextComment = {
    id: `c-${Date.now()}`,
    ticketId: ticket.id,
    authorId: request.user.id,
    message: request.body.message,
    createdAt: new Date().toISOString(),
  }

  comments.push(nextComment)
  response.status(201).json({ comment: nextComment })
})

router.get("/:id/comments", (request, response, next) => {
  const ticket = tickets.find((entry) => entry.id === request.params.id)

  if (!ticket) {
    next(notFound("Ticket not found"))
    return
  }

  response.json({ comments: comments.filter((comment) => comment.ticketId === ticket.id) })
})

export default router