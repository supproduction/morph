import { HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { delay, Observable, of, throwError } from "rxjs";
import { User } from '../interface/responses';

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
  private users: Map<string, User> = new Map([
    [
      'mockUserA',
      {
        id: 'mockUserA',
        name: 'Mock User A',
        email: 'mock-user-a@mock.com',
      }
    ],
    [
      'mockUserB',
      {
        id: 'mockUserB',
        name: 'Mock User B',
        email: 'mock-user-b@mock.com',
        emails: [
          '1mock-user-b@mock.com',
          '2mock-user-b@mock.com',
        ]
      }
    ]
  ])

  private responses: Record<string, (req: HttpRequest<unknown>) => Observable<HttpResponse<unknown>>> = {
    'create-user': this.create,
    'get-user': this.get,
    'get-users': this.getList,
    'delete-user': this.delete,
    'edit-user': this.edit,
  }

  intercept(req: HttpRequest<unknown>): Observable<HttpResponse<unknown>> {
    const url = req.url.split('/').at(-1)!;

    return this.responses[url]?.apply(this, [req]);
  }

  private getList(req: HttpRequest<unknown>): Observable<HttpResponse<unknown>> {
    return this.response([...this.users.values()].reverse(), 1500);
  }

  private edit(req: HttpRequest<unknown>): Observable<HttpResponse<unknown>> {
    const user = req.body as User;

    this.users.set(user.id, user);

    return this.response(null, 500);
  }

  private delete(req: HttpRequest<unknown>): Observable<HttpResponse<unknown>> {
    const id = this.getId(req);

    this.users.delete(id);

    return this.response(null, 100);
  }

  private get(req: HttpRequest<unknown>): Observable<HttpResponse<unknown>> {
    const id = this.getId(req);

    if (!this.users.has(id)) {
      return throwError(() => new Error('User not found'));
    }

    return this.response(this.users.get(id), 400);
  }

  private create(req: HttpRequest<unknown>): Observable<HttpResponse<unknown>> {
    const id = new Date().getTime().toString();

    this.users.set(id, { id, ...req.body as Omit<User, 'id'> })

    return this.response(null, 1000);
  }

  private response(data: any, delayValue = 300): Observable<HttpResponse<unknown>> {
    return of(new HttpResponse({ body: data })).pipe(
      delay(delayValue),
    );
  }

  private getId(req: HttpRequest<unknown>): string {
    return req.params.get('id')!;
  }
}
