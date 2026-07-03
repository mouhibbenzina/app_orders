function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function statusLabel(s) {
  return s === 'pending' ? 'En attente' : s === 'validated' ? 'Validée' : 'Refusée';
}

const routes = {
  landing: renderLanding,
  login: renderLogin,
  register: renderRegister,
  'agent-home': renderAgentHome,
  'new-request': renderNewRequest,
  'dg-home': renderDGHome,
  'guard-home': renderGuardHome,
  'request-detail': renderRequestDetail,
  history: renderHistory,
};

function renderScreen(name, params) {
  if (!routes[name]) return;
  routes[name](params);
}

function navigateHome() {
  if (!currentUser) { renderScreen('landing'); return; }
  const roleMap = { agent: 'agent-home', dg: 'dg-home', garde: 'guard-home', admin: 'history' };
  renderScreen(roleMap[currentUser.role] || 'agent-home');
}

function handleLogout() {
  if (!confirm('Déconnexion ?')) return;
  currentUser = null;
  setToken(null);
  renderScreen('landing');
  toast('Déconnecté');
}

(async function init() {
  const ok = await checkAuth();
  if (ok) navigateHome();
  else renderScreen('landing');
})();
