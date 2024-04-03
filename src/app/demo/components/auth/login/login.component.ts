import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { UserService } from './user.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [],
})
export class LoginComponent {
    valCheck: string[] = ['remember'];

    password!: string;

    constructor(
        public layoutService: LayoutService,
        private userService: UserService,
        private router: Router,
        private actRout: ActivatedRoute,
        private cookie: CookieService
    ) {}

    ngOnInit(): void {
        //Caso o usuário não tenha um token de acesso registrado, segue o fluxo de autenticação da aplicação
        !this.cookie.get('access_token') ||
        this.cookie.get('access_token') === null
            ? //Aqui o usuário inicia o fluxo de autenticação,
              this.userService.getAuthCode()
            : //Se o bonito já tiver autenticado, então ele segue pra a tela onde ele escolherá oque ele quer da vida dele: Separação / Conferência
              this.router.navigate(['/aoba']);
    }
}
