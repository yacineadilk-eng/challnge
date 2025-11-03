# StudyChallenge - Site de défis d'études entre amis 📚

## 🎯 Fonctionnalités

### ✅ Système d'authentification
- **Connexion/Inscription** sécurisée
- **Gestion des utilisateurs** avec LocalStorage
- **Utilisateurs de démonstration** pré-créés

### ⏱️ Timer d'étude intelligent
- **Chronomètre précis** avec contrôles play/pause/stop
- **Suivi des sessions** automatique
- **Statistiques journalières** et hebdomadaires
- **Sauvegarde temps réel** des données

### 🏆 Système de challenges
- **Création de challenges** entre amis (1-14 jours)
- **Invitation d'utilisateurs** par nom
- **Classements en temps réel** par challenge
- **Suivi des participants** avec médailles

### 📊 Classements et statistiques
- **Leaderboard hebdomadaire** global
- **Temps d'étude détaillé** (jour/semaine)
- **Historique des sessions** complet
- **Comparaison entre utilisateurs**

## 🚀 Installation et utilisation

### 1. Téléchargement
Tous les fichiers sont prêts à utiliser :
```
StudyChallenge/
├── index.html       # Page principale
├── style.css        # Styles modernes
├── app.js          # Application frontend
├── database.js     # Base de données LocalStorage
└── README.md       # Ce fichier
```

### 2. Lancement
1. **Ouvrir `index.html`** dans votre navigateur
2. **Aucun serveur requis** - fonctionne en local !

### 3. Comptes de démonstration
Utilisez ces comptes pour tester :
- **Username:** `Alice` / **Password:** `demo123`
- **Username:** `Bob` / **Password:** `demo123` 
- **Username:** `Charlie` / **Password:** `demo123`

## 🎮 Comment utiliser

### Première connexion
1. **Se connecter** avec un compte démo ou **créer un nouveau compte**
2. Découvrir l'interface avec **challenge pré-créé**
3. **Commencer une session d'étude** immédiatement

### Créer un challenge
1. Cliquer **"Nouveau challenge"**
2. Donner un **nom** (ex: "Challenge Mathématiques")
3. Choisir la **durée** (1-14 jours)
4. **Inviter des amis** par leur nom d'utilisateur
5. **Lancer le challenge !**

### Étudier efficacement
1. **Appuyer sur "Commencer"** pour démarrer le timer
2. **Utiliser pause/reprendre** selon vos besoins
3. **Arrêter** à la fin pour sauvegarder
4. **Voir vos statistiques** mises à jour automatiquement

## 🛠️ Architecture technique

### Frontend pur (No server needed!)
- **HTML5** sémantique et accessible
- **CSS3** moderne avec animations
- **JavaScript ES6+** avec classes
- **LocalStorage** pour persistance

### Base de données client
- **Tables** : Users, Challenges, Sessions
- **Relations** : Users ↔ Challenges ↔ Sessions  
- **Statistiques** : Calculs temps réel
- **Sauvegarde** : Automatique à chaque action

### Responsive design
- **Mobile-first** approach
- **Breakpoints** adaptatifs
- **Touch-friendly** interfaces
- **Performance** optimisée

## 📱 Compatibilité

### Navigateurs supportés
- ✅ **Chrome/Edge** 80+
- ✅ **Firefox** 75+
- ✅ **Safari** 13+
- ✅ **Mobile** iOS/Android

### Fonctionnalités modernes
- **LocalStorage** (9.8GB disponible)
- **ES6 Classes** et modules
- **CSS Grid/Flexbox**
- **FontAwesome** icons

---

**Créé avec ❤️ pour booster votre motivation d'études !** 🎓