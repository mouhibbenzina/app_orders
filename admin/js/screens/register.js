function renderRegister() {
  document.getElementById('app').className = '';
  document.getElementById('app').innerHTML = `
    <div class="register-screen">
      <div class="register-card">
        <h1>Créer un compte</h1>
        <p>Rejoignez App Orders</p>
        <div class="form-group">
          <label>Nom complet</label>
          <input type="text" id="reg-name" placeholder="Votre nom" autocomplete="name">
        </div>
        <div class="form-group">
          <label>Nom d'utilisateur</label>
          <input type="text" id="reg-username" placeholder="Au moins 3 caractères" autocomplete="username">
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <input type="password" id="reg-password" placeholder="Au moins 6 caractères" autocomplete="new-password">
        </div>
        <div class="form-group">
          <label>Confirmer mot de passe</label>
          <input type="password" id="reg-confirm" placeholder="Confirmez le mot de passe" autocomplete="new-password">
        </div>
        <button class="btn btn-primary" id="reg-btn" onclick="handleRegister()">Créer mon compte</button>
        <div class="register-footer">
          Déjà un compte ? <a onclick="renderScreen('login')">Se connecter</a>
        </div>
      </div>
    </div>
  `;
}

async function handleRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;
  const btn = document.getElementById('reg-btn');

  if (!name || !username || !password || !confirm) {
    toast('Tous les champs sont requis'); return;
  }
  if (username.length < 3) {
    toast('Nom d\'utilisateur trop court (min 3)'); return;
  }
  if (password.length < 6) {
    toast('Mot de passe trop court (min 6)'); return;
  }
  if (password !== confirm) {
    toast('Les mots de passe ne correspondent pas'); return;
  }

  btn.disabled = true;
  btn.textContent = 'Création...';
  try {
    const res = await api('POST', '/auth/register', { username, password, name });
    setToken(res.token);
    currentUser = res.user;
    toast('Compte créé avec succès !');
    navigateHome();
  } catch (e) {
    toast(e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Créer mon compte';
  }
}
