// Application principale
class StudyApp {
    constructor() {
        this.currentUser = null;
        this.studyTimer = null;
        this.startTime = null;
        this.elapsedTime = 0;
        this.isStudying = false;
        this.isPaused = false;
        this.currentSession = null;
        
        this.init();
    }

    init() {
        // Vérifier si l'utilisateur est déjà connecté
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    // Gestion des pages
    showLogin() {
        document.getElementById('loginPage').classList.add('active');
        document.getElementById('dashboardPage').classList.remove('active');
    }

    showDashboard() {
        document.getElementById('loginPage').classList.remove('active');
        document.getElementById('dashboardPage').classList.add('active');
        
        if (this.currentUser) {
            document.getElementById('currentUser').textContent = this.currentUser.username;
            this.updateStats();
            this.loadChallenges();
            this.updateLeaderboard();
        }
    }

    // Authentification
    login(username, password) {
        const user = db.getUserByUsername(username);
        if (user && user.password === password) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.showDashboard();
            return true;
        }
        return false;
    }

    register(userData) {
        // Vérifier si l'utilisateur existe déjà
        if (db.getUserByUsername(userData.username)) {
            throw new Error('Ce nom d\'utilisateur existe déjà');
        }

        const user = db.createUser(userData);
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.showDashboard();
        return user;
    }

    logout() {
        if (this.isStudying) {
            this.stopStudy();
        }
        
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showLogin();
    }

    // Timer d'étude
    startStudy() {
        if (!this.isStudying) {
            this.isStudying = true;
            this.isPaused = false;
            this.startTime = Date.now() - this.elapsedTime;
            
            // Créer une nouvelle session d'étude
            this.currentSession = db.createStudySession({
                userId: this.currentUser.id,
                startTime: new Date().toISOString(),
                duration: 0,
                status: 'active'
            });
            
            this.studyTimer = setInterval(() => {
                this.updateTimer();
            }, 1000);
            
            this.updateTimerControls();
        }
    }

    pauseStudy() {
        if (this.isStudying && !this.isPaused) {
            this.isPaused = true;
            clearInterval(this.studyTimer);
            this.updateTimerControls();
        }
    }

    resumeStudy() {
        if (this.isStudying && this.isPaused) {
            this.isPaused = false;
            this.startTime = Date.now() - this.elapsedTime;
            this.studyTimer = setInterval(() => {
                this.updateTimer();
            }, 1000);
            this.updateTimerControls();
        }
    }

    stopStudy() {
        if (this.isStudying) {
            this.isStudying = false;
            this.isPaused = false;
            clearInterval(this.studyTimer);
            
            // Sauvegarder la session
            if (this.currentSession && this.elapsedTime > 0) {
                db.updateStudySession(this.currentSession.id, {
                    endTime: new Date().toISOString(),
                    duration: this.elapsedTime,
                    status: 'completed'
                });
            }
            
            this.elapsedTime = 0;
            this.currentSession = null;
            this.updateTimer();
            this.updateTimerControls();
            this.updateStats();
            this.updateLeaderboard();
        }
    }

    updateTimer() {
        if (this.isStudying && !this.isPaused) {
            this.elapsedTime = Date.now() - this.startTime;
        }
        
        document.getElementById('timerDisplay').textContent = db.formatTimer(this.elapsedTime);
        
        // Mettre à jour la session en cours
        if (this.currentSession && this.elapsedTime > 0) {
            db.updateStudySession(this.currentSession.id, {
                duration: this.elapsedTime
            });
        }
    }

    updateTimerControls() {
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const stopBtn = document.getElementById('stopBtn');
        
        if (!this.isStudying) {
            startBtn.style.display = 'inline-flex';
            pauseBtn.style.display = 'none';
            stopBtn.style.display = 'none';
            startBtn.innerHTML = '<i class="fas fa-play"></i> Commencer';
        } else if (this.isPaused) {
            startBtn.style.display = 'inline-flex';
            pauseBtn.style.display = 'none';
            stopBtn.style.display = 'inline-flex';
            startBtn.innerHTML = '<i class="fas fa-play"></i> Reprendre';
            startBtn.onclick = () => this.resumeStudy();
        } else {
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-flex';
            stopBtn.style.display = 'inline-flex';
        }
    }

    // Statistiques
    updateStats() {
        if (!this.currentUser) return;
        
        const todayTime = db.getUserDayStats(this.currentUser.id);
        const weekTime = db.getUserWeekStats(this.currentUser.id);
        
        document.getElementById('todayTime').textContent = db.formatTime(todayTime);
        document.getElementById('weekTime').textContent = db.formatTime(weekTime);
    }

    // Challenges
    loadChallenges() {
        if (!this.currentUser) return;
        
        const challenges = db.getUserChallenges(this.currentUser.id);
        const challengesList = document.getElementById('challengesList');
        
        challengesList.innerHTML = '';
        
        if (challenges.length === 0) {
            challengesList.innerHTML = '<div class="no-challenges">Aucun challenge actif. Créez-en un pour commencer !</div>';
            return;
        }
        
        challenges.forEach(challenge => {
            const challengeElement = this.createChallengeElement(challenge);
            challengesList.appendChild(challengeElement);
        });
    }

    createChallengeElement(challenge) {
        const div = document.createElement('div');
        div.className = 'challenge-item';
        
        const endDate = new Date(challenge.endDate);
        const now = new Date();
        const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        
        const leaderboard = db.getChallengeLeaderboard(challenge.id);
        const participantsHtml = leaderboard.slice(0, 3).map((participant, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
            return `
                <div class="participant">
                    ${medal} ${participant.username}: ${db.formatTime(participant.studyTime)}
                </div>
            `;
        }).join('');
        
        div.innerHTML = `
            <div class="challenge-header">
                <div class="challenge-name">${challenge.name}</div>
                <div class="challenge-status ${challenge.status}">${daysLeft > 0 ? `${daysLeft} jours restants` : 'Terminé'}</div>
            </div>
            <div class="challenge-participants">
                ${participantsHtml}
            </div>
        `;
        
        return div;
    }

    createChallenge(challengeData) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + parseInt(challengeData.duration));
        
        const newChallenge = db.createChallenge({
            name: challengeData.name,
            creatorId: this.currentUser.id,
            participants: [this.currentUser.id, ...challengeData.participants],
            duration: parseInt(challengeData.duration),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        });
        
        this.loadChallenges();
        return newChallenge;
    }

    // Leaderboard
    updateLeaderboard() {
        const leaderboard = db.getWeeklyLeaderboard();
        const leaderboardElement = document.getElementById('leaderboard');
        
        leaderboardElement.innerHTML = '';
        
        leaderboard.forEach((user, index) => {
            const div = document.createElement('div');
            div.className = 'leaderboard-item';
            
            let rankClass = 'other';
            if (index === 0) rankClass = 'first';
            else if (index === 1) rankClass = 'second';
            else if (index === 2) rankClass = 'third';
            
            div.innerHTML = `
                <div class="rank ${rankClass}">${index + 1}</div>
                <div class="user-info">
                    <div class="username">${user.username}</div>
                    <div class="study-time">${db.formatTime(user.studyTime)} cette semaine</div>
                </div>
            `;
            
            leaderboardElement.appendChild(div);
        });
    }
}

// Interface utilisateur
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new StudyApp();
});

// Fonctions pour les événements HTML
function showLogin() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
    document.querySelector('.tab-btn').classList.add('active');
    document.querySelectorAll('.tab-btn')[1].classList.remove('active');
}

function showRegister() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerForm').classList.add('active');
    document.querySelector('.tab-btn').classList.remove('active');
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
}

function login(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    if (app.login(username, password)) {
        // Connexion réussie
    } else {
        alert('Nom d\'utilisateur ou mot de passe incorrect');
    }
}

function register(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        app.register({ username, email, password });
    } catch (error) {
        alert(error.message);
    }
}

function logout() {
    app.logout();
}

function startStudy() {
    app.startStudy();
}

function pauseStudy() {
    app.pauseStudy();
}

function stopStudy() {
    app.stopStudy();
}

function createChallenge() {
    document.getElementById('challengeModal').classList.add('active');
}

function closeChallengeModal() {
    document.getElementById('challengeModal').classList.remove('active');
    // Reset form
    document.getElementById('challengeName').value = '';
    document.getElementById('challengeDuration').value = '7';
    document.getElementById('challengeFriends').value = '';
}

function submitChallenge(event) {
    event.preventDefault();
    
    const name = document.getElementById('challengeName').value;
    const duration = document.getElementById('challengeDuration').value;
    const friendsInput = document.getElementById('challengeFriends').value;
    
    // Parser la liste d'amis
    const friends = friendsInput
        .split(',')
        .map(friend => friend.trim())
        .filter(friend => friend.length > 0)
        .map(username => {
            const user = db.getUserByUsername(username);
            return user ? user.id : null;
        })
        .filter(id => id !== null);
    
    app.createChallenge({
        name,
        duration,
        participants: friends
    });
    
    closeChallengeModal();
}

// Fermer les modals en cliquant en dehors
window.addEventListener('click', (event) => {
    const modal = document.getElementById('challengeModal');
    if (event.target === modal) {
        closeChallengeModal();
    }
});