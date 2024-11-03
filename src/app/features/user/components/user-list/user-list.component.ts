import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BehaviorSubject, map, merge, shareReplay, switchMap } from 'rxjs';
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

  users$ = this.getList$.pipe(
    switchMap(() => this.usersService.get()),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  initialLoading$ = merge(
    this.getList$.pipe(map(() => true)),
    this.users$.pipe(map(() => false))
  );
}
