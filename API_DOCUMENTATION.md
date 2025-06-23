# API Documentation - Authentification JWT

## Configuration requise

### 1. Installation du package JWT
```bash
composer require php-open-source-saver/jwt-auth
```

### 2. Publication de la configuration
```bash
php artisan vendor:publish --provider="PHPOpenSourceSaver\JWTAuth\Providers\LaravelServiceProvider"
```

### 3. Génération de la clé secrète JWT
```bash
php artisan jwt:secret
```

### 4. Exécution des migrations
```bash
php artisan migrate
```

## Endpoints d'authentification

### 1. Inscription (POST /api/auth/register)

**URL:** `POST /api/auth/register`

**Headers:**
```
Content-Type: multipart/form-data
Accept: application/json
```

**Body (form-data):**
- `full_name` (required): Nom complet de l'utilisateur
- `email` (required): Adresse email unique
- `phone_number` (optional): Numéro de téléphone
- `address` (optional): Adresse
- `image` (optional): Image de profil (jpeg, png, jpg, gif, max 2MB)
- `password` (required): Mot de passe (min 8 caractères)
- `password_confirmation` (required): Confirmation du mot de passe

**Exemple de requête:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Accept: application/json" \
  -F "full_name=John Doe" \
  -F "email=john@example.com" \
  -F "phone_number=+1234567890" \
  -F "address=123 Main St, City, Country" \
  -F "image=@/path/to/image.jpg" \
  -F "password=password123" \
  -F "password_confirmation=password123"
```

**Réponse de succès (201):**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone_number": "+1234567890",
      "address": "123 Main St, City, Country",
      "image": "users/1234567890.jpg",
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

**Réponse d'erreur (422):**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password confirmation does not match."]
  }
}
```

### 2. Connexion (POST /api/auth/login)

**URL:** `POST /api/auth/login`

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Réponse de succès (200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone_number": "+1234567890",
      "address": "123 Main St, City, Country",
      "image": "users/1234567890.jpg"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

### 3. Déconnexion (POST /api/auth/logout)

**URL:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Réponse de succès (200):**
```json
{
  "status": "success",
  "message": "Successfully logged out"
}
```

### 4. Récupérer l'utilisateur connecté (GET /api/auth/me)

**URL:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Réponse de succès (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone_number": "+1234567890",
      "address": "123 Main St, City, Country",
      "image": "users/1234567890.jpg"
    }
  }
}
```

### 5. Rafraîchir le token (POST /api/auth/refresh)

**URL:** `POST /api/auth/refresh`

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Réponse de succès (200):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

## Utilisation du token

Pour les requêtes authentifiées, incluez le token dans le header Authorization :

```
Authorization: Bearer {votre_token_jwt}
```

## Codes de statut HTTP

- `200` - Succès
- `201` - Créé avec succès
- `401` - Non autorisé (token invalide ou manquant)
- `422` - Erreur de validation
- `500` - Erreur serveur

## Notes importantes

1. **Sécurité des mots de passe** : Les mots de passe sont automatiquement hashés avec bcrypt
2. **Images** : Les images sont stockées dans `storage/app/public/users/` et accessibles via `/storage/users/`
3. **Validation** : Tous les champs sont validés côté serveur
4. **Tokens** : Les tokens JWT expirent par défaut après 1 heure
5. **Refresh** : Les tokens peuvent être rafraîchis pour prolonger la session 