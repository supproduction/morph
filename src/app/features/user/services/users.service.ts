import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@shared/interface/responses';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';

@Injectable()
export class UsersService {
  private http = inject(HttpClient);
  private load$ = new BehaviorSubject<void>(void 0);

  get(): Observable<User[]> {
    return this.load$.pipe(
      switchMap(() => this.http.get<User[]>('get-users')),
    )
  }

  reload(): Observable<null> {
    this.load$.next();

    return of(null);
  }
}
