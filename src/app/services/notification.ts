export interface Notifications{
  id?:number;
  message: string;
  type: NotificationType;
  ttl?: number;
}
export enum NotificationType {
  SUCSESS = 'sucesso',
  ERROR = 'erro',
  WARN = 'warn'
}
