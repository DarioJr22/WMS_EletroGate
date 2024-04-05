import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: 'auth',
                    loadChildren: () =>
                        import('./demo/components/auth/auth.module').then(
                            (m) => m.AuthModule
                        ),
                },
                {
                    path: '',
                    loadChildren: () =>
                        import('./views/inicio/inicio.module').then(
                            (m) => m.InicioModule
                        ),
                },
                {
                    path: 'auth',
                    component: AppLayoutComponent,
                    canActivate: [],
                    children: [
                        {
                            path: '',
                            loadChildren: () =>
                                import('./views/inicio/inicio.module').then(
                                    (m) => m.InicioModule
                                ),
                        },
                        {
                            path: 'dashboard',
                            canActivate: [],
                            loadChildren: () =>
                                import(
                                    './demo/components/dashboard/dashboard.module'
                                ).then((m) => m.DashboardModule),
                        },

                        {
                            path: 'pages',
                            canActivate: [],
                            loadChildren: () =>
                                import(
                                    './demo/components/pages/pages.module'
                                ).then((m) => m.PagesModule),
                        },
                    ],
                },

                // { path: 'notfound', component: NotfoundComponent },
                // { path: '**', redirectTo: '/notfound' },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload',
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
