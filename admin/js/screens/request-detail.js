function renderRequestDetail(params) {
  const id = params.id;
  const req = agentRequests.find(r => r.id == id);
  if (!req) { toast('Demande introuvable'); navigateHome(); return; }

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="header">
      <button class="header-btn" onclick="navigateHome()">← Retour</button>
      <h1>Détail demande</h1>
      <div></div>
    </div>
    <div class="content">
      <div class="detail-card">
        <div class="detail-label">Fournisseur</div>
        <div class="detail-value">${esc(req.supplierName)}</div>
        <div class="detail-label">Entreprise</div>
        <div class="detail-value">${esc(req.company)}</div>
        <div class="detail-label">Motif</div>
        <div class="detail-value">${esc(req.reason)}</div>
        <div class="detail-label">Période</div>
        <div class="detail-value">${req.startDate} → ${req.endDate}</div>
        <div class="detail-label">Statut</div>
        <div class="detail-value" style="color:${req.status === 'validated' ? 'var(--success)' : req.status === 'refused' ? 'var(--danger)' : 'var(--warning)'};font-weight:600">
          ${statusLabel(req.status)}
        </div>
        ${req.refusalReason ? `
          <div class="detail-label">Motif du refus</div>
          <div class="detail-value">${esc(req.refusalReason)}</div>
        ` : ''}
        <div class="detail-label">Créée par</div>
        <div class="detail-value">${esc(req.createdByName)}</div>
      </div>
      ${currentUser.role === 'dg' && req.status === 'pending' ? `
        <div class="detail-actions">
          <button class="btn btn-success" onclick="handleValidate(${req.id})" style="flex:1">Valider</button>
          <button class="btn btn-danger" onclick="handleRefusePrompt(${req.id})" style="flex:1">Refuser</button>
        </div>
      ` : ''}
    </div>
  `;
}

async function handleValidate(id) {
  try {
    await api('PATCH', '/requests/' + id + '/validate');
    toast('Demande validée');
    navigateHome();
  } catch (e) { toast(e.message); }
}

function handleRefusePrompt(id) {
  const reason = prompt('Motif du refus :');
  if (reason === null) return;
  handleRefuse(id, reason);
}

async function handleRefuse(id, reason) {
  try {
    await api('PATCH', '/requests/' + id + '/refuse', { reason });
    toast('Demande refusée');
    navigateHome();
  } catch (e) { toast(e.message); }
}
