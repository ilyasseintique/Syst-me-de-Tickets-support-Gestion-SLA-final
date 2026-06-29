import { Button } from "./components/ui/button.jsx"
import { Input } from "./components/ui/input.jsx"

export default function AuthPage({ form, error, loading, onChange, onSubmit, onQuickFill }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_transparent_28%),linear-gradient(180deg,#08111f_0%,#050914_100%)] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(45,212,191,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(251,191,36,0.18),_transparent_28%)]" />
          <div className="relative space-y-6">
            <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
              HelpDeskPro
            </span>
            <div className="space-y-3">
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Centralisez les tickets, les échanges et la SLA dans une seule interface.
              </h1>
              <p className="max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
                Démo front pour l&apos;épreuve technique: authentification, listes filtrées,
                commentaires, actions de statut et tableau de bord.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Tickets", "CRUD + filtres + recherche"],
                ["SLA", "Règles métier strictes"],
                ["Rôles", "Admin / agent"],
              ].map(([title, description]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="text-sm font-semibold text-white">{title}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-400">{description}</div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
              Astuce: utilisez les accès rapides pour charger un compte de démo et découvrir le dashboard en quelques secondes.
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white">Connexion</h2>
            <p className="text-sm text-slate-400">
              Authentification locale de démonstration, alignée avec le schéma backend prévu.
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                Email
              </label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="admin@helpdeskpro.dev"
                className="h-11 bg-white/5 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                Mot de passe
              </label>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
                className="h-11 bg-white/5 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                Rôle
              </label>
              <select
                name="role"
                value={form.role}
                onChange={onChange}
                className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition focus:border-amber-300/60"
              >
                <option value="admin">admin</option>
                <option value="agent">agent</option>
              </select>
            </div>

            {error ? (
              <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                type="submit"
                disabled={loading}
                className="h-11 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300"
              >
                {loading ? "Connexion..." : "Accéder au dashboard"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
                onClick={() => onQuickFill("admin")}
              >
                Charger admin
              </Button>
            </div>
          </form>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="secondary"
              className="h-11 rounded-xl bg-cyan-400/15 text-cyan-100 hover:bg-cyan-400/20"
              onClick={() => onQuickFill("agent")}
            >
              Charger un agent
            </Button>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-5 text-slate-400">
              Démonstration locale. Le backend Express et les scripts PostgreSQL sont inclus dans le dépôt.
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
