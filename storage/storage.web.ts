const TOKEN_KEY = 'authToken';

export async function saveToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.error('Local storage is unavailable:', e);
  }
}

export async function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    console.error('Local storage is unavailable:', e);
    return null;
  }
}

export async function deleteToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error('Local storage is unavailable:', e);
  }
}