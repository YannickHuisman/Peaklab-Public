const SESSION_KEY = 'pl_access_token';

let _token: string | null = null;

if (typeof window !== 'undefined') {
  _token = sessionStorage.getItem(SESSION_KEY);
}

export const setAuthToken = (token: string | null) => {
  _token = token;
  if (typeof window !== 'undefined') {
    if (token) {
      sessionStorage.setItem(SESSION_KEY, token);
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }
};

export const getAuthToken = () => _token;
