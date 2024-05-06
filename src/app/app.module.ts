import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AuthComponent } from './modules/auth/auth.component';
import { AppRoutingModule } from './app-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientModule } from '@angular/common/http';
import { SeparacaoComponent } from './modules/separacao/separacao.component';
import { PedidosService } from './services/pedidos.service';
import { SharedModule } from './shared/shared.module';
import { OpcoesComponent } from './modules/opcoes/opcoes.component';
import { ConferenciaComponent } from './modules/conferencia/conferencia.component';
import { LogisticasService } from './services/logisitica.service';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SeparacaoComponent,
    OpcoesComponent,
    ConferenciaComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [CookieService, PedidosService, LogisticasService],
  bootstrap: [AppComponent],
})
export class AppModule {}
