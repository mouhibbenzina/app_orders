function renderLogin() {
  document.getElementById('app').innerHTML = `
    <div class="login-screen">
      <div class="login-card">
        <h1>Gestion Accès Fournisseurs</h1>
        <p>Gestion des accès fournisseurs</p>
        <div class="form-group">
          <label>Identifiant</label>
          <input type="text" id="login-username" placeholder="Nom d'utilisateur" autocomplete="username">
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <input type="password" id="login-password" placeholder="Mot de passe" autocomplete="current-password">
        </div>
        <button class="btn btn-primary" id="login-btn" onclick="handleLogin()">Se connecter</button>
      </div>
    </div>
  `;
  document.getElementById('login-username').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('login-password').focus();
  });
  document.getElementById('login-password').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLogin();
  });
}

async function handleLogin() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const btn = document.getElementById('login-btn');
  if (!username || !password) { toast('Veuillez remplir tous les champs'); return; }
  btn.disabled = true;
  btn.textContent = 'Connexion...';
  try {
    const res = await api('POST', '/auth/login', { username, password });
    setToken(res.token);
    currentUser = res.user;
    navigateHome();
  } catch (e) {
    toast(e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Se connecter';
  }
}
