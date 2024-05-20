import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'button-filter',
  templateUrl: './button-filter.component.html',
  styleUrls: ['./button-filter.component.css']
})
export class ButtonFilterComponent {

  @Input() loading:boolean = false
  @Input() buttonData: any = [
    {
      img:'https://www.bling.com.br/images/integracoes-logisticas/icons/jadlog.svg',
      tooltip:'Jadlog',
      value: 'Jadlog'
    },
    {
      img:'https://www.bling.com.br/images/integracoes-logisticas/icons/correios.svg',
      tooltip:'Correios',
      value: 'SIGEP'
    },
    {
      img:'https://www.bling.com.br/images/integracoes-logisticas/icons/customlogistic.svg',
      tooltip:'Motoboy',
      value: 'Motoboy'
    },
  ]

  @Output() buttonClick = new EventEmitter<any>();
  @Output() clean = new EventEmitter<any>();

  onClick(value: any) {
    this.buttonClick.emit(value);
  }

  limpar(){
    this.clean.emit(true);
  }



}
