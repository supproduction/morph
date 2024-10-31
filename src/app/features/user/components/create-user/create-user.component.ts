import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '@features/user/services/user.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { User } from '@shared/interface/responses';
import { map, merge, shareReplay, Subject, switchMap, tap } from 'rxjs';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, UserFormComponent, ModalComponent],
  templateUrl: './create-user.component.html',
})
export class CreateUserComponent implements AfterViewInit {
  @Input() loading?: boolean | null;

  @Output() add = new EventEmitter<void>();

  @ViewChild(UserFormComponent) formCmp!: UserFormComponent;
  @ViewChild(ModalComponent) modal!: ModalComponent;

  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);

  private triggerAdd$ = new Subject<void>();
  private add$ = this.triggerAdd$.pipe(
    switchMap(() => this.userService.create(this.formCmp.form.value as User)),
    shareReplay({ bufferSize: 1, refCount: true }),
  )

  adding$ = merge(
    this.triggerAdd$.pipe(map(() => true)),
    this.add$.pipe(map(() => false)),
  );

  isFormInvalid = true;

  ngAfterViewInit(): void {
    this.formCmp.isInvalidForm().pipe(
      tap(isFormInvalid => this.isFormInvalid = isFormInvalid),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe()
  }

  create() {
    this.triggerAdd$.next();
    this.reset();
    this.modal.close();
    this.add.emit();
  }

  reset() {
    this.formCmp.formDir.resetForm()
  }
}
