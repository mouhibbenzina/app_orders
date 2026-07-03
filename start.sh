#!/bin/bash
echo "=== App Orders ==="
echo ""
echo "Démarrage du serveur backend + administration web..."
echo ""
echo "Accès web : http://localhost:3000"
echo ""
echo "Comptes de test (mot de passe: password) :"
echo "  - agent1  (Agent d'accueil)"
echo "  - dg1     (Directeur Général)"
echo "  - garde1  (Équipe de garde)"
echo "  - admin1  (Administrateur)"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter"
echo ""

cd "$(dirname "$0")/backend"
node src/index.js
