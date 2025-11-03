// Base de données côté client avec LocalStorage
class StudyDatabase {
    constructor() {
        this.initDatabase();
    }

    // Initialiser la base de données
    initDatabase() {
        if (!localStorage.getItem('studyUsers')) {
            localStorage.setItem('studyUsers', JSON.stringify([]));
        }
        if (!localStorage.getItem('studyChallenges')) {
            localStorage.setItem('studyChallenges', JSON.stringify([]));
        }
        if (!localStorage.getItem('studySessions')) {
            localStorage.setItem('studySessions', JSON.stringify([]));
        }
        
        // Créer des utilisateurs de démonstration
        this.createDemoData();
    }

    // Créer des données de démonstration
    createDemoData() {
        const users = this.getUsers();
        if (users.length === 0) {
            const demoUsers = [
                {
                    id: 'demo1',
                    username: 'Alice',
                    email: 'alice@example.com',
                    password: 'demo123',
                    createdAt: new Date().toISOString(),
                    totalStudyTime: 25200000, // 7 heures en ms
                    weekStudyTime: 18000000   // 5 heures en ms
                },
                {
                    id: 'demo2',
                    username: 'Bob',
                    email: 'bob@example.com',
                    password: 'demo123',
                    createdAt: new Date().toISOString(),
                    totalStudyTime: 21600000, // 6 heures en ms
                    weekStudyTime: 14400000   // 4 heures en ms
                },
                {
                    id: 'demo3',
                    username: 'Charlie',
                    email: 'charlie@example.com',
                    password: 'demo123',
                    createdAt: new Date().toISOString(),
                    totalStudyTime: 32400000, // 9 heures en ms
                    weekStudyTime: 28800000   // 8 heures en ms
                }
            ];
            
            localStorage.setItem('studyUsers', JSON.stringify(demoUsers));
            
            // Créer un challenge de démonstration
            const demoChallenge = {
                id: 'challenge1',
                name: 'Challenge Mathématiques',
                creatorId: 'demo1',
                participants: ['demo1', 'demo2', 'demo3'],
                duration: 7,
                startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 2 jours
                endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // Dans 5 jours
                status: 'active',
                createdAt: new Date().toISOString()
            };
            
            localStorage.setItem('studyChallenges', JSON.stringify([demoChallenge]));
        }
    }

    // Utilisateurs
    getUsers() {
        return JSON.parse(localStorage.getItem('studyUsers') || '[]');
    }

    getUserById(id) {
        const users = this.getUsers();
        return users.find(user => user.id === id);
    }

    getUserByUsername(username) {
        const users = this.getUsers();
        return users.find(user => user.username === username);
    }

    createUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: 'user_' + Date.now(),
            ...userData,
            createdAt: new Date().toISOString(),
            totalStudyTime: 0,
            weekStudyTime: 0
        };
        users.push(newUser);
        localStorage.setItem('studyUsers', JSON.stringify(users));
        return newUser;
    }

    updateUser(userId, updates) {
        const users = this.getUsers();
        const index = users.findIndex(user => user.id === userId);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            localStorage.setItem('studyUsers', JSON.stringify(users));
            return users[index];
        }
        return null;
    }

    // Challenges
    getChallenges() {
        return JSON.parse(localStorage.getItem('studyChallenges') || '[]');
    }

    getChallengeById(id) {
        const challenges = this.getChallenges();
        return challenges.find(challenge => challenge.id === id);
    }

    getUserChallenges(userId) {
        const challenges = this.getChallenges();
        return challenges.filter(challenge => 
            challenge.participants.includes(userId) || challenge.creatorId === userId
        );
    }

    createChallenge(challengeData) {
        const challenges = this.getChallenges();
        const newChallenge = {
            id: 'challenge_' + Date.now(),
            ...challengeData,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        challenges.push(newChallenge);
        localStorage.setItem('studyChallenges', JSON.stringify(challenges));
        return newChallenge;
    }

    updateChallenge(challengeId, updates) {
        const challenges = this.getChallenges();
        const index = challenges.findIndex(challenge => challenge.id === challengeId);
        if (index !== -1) {
            challenges[index] = { ...challenges[index], ...updates };
            localStorage.setItem('studyChallenges', JSON.stringify(challenges));
            return challenges[index];
        }
        return null;
    }

    // Sessions d'étude
    getStudySessions() {
        return JSON.parse(localStorage.getItem('studySessions') || '[]');
    }

    getUserSessions(userId, startDate = null, endDate = null) {
        const sessions = this.getStudySessions();
        let userSessions = sessions.filter(session => session.userId === userId);
        
        if (startDate && endDate) {
            userSessions = userSessions.filter(session => {
                const sessionDate = new Date(session.startTime);
                return sessionDate >= startDate && sessionDate <= endDate;
            });
        }
        
        return userSessions;
    }

    createStudySession(sessionData) {
        const sessions = this.getStudySessions();
        const newSession = {
            id: 'session_' + Date.now(),
            ...sessionData,
            createdAt: new Date().toISOString()
        };
        sessions.push(newSession);
        localStorage.setItem('studySessions', JSON.stringify(sessions));
        return newSession;
    }

    updateStudySession(sessionId, updates) {
        const sessions = this.getStudySessions();
        const index = sessions.findIndex(session => session.id === sessionId);
        if (index !== -1) {
            sessions[index] = { ...sessions[index], ...updates };
            localStorage.setItem('studySessions', JSON.stringify(sessions));
            return sessions[index];
        }
        return null;
    }

    // Statistiques
    getUserDayStats(userId, date = new Date()) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        const sessions = this.getUserSessions(userId, startOfDay, endOfDay);
        return sessions.reduce((total, session) => total + (session.duration || 0), 0);
    }

    getUserWeekStats(userId, date = new Date()) {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        const sessions = this.getUserSessions(userId, startOfWeek, endOfWeek);
        return sessions.reduce((total, session) => total + (session.duration || 0), 0);
    }

    getChallengeLeaderboard(challengeId) {
        const challenge = this.getChallengeById(challengeId);
        if (!challenge) return [];
        
        const startDate = new Date(challenge.startDate);
        const endDate = new Date(challenge.endDate);
        
        return challenge.participants.map(userId => {
            const user = this.getUserById(userId);
            const studyTime = this.getUserSessions(userId, startDate, endDate)
                .reduce((total, session) => total + (session.duration || 0), 0);
            
            return {
                userId,
                username: user?.username || 'Utilisateur inconnu',
                studyTime
            };
        }).sort((a, b) => b.studyTime - a.studyTime);
    }

    getWeeklyLeaderboard() {
        const users = this.getUsers();
        const today = new Date();
        
        return users.map(user => ({
            userId: user.id,
            username: user.username,
            studyTime: this.getUserWeekStats(user.id, today)
        })).sort((a, b) => b.studyTime - a.studyTime);
    }

    // Utilitaires
    formatTime(milliseconds) {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
    }

    formatTimer(milliseconds) {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Instance globale de la base de données
const db = new StudyDatabase();