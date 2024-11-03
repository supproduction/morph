import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@shared/interface/responses';
import { finalize, Observable, shareReplay, Subject, switchMap } from 'rxjs';
import { UsersService } from './users.service';

@Injectable()
export class UserService {
  private http = inject(HttpClient);
  private users = inject(UsersService);
  private loading$ = new Subject<boolean>();

  delete(id: string): Observable<null> {
    const params = new HttpParams().set('id', id);
    this.loading$.next(true);

    return this.http.delete<null>('delete-user', { params }).pipe(
      switchMap(() => this.users.reload()),
      finalize(() => this.loading$.next(false))
    )
  }

  edit(user: User): Observable<null> {
    this.loading$.next(true);

    return this.http.put<null>('edit-user', this.prepareData(user)).pipe(
      switchMap(() => this.users.reload()),
      finalize(() => this.loading$.next(false))
    )
  }

  create(user: Omit<User, 'id'>): Observable<any> {
    this.loading$.next(true);

    return this.http.put<null>('create-user', this.prepareData(user)).pipe(
      switchMap(() => this.users.reload()),
      finalize(() => this.loading$.next(false))
    )
  }

  get(id: string): Observable<User> {
    const params = new HttpParams().set('id', id);
    this.loading$.next(true);

    return this.http.get<User>('get-user', { params }).pipe(
      finalize(() => this.loading$.next(false))
    )
  }

  getLoading(): Observable<boolean> {
    return this.loading$.asObservable().pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  private prepareData(data: Partial<User>): Partial<User> {
    data = { ...data };

    if (data.emails?.length) {
      data.emails = data.emails.filter(Boolean);
    }

    return data;
  }
}
