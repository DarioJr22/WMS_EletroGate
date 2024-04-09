import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './modules/auth/auth.component';
import { SeparacaoComponent } from './modules/separacao/separacao.component';
import { OpcoesComponent } from './modules/opcoes/opcoes.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
