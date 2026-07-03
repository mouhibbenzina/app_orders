function renderNewRequest() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="header">
      <button class="header-btn" onclick="navigateHome()">← Retour</button>
      <h1>Nouvelle demande</h1>
      <div></div>
    </div>
    <div class="content">
      <div class="form-group">
        <label>Nom & Prénom fournisseur</label>
        <input type="text" id="nr-supplier" placeholder="Nom du fournisseur">
      </div>
      <div class="form-group">
        <label>Entreprise</label>
        <input type="text" id="nr-company" placeholder="Nom de l'entreprise">
      </div>
      <div class="form-group">
        <label>Motif</label>
        <textarea id="nr-reason" placeholder="Motif de la visite"></textarea>
      </div>
      <div class="form-group">
        <label>Date début</label>
        <input type="date" id="nr-start">
      </div>
      <div class="form-group">
        <label>Date fin</label>
        <input type="date" id="nr-end">
      </div>
      <button class="btn btn-primary" id="nr-btn" onclick="handleNewRequest()">Envoyer au DG</button>
    </div>
  `;
}

async function handleNewRequest() {
  const supplierName = document.getElementById('nr-supplier').value.trim();
  const company = document.getElementById('nr-company').value.trim();
  const reason = document.getElementById('nr-reason').value.trim();
  const startDate = document.getElementById('nr-start').value;
  const endDate = document.getElementById('nr-end').value;
  const btn = document.getElementById('nr-btn');
  if (!supplierName || !company || !reason || !startDate || !endDate) {
    toast('Tous les champs sont requis'); return;
  }
  btn.disabled = true; btn.textContent = 'Envoi...';
  try {
    await api('POST', '/requests', { supplierName, company, reason, startDate, endDate });
    toast('Demande envoyée au DG');
    navigateHome();
  } catch (e) {
    toast(e.message);
  } finally {
    btn.disabled = false; btn.textContent = 'Envoyer au DG';
  }
}
