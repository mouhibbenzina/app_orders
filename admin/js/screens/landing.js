function renderLanding() {
  const app = document.getElementById('app');
  app.className = 'landing-mode';
  app.innerHTML = `
    <div class="landing">
      <nav class="landing-nav">
        <div class="landing-logo">App Orders</div>
        <div class="landing-nav-links">
          <a onclick="renderScreen('login')">Connexion</a>
          <a class="landing-btn-primary" onclick="renderScreen('register')">S'inscrire</a>
        </div>
      </nav>

      <section class="landing-hero">
        <h1>Gérez vos <span>accès fournisseurs</span> en un clic</h1>
        <p>Application mobile et web de gestion des autorisations d'accès. Saisie, validation et consultation en temps réel pour une sécurité optimale.</p>
        <div class="landing-hero-btns">
          <a class="landing-hero-btn-primary" onclick="renderScreen('register')">Commencer gratuitement</a>
          <a class="landing-hero-btn-secondary" onclick="renderScreen('login')">J'ai déjà un compte</a>
        </div>
      </section>

      <section class="landing-section" id="features">
        <h2 class="landing-section-title">Tout ce dont vous avez besoin</h2>
        <p class="landing-section-sub">Une solution complète pour gérer les accès de A à Z</p>
        <div class="landing-features">
          <div class="landing-feature-card">
            <div class="landing-feature-icon" style="background:#e8f5e9;color:#2e7d32;">📋</div>
            <h3>Saisie des demandes</h3>
            <p>L'agent d'accueil crée les demandes d'accès en quelques secondes depuis l'application mobile.</p>
          </div>
          <div class="landing-feature-card">
            <div class="landing-feature-icon" style="background:#e3f2fd;color:#1565c0;">✅</div>
            <h3>Validation DG</h3>
            <p>Le Directeur Général valide ou refuse les demandes avec un motif, en temps réel.</p>
          </div>
          <div class="landing-feature-card">
            <div class="landing-feature-icon" style="background:#fff3e0;color:#e65100;">👁️</div>
            <h3>Consultation garde</h3>
            <p>L'équipe de garde consulte les accès autorisés du jour avec rafraîchissement automatique.</p>
          </div>
          <div class="landing-feature-card">
            <div class="landing-feature-icon" style="background:#fce4ec;color:#c62828;">🔔</div>
            <h3>Notifications push</h3>
            <p>Alertes en temps réel pour chaque validation, refus ou rappel important.</p>
          </div>
          <div class="landing-feature-card">
            <div class="landing-feature-icon" style="background:#f3e5f5;color:#6a1b9a;">📊</div>
            <h3>Historique complet</h3>
            <p>Recherchez et filtrez par nom, date, entreprise ou statut dans tout l'historique.</p>
          </div>
          <div class="landing-feature-card">
            <div class="landing-feature-icon" style="background:#e0f2f1;color:#00695c;">📱</div>
            <h3>Application mobile</h3>
            <p>Accessible depuis n'importe quel appareil, avec installation PWA sur votre écran d'accueil.</p>
          </div>
        </div>
      </section>

      <section class="landing-section" style="background:#f8fafc;border-radius:20px;" id="how-it-works">
        <h2 class="landing-section-title">Comment ça marche ?</h2>
        <p class="landing-section-sub">Trois étapes simples pour sécuriser vos accès</p>
        <div class="landing-steps">
          <div class="landing-step">
            <div class="landing-step-num">1</div>
            <h3>L'agent saisit la demande</h3>
            <p>Nom du fournisseur, entreprise, motif et période. Envoyé au DG en un clic.</p>
          </div>
          <div class="landing-step">
            <div class="landing-step-num">2</div>
            <h3>Le DG valide ou refuse</h3>
            <p>Consultation depuis son tableau de bord. Validation ou refus avec motif optionnel.</p>
          </div>
          <div class="landing-step">
            <div class="landing-step-num">3</div>
            <h3>La garde consulte</h3>
            <p>Liste des accès autorisés du jour, mise à jour en temps réel pour un contrôle fluide.</p>
          </div>
        </div>
      </section>

      <section class="landing-section" id="roles">
        <h2 class="landing-section-title">4 rôles, une seule plateforme</h2>
        <p class="landing-section-sub">Chaque acteur a son interface dédiée</p>
        <div class="landing-roles">
          <div class="landing-role-card" style="background:#e3f2fd;">
            <h3>🧑‍💼 Agent d'accueil</h3>
            <ul><li>Créer des demandes d'accès</li><li>Suivre le statut en temps réel</li><li>Filtrer par date et statut</li></ul>
          </div>
          <div class="landing-role-card" style="background:#e8f5e9;">
            <h3>👔 Directeur Général</h3>
            <ul><li>Voir les demandes en attente</li><li>Valider ou refuser</li><li>Déléguer à un remplaçant</li></ul>
          </div>
          <div class="landing-role-card" style="background:#fff3e0;">
            <h3>🛡️ Équipe de garde</h3>
            <ul><li>Consulter les accès du jour</li><li>Rafraîchissement automatique</li><li>Notifications en temps réel</li></ul>
          </div>
          <div class="landing-role-card" style="background:#f3e5f5;">
            <h3>⚙️ Administrateur</h3>
            <ul><li>Gérer les utilisateurs</li><li>Historique complet</li><li>Recherche avancée</li></ul>
          </div>
        </div>
      </section>

      <section class="landing-section">
        <div class="landing-cta">
          <h2>Prêt à simplifier vos accès ?</h2>
          <p>Rejoignez-nous et gérez vos autorisations d'accès en toute sérénité.</p>
          <a onclick="renderScreen('register')">Créer un compte gratuit</a>
        </div>
      </section>

      <footer class="landing-footer">
        App Orders &copy; ${new Date().getFullYear()} — Gestion des Accès Fournisseurs
      </footer>
    </div>
  `;
}
