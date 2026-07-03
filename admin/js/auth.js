let currentUser = null;

function isAuthenticated() {
  return !!currentUser;
}

function requireAuth() {
  if (!isAuthenticated()) {
    currentUser = null;
    setToken(null);
    renderScreen('login');
    return false;
  }
  return true;
}

async function checkAuth() {
  if (!token) return false;
  try {
    currentUser = await api('GET', '/auth/me');
    return true;
  } catch {
    currentUser = null;
    setToken(null);
    return false;
  }
}
