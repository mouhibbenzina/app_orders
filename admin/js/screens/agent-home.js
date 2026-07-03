function renderAgentHome() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="header">
      <h1>Agent d'accueil</h1>
      <button class="header-btn" onclick="handleLogout()">Déconnexion</button>
    </div>
    <div class="content">
      <div class="filter-row" id="agent-filters">
        <button class="filter-btn active" onclick="filterAgent('all',this)">Tout</button>
        <button class="filter-btn" onclick="filterAgent('pending',this)">En attente</button>
        <button class="filter-btn" onclick="filterAgent('validated',this)">Validées</button>
        <button class="filter-btn" onclick="filterAgent('refused',this)">Refusées</button>
      </div>
      <div id="agent-list"></div>
    </div>
    <button class="fab" onclick="renderScreen('new-request')">+</button>
  `;
  loadAgentRequests('all');
}

let agentRequests = [];

async function loadAgentRequests(filter) {
  try {
    agentRequests = await api('GET', '/requests');
    renderAgentList(filter || 'all');
  } catch (e) {
    toast(e.message);
  }
}

function filterAgent(filter, btn) {
  document.querySelectorAll('#agent-filters .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderAgentList(filter);
}

function renderAgentList(filter) {
  const list = document.getElementById('agent-list');
  const filtered = filter === 'all' ? agentRequests : agentRequests.filter(r => r.status === filter);
  if (!filtered.length) {
    list.innerHTML = '<div class="empty-state">Aucune demande</div>';
    return;
  }
  list.innerHTML = filtered.map(r => `
    <div class="card" onclick="renderScreen('request-detail',{id:${r.id}})">
      <div class="card-header">
        <span class="card-title">${esc(r.supplierName)}</span>
        <span class="badge badge-${r.status}">${statusLabel(r.status)}</span>
      </div>
      <div class="card-sub">${esc(r.company)}</div>
      <div class="card-meta">${r.startDate} → ${r.endDate}</div>
      <div class="card-text">${esc(r.reason)}</div>
    </div>
  `).join('');
}
