import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, Subject, from, of, throwError, timer } from 'rxjs';
import { delay, concatMap, tap, catchError, switchMap, takeUntil, filter, exhaustMap } from 'rxjs/operators';

@Injectable()
export class RateLimitInterceptor implements HttpInterceptor {
  private requestQueue: Array<{ req: HttpRequest<any>, next: HttpHandler, observer: any }> = [];
  private processRequests = new Subject<void>();

  constructor() {
    // Inicia o processo de verificação da fila a cada segundo
    timer(0, 1000).pipe(
      exhaustMap(() => {
        if (this.requestQueue.length > 0) {
          return of(this.processBatch());
        } else {
          return of(null);
        }
      })
    ).subscribe();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return new Observable(observer => {
      // Adiciona a requisição e seus handlers ao array da fila
      this.requestQueue.unshift({ req, next, observer });

      // Retorna uma função de limpeza que é chamada quando o unsubscribe é invocado
      return () => {
        const index = this.requestQueue.findIndex(item => item.req === req);
        console.log(this.requestQueue.length);

        if (index !== -1) {
          this.requestQueue.splice(index, 1);
        }
      };
    });
  }

  private processBatch() {
    // Retira até três itens da fila
    //Vai continuar processando os primeiros
    const itemsToProcess = this.requestQueue.splice(0, 2);
    itemsToProcess.forEach(item => {
      item.next.handle(item.req).subscribe({
        next: response => item.observer.next(response),
        error: error => item.observer.error(error),
        complete: () => item.observer.complete()
      });
    });
  }


}
