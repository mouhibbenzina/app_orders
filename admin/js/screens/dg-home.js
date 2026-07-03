function renderDGHome() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="header">
      <h1>Directeur Général</h1>
      <button class="header-btn" onclick="handleLogout()">Déconnexion</button>
    </div>
    <div class="content">
      <div id="dg-list"></div>
    </div>
  `;
  loadDGRequests();
}

async function loadDGRequests() {
  try {
    const requests = await api('GET', '/requests?status=pending');
    const list = document.getElementById('dg-list');
    if (!requests.length) {
      list.innerHTML = '<div class="empty-state">Aucune demande en attente</div>';
      return;
    }
    list.innerHTML = '<div style="font-size:14px;font-weight:600;margin-bottom:8px;color:var(--text-secondary)">' + requests.length + ' demande(s) en attente</div>';
    list.innerHTML += requests.map(r => `
      <div class="card" onclick="renderScreen('request-detail',{id:${r.id}})">
        <div class="card-header">
          <span class="card-title">${esc(r.supplierName)}</span>
          <span class="badge badge-pending">En attente</span>
        </div>
        <div class="card-sub">${esc(r.company)}</div>
        <div class="card-text">${esc(r.reason)}</div>
        <div class="card-meta">Par ${esc(r.createdByName)} • ${r.createdAt ? r.createdAt.slice(0,10) : ''}</div>
      </div>
    `).join('');
  } catch (e) {
    toast(e.message);
  }
}
