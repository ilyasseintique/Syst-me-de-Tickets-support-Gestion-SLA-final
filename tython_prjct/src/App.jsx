import { useMemo, useState } from "react"
import { Button } from "./components/ui/button.jsx"
import { Input } from "./components/ui/input.jsx"
import AuthPage from "./authPage.jsx"

const seedUsers = [
  { id: "u-1", name: "Nora Admin", email: "admin@helpdeskpro.dev", role: "admin" },
  { id: "u-2", name: "Maya Agent", email: "maya@helpdeskpro.dev", role: "agent" },
  { id: "u-3", name: "Lucas Agent", email: "lucas@helpdeskpro.dev", role: "agent" },
]

const seedTickets = [
  {
    id: "t-1",
    title: "Connexion impossible sur le portail",
    description: "Les utilisateurs reçoivent une erreur 401 après le login.",
    priority: "high",
    status: "open",
    createdBy: "u-1",
    assignedTo: "u-2",
    createdAt: "2026-06-22T09:10:00Z",
  },
  {
    id: "t-2",
    title: "Rapport SLA mensuel à automatiser",
    description: "Préparer un export récurrent pour le management.",
    priority: "medium",
    status: "in_progress",
    createdBy: "u-1",
    assignedTo: "u-3",
    createdAt: "2026-06-21T14:25:00Z",
  },
  {
    id: "t-3",
    title: "Erreur sur la page de profil",
    description: "Le formulaire de mise à jour casse quand le téléphone est vide.",
    priority: "low",
    status: "resolved",
    createdBy: "u-2",
    assignedTo: "u-2",
    createdAt: "2026-06-20T18:40:00Z",
  },
  {
    id: "t-4",
    title: "Facturation non synchronisée",
    description: "Décalage entre l'état Stripe et la vue interne.",
    priority: "high",
    status: "closed",
    createdBy: "u-3",
    assignedTo: "u-3",
    createdAt: "2026-06-19T11:05:00Z",
  },
]

const seedComments = [
  { id: "c-1", ticketId: "t-1", authorId: "u-2", message: "Je prends le ticket en charge.", createdAt: "2026-06-22T09:25:00Z" },
  { id: "c-2", ticketId: "t-1", authorId: "u-1", message: "Le souci touche aussi le mobile.", createdAt: "2026-06-22T09:40:00Z" },
  { id: "c-3", ticketId: "t-2", authorId: "u-3", message: "Je vérifie le modèle de données.", createdAt: "2026-06-21T14:55:00Z" },
  { id: "c-4", ticketId: "t-3", authorId: "u-2", message: "Correctif validé et déployé.", createdAt: "2026-06-20T19:10:00Z" },
]

const initialForm = {
  email: "admin@helpdeskpro.dev",
  password: "password123",
  role: "admin",
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeUser, setActiveUser] = useState(seedUsers[0])
  const [loginForm, setLoginForm] = useState(initialForm)
  const [tickets, setTickets] = useState(seedTickets)
  const [comments, setComments] = useState(seedComments)
  const [filters, setFilters] = useState({ status: "all", priority: "all", assignedTo: "all", search: "" })
  const [ticketDraft, setTicketDraft] = useState({ title: "", description: "", priority: "medium", assignedTo: "" })
  const [commentDraft, setCommentDraft] = useState("")
  const [selectedTicketId, setSelectedTicketId] = useState(seedTickets[0].id)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const selectedTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === selectedTicketId) ?? tickets[0],
    [selectedTicketId, tickets],
  )

  const visibleTickets = useMemo(() => {
    const search = filters.search.trim().toLowerCase()

    return tickets.filter((ticket) => {
      const matchesStatus = filters.status === "all" || ticket.status === filters.status
      const matchesPriority = filters.priority === "all" || ticket.priority === filters.priority
      const matchesAssignedTo = filters.assignedTo === "all" || ticket.assignedTo === filters.assignedTo
      const matchesSearch = !search || ticket.title.toLowerCase().includes(search) || ticket.description.toLowerCase().includes(search)

      return matchesStatus && matchesPriority && matchesAssignedTo && matchesSearch
    })
  }, [filters, tickets])

  const dashboard = useMemo(() => {
    const resolvedTickets = tickets.filter((ticket) => ticket.status === "resolved")

    const topAgents = seedUsers
      .filter((user) => user.role === "agent")
      .map((agent) => ({
        ...agent,
        resolvedCount: tickets.filter(
          (ticket) => ticket.status === "resolved" && ticket.assignedTo === agent.id,
        ).length,
      }))
      .sort((left, right) => right.resolvedCount - left.resolvedCount)

    return {
      total: tickets.length,
      open: tickets.filter((ticket) => ticket.status === "open").length,
      inProgress: tickets.filter((ticket) => ticket.status === "in_progress").length,
      resolved: resolvedTickets.length,
      topAgents: topAgents.slice(0, 5),
    }
  }, [tickets])

  const handleLoginChange = (event) => {
    const { name, value } = event.target
    setLoginForm((current) => ({ ...current, [name]: value }))
  }

  const handleLogin = (event) => {
    event.preventDefault()
    setLoading(true)

    const user = seedUsers.find((entry) => entry.email === loginForm.email && entry.role === loginForm.role) ?? seedUsers[0]

    window.setTimeout(() => {
      setActiveUser(user)
      setIsAuthenticated(true)
      setMessage(`Connecté en tant que ${user.name}`)
      setLoading(false)
    }, 350)
  }

  const handleQuickFill = (role) => {
    const user = seedUsers.find((entry) => entry.role === role) ?? seedUsers[0]
    setLoginForm({ email: user.email, password: "password123", role: user.role })
  }

  const handleTicketDraftChange = (event) => {
    const { name, value } = event.target
    setTicketDraft((current) => ({ ...current, [name]: value }))
  }

  const handleCreateTicket = (event) => {
    event.preventDefault()

    if (!ticketDraft.title.trim() || !ticketDraft.description.trim()) {
      setMessage("Le titre et la description sont obligatoires.")
      return
    }

    const nextTicket = {
      id: `t-${Date.now()}`,
      title: ticketDraft.title.trim(),
      description: ticketDraft.description.trim(),
      priority: ticketDraft.priority,
      status: "open",
      createdBy: activeUser.id,
      assignedTo: ticketDraft.assignedTo || null,
      createdAt: new Date().toISOString(),
    }

    setTickets((current) => [nextTicket, ...current])
    setSelectedTicketId(nextTicket.id)
    setTicketDraft({ title: "", description: "", priority: "medium", assignedTo: "" })
    setMessage("Ticket créé avec succès.")
  }

  const updateTicketStatus = (ticketId, nextStatus) => {
    setTickets((current) =>
      current.map((ticket) => {
        if (ticket.id !== ticketId) return ticket
        if (nextStatus === "closed" && ticket.status !== "resolved") {
          setMessage("Un ticket doit d'abord passer en resolved avant closed.")
          return ticket
        }

        return { ...ticket, status: nextStatus }
      }),
    )
  }

  const assignTicket = (ticketId, agentId) => {
    setTickets((current) => current.map((ticket) => (ticket.id === ticketId ? { ...ticket, assignedTo: agentId } : ticket)))
    setMessage("Affectation mise à jour.")
  }

  const handleAddComment = (event) => {
    event.preventDefault()

    if (!commentDraft.trim()) return
    if (selectedTicket.status === "closed") {
      setMessage("Impossible d'ajouter un commentaire sur un ticket closed.")
      return
    }

    const nextComment = {
      id: `c-${Date.now()}`,
      ticketId: selectedTicket.id,
      authorId: activeUser.id,
      message: commentDraft.trim(),
      createdAt: new Date().toISOString(),
    }

    setComments((current) => [...current, nextComment])
    setCommentDraft("")
    setMessage("Commentaire ajouté.")
  }

  if (!isAuthenticated) {
    return (
      <AuthPage
        form={loginForm}
        error={message}
        loading={loading}
        onChange={handleLoginChange}
        onSubmit={handleLogin}
        onQuickFill={handleQuickFill}
      />
    )
  }

  const ticketComments = comments.filter((comment) => comment.ticketId === selectedTicket.id)

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">HelpDeskPro</p>
            <h1 className="mt-1 text-2xl font-semibold">Dashboard support et SLA</h1>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div>
              <p className="text-xs text-slate-400">Connecté</p>
              <p className="text-sm font-medium text-white">{activeUser.name}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
              onClick={() => setIsAuthenticated(false)}
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {message ? (
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
            {message}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Total tickets", dashboard.total],
            ["Open", dashboard.open],
            ["In progress", dashboard.inProgress],
            ["Resolved", dashboard.resolved],
          ].map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20">
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">Liste des tickets</h2>
                <p className="text-sm text-slate-400">Filtres, recherche et transitions métier.</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                <span className="rounded-full border border-white/10 px-3 py-1">Règle: closed seulement après resolved</span>
                <span className="rounded-full border border-white/10 px-3 py-1">Commentaires interdits sur closed</span>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-4">
              <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} className="h-11 rounded-xl border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none">
                <option value="all">Tous les statuts</option>
                <option value="open">open</option>
                <option value="in_progress">in_progress</option>
                <option value="resolved">resolved</option>
                <option value="closed">closed</option>
              </select>
              <select value={filters.priority} onChange={(event) => setFilters((current) => ({ ...current, priority: event.target.value }))} className="h-11 rounded-xl border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none">
                <option value="all">Toutes les priorités</option>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
              <select value={filters.assignedTo} onChange={(event) => setFilters((current) => ({ ...current, assignedTo: event.target.value }))} className="h-11 rounded-xl border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none">
                <option value="all">Tous les agents</option>
                {seedUsers.filter((user) => user.role === "agent").map((agent) => (
                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                ))}
              </select>
              <Input
                value={filters.search}
                onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                placeholder="Recherche titre ou description"
                className="h-11 bg-slate-900 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="mt-5 space-y-3">
              {visibleTickets.map((ticket) => {
                const assignedUser = seedUsers.find((user) => user.id === ticket.assignedTo)

                return (
                  <article key={ticket.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{ticket.title}</h3>
                        <p className="mt-1 text-sm text-slate-400">{ticket.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                          <span className="rounded-full border border-white/10 px-2 py-1">{ticket.priority}</span>
                          <span className="rounded-full border border-white/10 px-2 py-1">{ticket.status}</span>
                          <span className="rounded-full border border-white/10 px-2 py-1">{assignedUser ? assignedUser.name : "non assigné"}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={() => setSelectedTicketId(ticket.id)}>
                          Détails
                        </Button>
                        <Button type="button" className="bg-cyan-400 text-slate-950 hover:bg-cyan-300" onClick={() => updateTicketStatus(ticket.id, "in_progress")}>Start</Button>
                        <Button type="button" variant="secondary" className="bg-emerald-400/15 text-emerald-100 hover:bg-emerald-400/25" onClick={() => updateTicketStatus(ticket.id, "resolved")}>Resolve</Button>
                        <Button type="button" variant="destructive" onClick={() => updateTicketStatus(ticket.id, "closed")}>Close</Button>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button type="button" variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={() => assignTicket(ticket.id, "u-2")}>Assign Maya</Button>
                      <Button type="button" variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={() => assignTicket(ticket.id, "u-3")}>Assign Lucas</Button>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20">
              <div>
                <h2 className="text-xl font-semibold text-white">Créer un ticket</h2>
                <p className="text-sm text-slate-400">POST /api/tickets</p>
              </div>

              <form className="mt-4 space-y-3" onSubmit={handleCreateTicket}>
                <Input name="title" value={ticketDraft.title} onChange={handleTicketDraftChange} placeholder="Titre du ticket" className="h-11 bg-slate-900 text-white placeholder:text-slate-500" />
                <textarea name="description" value={ticketDraft.description} onChange={handleTicketDraftChange} placeholder="Description" rows="4" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500" />
                <div className="grid gap-3 md:grid-cols-2">
                  <select name="priority" value={ticketDraft.priority} onChange={handleTicketDraftChange} className="h-11 rounded-xl border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none">
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                  </select>
                  <select name="assignedTo" value={ticketDraft.assignedTo} onChange={handleTicketDraftChange} className="h-11 rounded-xl border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none">
                    <option value="">Assignation optionnelle</option>
                    {seedUsers.filter((user) => user.role === "agent").map((agent) => (
                      <option key={agent.id} value={agent.id}>{agent.name}</option>
                    ))}
                  </select>
                </div>
                <Button type="submit" className="h-11 w-full bg-amber-400 text-slate-950 hover:bg-amber-300">Créer le ticket</Button>
              </form>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20">
              <div>
                <h2 className="text-xl font-semibold text-white">Détails ticket</h2>
                <p className="text-sm text-slate-400">{selectedTicket.title}</p>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <p><span className="text-slate-500">Statut:</span> {selectedTicket.status}</p>
                <p><span className="text-slate-500">Priorité:</span> {selectedTicket.priority}</p>
                <p><span className="text-slate-500">Créé par:</span> {seedUsers.find((user) => user.id === selectedTicket.createdBy)?.name}</p>
              </div>

              <form className="mt-4 space-y-3" onSubmit={handleAddComment}>
                <textarea value={commentDraft} onChange={(event) => setCommentDraft(event.target.value)} placeholder="Ajouter un commentaire" rows="4" className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500" />
                <Button type="submit" className="h-11 w-full bg-cyan-400 text-slate-950 hover:bg-cyan-300">Ajouter commentaire</Button>
              </form>

              <div className="mt-4 space-y-3">
                {ticketComments.map((comment) => (
                  <article key={comment.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
                    <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                      <span>{seedUsers.find((user) => user.id === comment.authorId)?.name}</span>
                      <span>{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="mt-2 leading-6">{comment.message}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20">
              <h2 className="text-xl font-semibold text-white">Top agents</h2>
              <div className="mt-4 space-y-3">
                {dashboard.topAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm">
                    <span>{agent.name}</span>
                    <span className="text-cyan-300">{agent.resolvedCount} résolus</span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default App
