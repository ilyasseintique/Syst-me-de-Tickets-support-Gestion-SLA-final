# HelpDeskPro

Application de tickets support et SLA réalisée comme livrable de test technique.

## Contenu
- Frontend React + Vite avec écran de connexion, dashboard, filtres tickets, commentaires et actions métier.
- Backend Express de référence avec authentification, gestion des tickets et dashboard.
- Schéma PostgreSQL, index, contraintes et documents de conception.
- Données de seed de démonstration dans le front et dans le backend.

## Démarrage frontend
```bash
npm install
npm run dev
```

## Démarrage backend
```bash
cd backend
npm install
npm run dev
```

## Variables d'environnement
Copiez `.env.example` vers `.env` et adaptez les valeurs.

## Notes métier
- Un ticket ne peut passer à `closed` que s'il est déjà `resolved`.
- Un commentaire est interdit si le ticket est `closed`.
- Les rôles sont `admin` et `agent`.

## Fichiers utiles
- [Conception](docs/helpdeskpro-design.md)
- [SQL PostgreSQL](database/schema.sql)
