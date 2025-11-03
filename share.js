// Fonctions de partage pour StudyChallenge

// Obtenir l'URL actuelle
function getCurrentUrl() {
    return window.location.href;
}

// Copier l'URL dans le presse-papiers
function copyUrl() {
    const url = getCurrentUrl();
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(() => {
            showToast('✅ Lien copié dans le presse-papiers !', 'success');
        });
    } else {
        // Fallback pour navigateurs plus anciens
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('✅ Lien copié !', 'success');
    }
}

// Partager via WhatsApp
function shareWhatsApp() {
    const url = getCurrentUrl();
    const message = `🎓 Rejoins-moi sur StudyChallenge ! On peut se défier pour étudier ensemble et voir qui étudie le plus ! 💪\n\n🔗 ${url}\n\n💡 Utilise un compte démo : Alice, Bob ou Charlie (mot de passe: demo123)`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Partager via email
function shareEmail() {
    const url = getCurrentUrl();
    const subject = 'Rejoins-moi sur StudyChallenge ! 🎓';
    const body = `Salut !

Je viens de découvrir StudyChallenge, une super app pour se défier entre amis et booster notre motivation d'études ! 💪

🎯 On peut :
- Chronométrer nos sessions d'étude
- Créer des challenges entre nous
- Voir qui étudie le plus dans des classements
- Se motiver mutuellement !

🚀 Pour tester rapidement :
${url}

💡 Utilise un compte démo pour commencer :
- Nom : Alice, Bob ou Charlie
- Mot de passe : demo123

Ou crée ton propre compte gratuitement !

À bientôt sur StudyChallenge ! 📚✨`;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
}

// Connexion rapide pour les comptes démo
function quickLogin(username) {
    document.getElementById('loginUsername').value = username;
    document.getElementById('loginPassword').value = 'demo123';
    
    // Déclencher la connexion
    const loginEvent = new Event('submit', { cancelable: true });
    document.querySelector('#loginForm form').dispatchEvent(loginEvent);
}

// Afficher/masquer les instructions rapides
function hideQuickStart() {
    document.getElementById('quickStart').style.display = 'none';
    localStorage.setItem('hideQuickStart', 'true');
}

// Vérifier si on doit afficher les instructions
function checkQuickStart() {
    const shouldHide = localStorage.getItem('hideQuickStart');
    if (shouldHide === 'true') {
        document.getElementById('quickStart').style.display = 'none';
    }
}

// Modal de partage
function showShareModal() {
    document.getElementById('shareModal').classList.add('active');
}

function closeShareModal() {
    document.getElementById('shareModal').classList.remove('active');
}

// Télécharger les fichiers pour partage offline
function downloadFiles() {
    showToast('🚀 Utilisez GitHub Pages ou Netlify pour un partage optimal !', 'info');
    
    // Ouvrir les liens utiles
    setTimeout(() => {
        window.open('https://pages.github.com/', '_blank');
    }, 2000);
}

// Générer QR Code
function generateQRCode() {
    const qrContainer = document.getElementById('qrcode');
    if (qrContainer && window.QRious) {
        qrContainer.innerHTML = '';
        const qr = new QRious({
            element: qrContainer,
            size: 200,
            value: getCurrentUrl(),
            background: 'white',
            foreground: '#6366f1'
        });
    }
}

// Système de notifications toast
function showToast(message, type = 'info') {
    // Supprimer les anciens toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Styles du toast
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        font-weight: 500;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Supprimer après 4 secondes
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Ajouter les animations CSS pour les toasts
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(toastStyles);

// Détection du partage natif (mobile)
function canUseNativeShare() {
    return navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Partage natif mobile
function nativeShare() {
    if (canUseNativeShare()) {
        navigator.share({
            title: 'StudyChallenge - Défis d\'études entre amis',
            text: 'Rejoins-moi sur StudyChallenge pour étudier ensemble !',
            url: getCurrentUrl()
        }).catch(err => console.log('Erreur partage:', err));
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier les instructions rapides
    checkQuickStart();
    
    // Générer le QR code si la librairie est chargée
    if (window.QRious) {
        generateQRCode();
    }
    
    // Ajouter le partage natif sur mobile si disponible
    if (canUseNativeShare()) {
        const shareButton = document.querySelector('.btn-share');
        if (shareButton) {
            shareButton.addEventListener('click', nativeShare);
        }
    }
});

// Fermer les modals en cliquant en dehors
window.addEventListener('click', (event) => {
    const shareModal = document.getElementById('shareModal');
    if (event.target === shareModal) {
        closeShareModal();
    }
});

// Instructions de déploiement
function showDeploymentGuide() {
    const guide = `
🚀 GUIDE DE DÉPLOIEMENT RAPIDE

📁 Option 1 - GitHub Pages (GRATUIT)
1. Créer compte sur github.com
2. Nouveau repository public
3. Upload tous vos fichiers
4. Settings → Pages → Deploy from branch
5. Votre site: https://username.github.io/repo-name

🌐 Option 2 - Netlify (GRATUIT)
1. Aller sur netlify.com  
2. Glisser votre dossier complet
3. URL générée instantanément !

💻 Option 3 - Local (même WiFi)
1. python -m http.server 8000
2. Partager: http://VOTRE-IP:8000

📱 Vos amis pourront :
✅ Se connecter avec Alice/Bob/Charlie (demo123)
✅ Créer leur propre compte
✅ Lancer des challenges ensemble !
    `;
    
    alert(guide);
}

// Export des fonctions globales
window.copyUrl = copyUrl;
window.shareWhatsApp = shareWhatsApp;
window.shareEmail = shareEmail;
window.quickLogin = quickLogin;
window.hideQuickStart = hideQuickStart;
window.showShareModal = showShareModal;
window.closeShareModal = closeShareModal;
window.downloadFiles = downloadFiles;
window.showDeploymentGuide = showDeploymentGuide;