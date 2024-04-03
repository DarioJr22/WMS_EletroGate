import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IconeService } from '../shared/services/icons.service';
import { MenuService } from './app.menu.service';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];

    constructor(
        public layoutService: LayoutService,
        public menuService: MenuService,
        public router: Router,
        private iconService: IconeService
    ) {}

    ngOnInit() {
        this.model = [
            {
                label: 'Navegação',
                items: [
                    {
                        label: 'Início',
                        icon: this.iconService.getHouseIcon(),
                        routerLink: ['/'],
                    },
                ],
            },
            {
                label: 'Recursos Acadêmicos',
                items: [
                    {
                        label: 'Cursos',
                        icon: this.iconService.getChalkboardTeacherIcon(),
                        routerLink: ['/cursos'],
                    },
                ],
            },
        ];
    }
}
