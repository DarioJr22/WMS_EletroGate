import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Config } from 'src/app/services/config';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(
    private userService:UserService,
    private router:Router,
    private actRout:ActivatedRoute,
    private cookie:CookieService){}

  ngOnInit(): void {
    //Caso o usuário não tenha um token de acesso registrado, segue o fluxo de autenticação da aplicação
    !this.cookie.get('access_token') || this.cookie.get('access_token') === null ?
    //Aqui o usuário inicia o fluxo de autenticação,
    this.userService.getAuthCode() :
    //Se o bonito já tiver autenticado, então ele segue pra a tela onde ele escolherá oque ele quer da vida dele: Separação / Conferência
    this.router.navigate(['/separacao'])


  }

}
