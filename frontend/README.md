# Task Manager Frontend - Vue.js

Frontend Vue.js pour l'application de gestion de tâches avec notifications en temps réel.

## 🚀 Technologies

- **Vue.js 3** - Framework JavaScript progressif
- **Pinia** - Gestion d'état moderne pour Vue
- **Vue Router** - Routeur officiel pour Vue.js
- **Axios** - Client HTTP pour les requêtes API
- **Laravel Echo** - Bibliothèque pour les événements temps réel
- **Pusher-js** - Client JavaScript pour Pusher
- **Vite** - Outil de build rapide

## 📦 Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer les variables d'environnement :
Créer un fichier `.env` à la racine du projet :
```env
VITE_API_URL=http://localhost:8000/api
VITE_PUSHER_KEY=794f0c1940bd3ed42386
VITE_PUSHER_CLUSTER=eu
```

## 🏃‍♂️ Démarrage

### Mode développement
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:3000`

### Build de production
```bash
npm run build
```

### Prévisualisation du build
```bash
npm run preview
```

## 🏗️ Structure du projet

```
src/
├── components/          # Composants réutilisables
├── views/              # Pages de l'application
│   ├── Home.vue        # Page d'accueil
│   ├── Login.vue       # Page de connexion
│   ├── Register.vue    # Page d'inscription
│   ├── Tasks.vue       # Liste des tâches
│   └── TaskDetail.vue  # Détail d'une tâche
├── stores/             # Stores Pinia
│   ├── auth.js         # Gestion de l'authentification
│   ├── tasks.js        # Gestion des tâches
│   ├── notification.js # Gestion des notifications
│   └── echo.js         # Gestion de Laravel Echo
├── services/           # Services API
│   ├── authService.js  # Service d'authentification
│   └── taskService.js  # Service des tâches
├── utils/              # Utilitaires
├── router/             # Configuration du routeur
│   └── index.js
├── App.vue             # Composant racine
├── main.js             # Point d'entrée
└── style.css           # Styles globaux
```

## 🔐 Authentification

L'application utilise JWT pour l'authentification :

- **Login** : `/login`
- **Register** : `/register`
- **Logout** : Automatique via le store

Les tokens sont stockés dans le localStorage et automatiquement inclus dans les requêtes API.

## 📡 Temps réel

L'application utilise Laravel Echo avec Pusher pour les notifications en temps réel :

- Connexion automatique lors de l'authentification
- Écoute des événements de création de tâches
- Notifications toast pour les nouveaux événements
- Indicateur de statut de connexion

## 🎨 Interface utilisateur

- Design responsive et moderne
- Composants réutilisables
- Animations et transitions fluides
- Notifications toast
- Indicateurs de chargement

## 🔧 Configuration

### Proxy API
Le serveur de développement est configuré pour rediriger les requêtes `/api` vers le backend Laravel sur `http://localhost:8000`.

### Pusher
Configuration Pusher dans `src/stores/echo.js` :
- Clé : `794f0c1940bd3ed42386`
- Cluster : `eu`
- Endpoint d'authentification : `/api/broadcasting/auth`

## 📱 Fonctionnalités

- ✅ Authentification JWT
- ✅ Gestion des tâches (CRUD)
- ✅ Notifications temps réel
- ✅ Interface responsive
- ✅ Gestion d'état avec Pinia
- ✅ Navigation avec Vue Router
- ✅ Intercepteurs Axios pour les tokens

## 🚀 Déploiement

1. Build de production :
```bash
npm run build
```

2. Les fichiers de production seront dans le dossier `dist/`

3. Servir les fichiers statiques avec un serveur web (nginx, Apache, etc.)

## 🔗 Intégration avec le backend

Le frontend communique avec le backend Laravel via l'API REST :

- **Base URL** : `http://localhost:8000/api`
- **Authentification** : Bearer Token JWT
- **Broadcasting** : Pusher avec canaux privés

## 📝 Scripts disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualise le build de production
- `npm run lint` - Lint le code avec ESLint 