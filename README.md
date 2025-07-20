# API de gestion des utilisateurs pour association

Ce projet est une API REST Node.js avec interface web simpliste pour la gestion des utilisateurs et des permissions (Admin, Gérant, Visiteur, Non authentifié), adaptée à une association. La base de données utilisée est SQLite3.

## Fonctionnalités principales

- **API REST** pour la gestion des utilisateurs (CRUD)
- **Gestion des rôles** :
  - Admin : gestion complète
  - Gérant : (à adapter si besoin)
  - Visiteur : accès limité
  - Non authentifié : accès restreint
- **Interface HTML** pour la gestion manuelle des comptes
- **Création du premier compte admin** à la première visite
- **Authentification par session**

## Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/BouleDePoils76/API.git
   cd API
   ```
2. **Installer les dépendances**
   ```bash
   npm install
   ```
3. **Lancer le serveur**
   ```bash
   npm start
   ```
4. **Accéder à l'application**
   Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure du projet

```
API/
├── public/
│   ├── dashboard.html         # Interface de gestion des utilisateurs
│   ├── login.html             # Page de connexion
│   └── register-admin.html    # Création du premier admin
├── server.js                  # Serveur principal Node.js
├── package.json               # Dépendances et scripts
└── users.db                   # Base SQLite3 (créée automatiquement)
```

## Utilisation

### Création du premier admin
- À la première visite, si aucun admin n'existe, la page `/register-admin` s'affiche pour créer le compte administrateur initial.

### Connexion
- Accès via `/login`.
- Après connexion, accès au dashboard de gestion.

### Dashboard (interface de gestion)
- Ajouter, supprimer des utilisateurs (admin uniquement)
- Visualiser la liste des comptes et leurs rôles

### API REST (routes principales)

| Méthode | Route             | Rôle requis | Description                        |
|---------|-------------------|-------------|-------------------------------------|
| GET     | /api/users        | admin       | Liste tous les utilisateurs         |
| POST    | /api/users        | admin       | Crée un nouvel utilisateur          |
| DELETE  | /api/users/:id    | admin       | Supprime un utilisateur             |

> **Note** : Les routes peuvent être adaptées pour gérer d'autres rôles (gérant, visiteur) selon les besoins.

## Sécurité
- Les mots de passe sont hashés avec bcrypt.
- Les sessions sont gérées côté serveur.
- Les routes sensibles sont protégées par des middlewares de vérification de rôle.

## Personnalisation
- Pour ajouter des permissions ou des rôles, adapter la logique dans `server.js`.
- Pour modifier l'interface, éditer les fichiers HTML dans `public/`.

## Dépendances principales
- [express](https://www.npmjs.com/package/express)
- [express-session](https://www.npmjs.com/package/express-session)
- [sqlite3](https://www.npmjs.com/package/sqlite3)
- [bcrypt](https://www.npmjs.com/package/bcrypt)

## Licence
MIT

---

**Contact** : [BouleDePoils76](https://github.com/BouleDePoils76)
