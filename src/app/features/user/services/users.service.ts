import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@shared/interface/responses';
import { BehaviorSubject, filter, map, merge, Observable, share, switchMap } from 'rxjs';

@Injectable()
export class UsersService {
  private http = inject(HttpClient);

  private load$ = new BehaviorSubject<void>(void 0);
  private users$ = this.load$.pipe(
    switchMap(() => this.http.get<User[]>('get-users')),
    share(),
  )
  private loading$ = merge(
    this.load$.pipe(map(() => true)),
    this.users$.pipe(map(() => false)),
  )

  get(): Observable<any> {
    return this.users$;
  }

  reload(): Observable<null> {
    this.load$.next();

    return this.loading$.pipe(
      filter((loading) => !loading),
      map(() => null)
    )
  }
}
