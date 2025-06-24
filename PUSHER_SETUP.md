# Configuration Pusher pour les Notifications en Temps Réel

## 🚀 Vue d'ensemble

Ce projet utilise Pusher pour envoyer des notifications en temps réel lorsqu'une nouvelle tâche est créée. Les utilisateurs reçoivent instantanément des notifications dans leur navigateur.

## 📋 Prérequis

1. **Compte Pusher** : Créez un compte sur [pusher.com](https://pusher.com)
2. **Application Pusher** : Créez une nouvelle application dans votre dashboard Pusher
3. **Clés d'API** : Notez vos clés d'API (App ID, Key, Secret, Cluster)

## ⚙️ Configuration

### 1. Variables d'environnement

Ajoutez ces variables dans votre fichier `.env` :

```env
# Broadcasting
BROADCAST_DRIVER=pusher

# Pusher Configuration
PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_app_key
PUSHER_APP_SECRET=your_app_secret
PUSHER_APP_CLUSTER=your_cluster
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_ENCRYPTED=true
```

### 2. Configuration Laravel

Le fichier `config/broadcasting.php` est déjà configuré avec les paramètres Pusher.

### 3. Configuration JavaScript

Dans le fichier `public/js/pusher-client.js`, remplacez les valeurs par défaut :

```javascript
// Remplacez ces valeurs par vos clés Pusher
this.pusher = new Pusher('YOUR_PUSHER_APP_KEY', {
    cluster: 'YOUR_PUSHER_CLUSTER',
    // ...
});
```

## 🔧 Fonctionnalités Implémentées

### 1. Événement TaskCreated

- **Fichier** : `app/Events/TaskCreated.php`
- **Fonction** : Diffuse une notification quand une tâche est créée
- **Canal** : `private-user.{user_id}` (canal privé par utilisateur)
- **Données** : Informations de la tâche + message personnalisé

### 2. Listener SendTaskNotification

- **Fichier** : `app/Listeners/SendTaskNotification.php`
- **Fonction** : Gère les notifications (logging, emails, etc.)
- **Queue** : Exécuté en arrière-plan pour de meilleures performances

### 3. Authentification des Canaux

- **Fichier** : `app/Http/Controllers/BroadcastController.php`
- **Route** : `POST /api/broadcasting/auth`
- **Fonction** : Authentifie les utilisateurs pour les canaux privés

### 4. Client JavaScript

- **Fichier** : `public/js/pusher-client.js`
- **Fonctionnalités** :
  - Connexion automatique à Pusher
  - Écoute des événements de tâches
  - Notifications navigateur
  - Mise à jour automatique de la liste des tâches
  - Animations et effets visuels

## 🧪 Test et Démonstration

### 1. Page de Démonstration

Accédez à `http://localhost:8000/tasks-demo.html` pour tester les notifications.

### 2. Test avec Postman

1. **Connectez-vous** avec `POST /api/auth/login`
2. **Créez une tâche** avec `POST /api/tasks`
3. **Ouvrez la page de démonstration** dans votre navigateur
4. **Observez la notification** en temps réel

### 3. Test avec cURL

```bash
# Créer une tâche
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "Test notification",
    "priority": "high",
    "status": "pending"
  }'
```

## 📱 Fonctionnalités des Notifications

### 1. Notifications Navigateur

- **Permission automatique** : Demande d'autorisation si nécessaire
- **Cliquez pour naviguer** : Redirection vers la tâche
- **Auto-fermeture** : Fermeture automatique après 5 secondes
- **Icône personnalisée** : Utilise l'icône de l'application

### 2. Mise à Jour de l'Interface

- **Ajout automatique** : Nouvelle tâche ajoutée en haut de la liste
- **Animation d'arrivée** : Effet visuel pour la nouvelle tâche
- **Mise en surbrillance** : Animation de focus sur la tâche

### 3. Statut de Connexion

- **Indicateur visuel** : Statut de connexion Pusher en temps réel
- **Reconnexion automatique** : Gestion des déconnexions
- **Logs détaillés** : Historique des événements

## 🔒 Sécurité

### 1. Canaux Privés

- Chaque utilisateur a son propre canal : `private-user.{user_id}`
- Authentification requise pour accéder aux canaux
- Vérification des permissions côté serveur

### 2. Authentification JWT

- Utilisation du token JWT pour l'authentification
- Vérification de l'identité de l'utilisateur
- Protection contre l'accès non autorisé

### 3. Validation des Données

- Validation côté serveur pour toutes les données
- Sanitisation des entrées utilisateur
- Protection contre les injections

## 🚀 Déploiement

### 1. Variables de Production

```env
# Production Pusher (remplacez par vos vraies clés)
PUSHER_APP_ID=your_production_app_id
PUSHER_APP_KEY=your_production_app_key
PUSHER_APP_SECRET=your_production_app_secret
PUSHER_APP_CLUSTER=your_production_cluster
```

### 2. Configuration SSL

```env
PUSHER_SCHEME=https
PUSHER_PORT=443
PUSHER_APP_ENCRYPTED=true
```

### 3. Queues (Optionnel)

Pour de meilleures performances, configurez les queues :

```bash
# Installer Redis
composer require predis/predis

# Configurer les queues
php artisan queue:work
```

## 🐛 Dépannage

### 1. Problèmes de Connexion

- **Vérifiez vos clés Pusher** dans le fichier `.env`
- **Vérifiez le cluster** dans la configuration JavaScript
- **Vérifiez les logs** dans `storage/logs/laravel.log`

### 2. Notifications qui ne s'affichent pas

- **Vérifiez les permissions** du navigateur
- **Vérifiez la console** pour les erreurs JavaScript
- **Vérifiez la connexion Pusher** dans l'indicateur de statut

### 3. Authentification échoue

- **Vérifiez le token JWT** dans les headers
- **Vérifiez la route d'authentification** `/api/broadcasting/auth`
- **Vérifiez les logs** pour les erreurs d'authentification

## 📚 Ressources

- [Documentation Pusher](https://pusher.com/docs)
- [Laravel Broadcasting](https://laravel.com/docs/broadcasting)
- [Pusher JavaScript SDK](https://github.com/pusher/pusher-js)
- [Notifications Web API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

## 🤝 Support

Pour toute question ou problème :

1. Vérifiez les logs Laravel : `storage/logs/laravel.log`
2. Vérifiez la console du navigateur pour les erreurs JavaScript
3. Testez la connexion Pusher dans le dashboard
4. Consultez la documentation officielle Pusher 