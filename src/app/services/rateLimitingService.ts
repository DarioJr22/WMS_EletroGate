import { Injectable } from '@angular/core';
import { Observable, Subject, concat, of } from 'rxjs';
import { concatMap, delay, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RateLimiterService {
  private requestQueue = new Subject<Observable<any>>();
  private isProcessing = false;

  constructor() {
    this.processQueue();
  }

  enqueueRequest<T>(request: Observable<T>): Observable<T> {
    const processableRequest = new Subject<T>();
    this.requestQueue.next(request.pipe(take(1), tap(response => processableRequest.next(response), error => processableRequest.error(error), () => processableRequest.complete())));
    return processableRequest.asObservable();
  }

  private processQueue() {
    this.requestQueue.pipe(
      concatMap(request =>
        of(null).pipe(delay(1000))

      )
    ).subscribe({
      next: (data) => {
        console.log(data);

        if (!this.isProcessing) {
          this.isProcessing = true;
          setTimeout(() => {
            this.isProcessing = false;
          }, 1000);  // Processa um lote a cada segundo
        }
      },
      error: (err) => console.error('Error processing request queue:', err)
    });
  }
}
