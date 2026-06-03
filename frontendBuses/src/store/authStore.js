import { create } from 'zustand';

const useAuthStore = create((set) => ({
  usuario: JSON.parse(localStorage.getItem('usuario')) || null,
  token: localStorage.getItem('token') || null,
  setAuth: (user, token) => {
    localStorage.setItem('usuario', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ usuario: user, token });
  },
  logout: () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    set({ usuario: null, token: null });
  },
}));

export { useAuthStore };