import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EPerfil } from '../enum/perfil';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient, private router: Router) {}

    login(user?: string, password?: string) {}

    getIsAdmin() {
        if (localStorage.getItem('PERFIL') == EPerfil.Admin) {
            return true;
        } else if (localStorage.getItem('PERFIL') == EPerfil.Aluno) {
            return false;
        } else {
            console.log('ERRO: Ausência de Perfil');

            return this.router.navigate['/institucional'];
        }
    }

    limparStorage() {
        localStorage.clear();
    }
}
