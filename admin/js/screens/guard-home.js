function renderGuardHome() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="header">
      <h1>Équipe de garde</h1>
      <button class="header-btn" onclick="handleLogout()">Déconnexion</button>
    </div>
    <div class="content">
      <button class="refresh-btn" onclick="loadGuardRequests()">🔄 Rafraîchir</button>
      <div id="guard-list"></div>
    </div>
  `;
  loadGuardRequests();
}

async function loadGuardRequests() {
  try {
    const requests = await api('GET', '/requests?status=validated');
    const list = document.getElementById('guard-list');
    if (!requests.length) {
      list.innerHTML = '<div class="empty-state">Aucun accès autorisé aujourd\'hui</div>';
      return;
    }
    list.innerHTML = requests.map(r => `
      <div class="card guard-card">
        <div class="card-header">
          <span class="card-title">${esc(r.supplierName)}</span>
        </div>
        <div class="card-sub">${esc(r.company)}</div>
        <div class="card-text">${esc(r.reason)}</div>
        <div class="card-meta">${r.startDate} → ${r.endDate}</div>
      </div>
    `).join('');
  } catch (e) {
    toast(e.message);
  }
}
