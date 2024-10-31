import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { UserService } from '@features/user/services/user.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { User } from '@shared/interface/responses';
import { take } from 'rxjs';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, UserFormComponent, ModalComponent],
  templateUrl: './create-user.component.html',
})
export class CreateUserComponent {
  @ViewChild(UserFormComponent) formCmp!: UserFormComponent;
  @ViewChild(ModalComponent) modal!: ModalComponent;

  private userService = inject(UserService);

  create() {
    this.userService.create(this.formCmp.form.value as User).pipe(
      take(1),
    ).subscribe();
    this.formCmp.formDir.resetForm();
    this.modal.close();
  }
}
