import bcrypt from "bcrypt"

export const users = [
  { id: "u-1", name: "Nora Admin", email: "admin@helpdeskpro.dev", passwordHash: bcrypt.hashSync("password123", 10), role: "admin" },
  { id: "u-2", name: "Maya Agent", email: "maya@helpdeskpro.dev", passwordHash: bcrypt.hashSync("password123", 10), role: "agent" },
  { id: "u-3", name: "Lucas Agent", email: "lucas@helpdeskpro.dev", passwordHash: bcrypt.hashSync("password123", 10), role: "agent" },
]

export const tickets = [
  { id: "t-1", title: "Connexion impossible", description: "Erreur 401 après login", priority: "high", status: "open", createdBy: "u-1", assignedTo: "u-2", createdAt: "2026-06-22T09:10:00Z" },
  { id: "t-2", title: "Rapport SLA", description: "Export récurrent à automatiser", priority: "medium", status: "in_progress", createdBy: "u-1", assignedTo: "u-3", createdAt: "2026-06-21T14:25:00Z" },
  { id: "t-3", title: "Erreur profil", description: "Le formulaire casse si téléphone vide", priority: "low", status: "resolved", createdBy: "u-2", assignedTo: "u-2", createdAt: "2026-06-20T18:40:00Z" },
  { id: "t-4", title: "Facturation non synchronisée", description: "Décalage entre Stripe et la vue interne", priority: "high", status: "closed", createdBy: "u-3", assignedTo: "u-3", createdAt: "2026-06-19T11:05:00Z" },
]

export const comments = [
  { id: "c-1", ticketId: "t-1", authorId: "u-2", message: "Je prends le ticket.", createdAt: "2026-06-22T09:25:00Z" },
  { id: "c-2", ticketId: "t-1", authorId: "u-1", message: "Impact mobile aussi.", createdAt: "2026-06-22T09:40:00Z" },
  { id: "c-3", ticketId: "t-2", authorId: "u-3", message: "Je vérifie le modèle de données.", createdAt: "2026-06-21T14:55:00Z" },
  { id: "c-4", ticketId: "t-3", authorId: "u-2", message: "Correctif validé.", createdAt: "2026-06-20T19:10:00Z" },
]