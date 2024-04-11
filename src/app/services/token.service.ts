import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  async getToken(): Promise<string | null> {
    return new Promise<string | null>((resolve) => {
      const token = localStorage.getItem('access_token');
      resolve(token);
    });
  }

  setLocalStorage(name: string, token: string): void {
    localStorage.setItem(name, token);
  }
  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  removeToken(): void {
    localStorage.removeItem('access_token');
  }
  limparLocalStorage() {
    localStorage.clear();
  }
}
