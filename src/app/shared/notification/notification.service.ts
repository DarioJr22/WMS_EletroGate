import { Inject, Injectable, Optional } from "@angular/core";
import { Notifications } from "../../services/notification";

@Injectable({providedIn:'root'})

export class NotificationService{
 //Array Notificações
 notifications:Array<Notifications> = []


 constructor(@Inject('ttlDefault') @Optional() private ttlDefault:number){
   this.ttlDefault = ttlDefault || 3000
 }

 notify(notification:Notifications){
   notification.id = Math.random();
   if(!notification.ttl){
     notification.ttl = this.ttlDefault
   }
   //Insere a notificação
   this.notifications.push(notification);

   //Exclui a notificação
   setTimeout(() => {
     this.notifications.shift()
   },this.ttlDefault
 );
 }

 closeNotify(id:number){
   this.notifications.splice(this.notifications.findIndex( x => x.id == id),1)
 }
}
