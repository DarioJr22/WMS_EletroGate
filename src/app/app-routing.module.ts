import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './modules/auth/auth.component';
import { SeparacaoComponent } from './modules/pedidos-separacao/separacao.component';
import { OpcoesComponent } from './modules/opcoes/opcoes.component';
import { ConferenciaComponent } from './modules/pedidos-conferencia/conferencia.component';
import { PedidosComponent } from './modules/pedidos/pedidos.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
  },
  {
    path: 'opcoes',
    component: OpcoesComponent,
  },
  {
    path: 'separacao',
    component: SeparacaoComponent,
  },
  {
    path: 'conferencia',
    component: ConferenciaComponent,
  },
  {
    path: 'pedidos',
    component: PedidosComponent,
  },
  {

      path: '**',
      component: OpcoesComponent

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
