import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BehaviorSubject, map, merge, scan, shareReplay, Subject, switchMap, tap } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { CreateUserComponent } from '../create-user/create-user.component';
import { UserListItemComponent } from '../user-list-item/user-list-item.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UserListItemComponent, CreateUserComponent],
  templateUrl: './user-list.component.html',
})
export class UserListComponent {
  private usersService = inject(UsersService);

  private getList$ = new BehaviorSubject<void>(void 0);
  private disabledId$ = new Subject<string>();

  users$ = this.getList$.pipe(
    switchMap(() => this.usersService.get()),
    tap(() => this.disabledId$.next('')),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  initialLoading$ = merge(
    this.getList$.pipe(map(() => true)),
    this.users$.pipe(map(() => false))
  );
  disabledIds$ = merge(
    this.disabledId$.pipe(
      scan((acc, id) => id ? [...acc, id] : [], [] as string[]),
    ),
    this.users$.pipe(map(() => []))
  );

  deleteHandler(id: string) {
    this.disabledId$.next(id);
  }
}
