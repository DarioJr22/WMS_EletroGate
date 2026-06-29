import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AuthComponent } from './modules/auth/auth.component';
import { AppRoutingModule } from './app-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SeparacaoComponent } from './modules/pedidos-separacao/separacao.component';
import { PedidosService } from './services/pedidos.service';
import { SharedModule } from './shared/shared.module';
import { OpcoesComponent } from './modules/opcoes/opcoes.component';
import { ConferenciaComponent } from './modules/pedidos-conferencia/conferencia.component';
import { LogisticasService } from './services/logisitica.service';
import { RateLimitInterceptor } from './services/rate.interceptor';
import { AuthInterceptor } from './services/auth.interceptor';
import { PedidosComponent } from './modules/pedidos/pedidos.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SeparacaoComponent,
    OpcoesComponent,
    ConferenciaComponent,
    PedidosComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [CookieService, PedidosService, LogisticasService,
   { provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor, multi:true},
   { provide:HTTP_INTERCEPTORS,useClass:RateLimitInterceptor, multi:true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
