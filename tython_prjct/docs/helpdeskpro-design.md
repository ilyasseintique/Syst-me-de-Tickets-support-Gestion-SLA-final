# HelpDeskPro - Conception

## Objectif
Construire une application de support avec gestion des tickets, des commentaires, des rôles et d'un dashboard SLA.

## Modèle de données

### users
- `id` UUID PK
- `name` texte
- `email` unique
- `password_hash`
- `role` = `admin` | `agent`
- timestamps

### tickets
- `id` UUID PK
- `title`
- `description`
- `priority` = `low` | `medium` | `high`
- `status` = `open` | `in_progress` | `resolved` | `closed`
- `created_by` FK -> users.id
- `assigned_to` FK -> users.id, nullable
- timestamps

### ticket_comments
- `id` UUID PK
- `ticket_id` FK -> tickets.id
- `author_id` FK -> users.id
- `message`
- `created_at`

## Contraintes métier
- Un ticket ne peut passer à `closed` que depuis `resolved`.
- Un commentaire est interdit si le ticket est `closed`.
- Les rôles applicatifs sont `admin` et `agent`.

## Index recommandés
- `tickets(status)`
- `tickets(priority)`
- `tickets(created_at DESC)`
- `tickets(assigned_to)`
- `ticket_comments(ticket_id, created_at DESC)`
- `users(role)`

## Flux API
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/tickets`
- `GET /api/tickets`
- `GET /api/tickets/:id`
- `PUT /api/tickets/:id`
- `PATCH /api/tickets/:id/status`
- `PATCH /api/tickets/:id/assign`
- `POST /api/tickets/:id/comments`
- `GET /api/tickets/:id/comments`
- `GET /api/dashboard/summary`