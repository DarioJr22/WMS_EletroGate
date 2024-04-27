import { Component } from '@angular/core';
import { NotificationService } from './notification.service';

@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  notifications:any[] =[]

  constructor(private notifyService:NotificationService){
    this.notifications = notifyService.notifications;

  }
  close(n:number){
     //Fecha a notificação
     this.notifyService.closeNotify(n)
    }
}
