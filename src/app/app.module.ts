import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AuthComponent } from './modules/auth/auth.component';
import { AppRoutingModule } from './app-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientModule } from '@angular/common/http';
import { SeparacaoComponent } from './modules/separacao/separacao.component';
import { PedidosService } from './services/pedidos.service';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SeparacaoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

  ],
  providers: [CookieService,PedidosService],
  bootstrap: [AppComponent]
})
export class AppModule { }
