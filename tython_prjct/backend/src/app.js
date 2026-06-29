import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.js"
import ticketRoutes from "./routes/tickets.js"
import dashboardRoutes from "./routes/dashboard.js"
import { errorHandler, notFound } from "./middleware/errors.js"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/health", (_request, response) => {
  response.json({ ok: true })
})

app.use("/api/auth", authRoutes)
app.use("/api/tickets", ticketRoutes)
app.use("/api/dashboard", dashboardRoutes)

app.use(notFound)
app.use(errorHandler)

export default app