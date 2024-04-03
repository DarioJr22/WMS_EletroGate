import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent {
    listaCursos = [
        {
            titulo: 'Curso de Desenvolvimento Web',
            escolaridade: 'Médio',
            valor: 500.0,
            desconto: 20,
            horaFinal: new Date('2024-03-25T20:00:50'),
        },
        {
            titulo: 'Curso de Machine Learning',
            escolaridade: '',
            valor: 800.0,
            desconto: 18,
            horaFinal: new Date('2024-01-07T20:00:50'),
        },
        {
            titulo: 'Curso de Marketing Digital',
            escolaridade: 'Médio',
            valor: 600.0,
            desconto: 17,
            horaFinal: new Date('2024-01-08T20:00:50'),
        },
    ];
    visible: boolean = false;

    constructor(public layoutService: LayoutService, public router: Router) {}

    entrar() {
        this.router.navigate(['/']);
    }

    abrirModal() {
        this.visible = true;
    }
}
