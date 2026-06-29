import { Router } from "express"
import { comments, tickets, users } from "../lib/store.js"
import { requireAuth } from "../middleware/auth.js"

const router = Router()

router.use(requireAuth)

router.get("/summary", (_request, response) => {
  const topAgents = users
    .filter((user) => user.role === "agent")
    .map((agent) => ({
      ...agent,
      resolvedCount: tickets.filter((ticket) => ticket.status === "resolved" && ticket.assignedTo === agent.id).length,
    }))
    .sort((left, right) => right.resolvedCount - left.resolvedCount)
    .slice(0, 5)

  response.json({
    totalTickets: tickets.length,
    openTickets: tickets.filter((ticket) => ticket.status === "open").length,
    inProgressTickets: tickets.filter((ticket) => ticket.status === "in_progress").length,
    resolvedTickets: tickets.filter((ticket) => ticket.status === "resolved").length,
    totalComments: comments.length,
    topAgents,
  })
})

export default router