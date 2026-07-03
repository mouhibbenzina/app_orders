function renderHistory() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="header">
      <h1>Administrateur</h1>
      <button class="header-btn" onclick="handleLogout()">Déconnexion</button>
    </div>
    <div class="content history-page">
      <div class="search-row">
        <input type="text" id="hist-search" placeholder="Rechercher par nom, entreprise..." onkeydown="if(event.key==='Enter')loadHistory()">
        <button onclick="loadHistory()">OK</button>
      </div>
      <div class="filter-row" id="hist-filters">
        <button class="filter-btn active" onclick="filterHistory('all',this)">Tout</button>
        <button class="filter-btn" onclick="filterHistory('pending',this)">En attente</button>
        <button class="filter-btn" onclick="filterHistory('validated',this)">Validées</button>
        <button class="filter-btn" onclick="filterHistory('refused',this)">Refusées</button>
      </div>
      <div id="history-list"></div>
    </div>
  `;
  loadHistory();
}

let historyRequests = [];
let historyFilter = 'all';

async function loadHistory() {
  const search = document.getElementById('hist-search').value.trim();
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (historyFilter !== 'all') params.append('status', historyFilter);
    const qs = params.toString();
    historyRequests = await api('GET', '/requests' + (qs ? '?' + qs : ''));
    renderHistoryList();
  } catch (e) { toast(e.message); }
}

function filterHistory(filter, btn) {
  document.querySelectorAll('#hist-filters .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  historyFilter = filter;
  loadHistory();
}

function renderHistoryList() {
  const list = document.getElementById('history-list');
  if (!historyRequests.length) {
    list.innerHTML = '<div class="empty-state">Aucun résultat</div>';
    return;
  }
  list.innerHTML = historyRequests.map(r => `
    <div class="card" onclick="renderScreen('request-detail',{id:${r.id}})">
      <div class="card-header">
        <span class="card-title">${esc(r.supplierName)}</span>
        <span class="badge badge-${r.status}">${statusLabel(r.status)}</span>
      </div>
      <div class="card-sub">${esc(r.company)}</div>
      <div class="card-meta">Par ${esc(r.createdByName)} • ${r.createdAt ? r.createdAt.slice(0,10) : ''}</div>
    </div>
  `).join('');
}
