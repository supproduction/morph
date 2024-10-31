import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '@features/user/services/user.service';
import { User } from '@shared/interface/responses';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-user-list-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [UserService],
  templateUrl: './user-list-item.component.html',
  styleUrl: './user-list-item.component.scss'
})
export class UserListItemComponent {
  @Input() user!: User;
  @Input() disabled?: boolean;
  @Output() delete = new EventEmitter<string>();

  private clipboard = inject(Clipboard);
  private userService = inject(UserService);

  deleting$ = this.userService.getLoading();

  copy(text: string) {
    // We need this in case email will be truncated
    this.clipboard.copy(text);
  }

  deleteHandler(id: string) {
    this.userService.delete(id).pipe(
      take(1),
      finalize(() => this.delete.emit(id)),
    ).subscribe();
  }
}
