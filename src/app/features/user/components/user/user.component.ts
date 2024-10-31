import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '@features/user/services/user.service';
import { User } from '@shared/interface/responses';
import { map, Subject, switchMap, withLatestFrom } from 'rxjs';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, UserFormComponent, RouterModule],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  @ViewChild(UserFormComponent) formCmp!: UserFormComponent;

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);

  private triggerSave$ = new Subject<void>();

  user$ = this.activatedRoute.data.pipe(
    map(data => data['user'])
  );
  save$ = this.triggerSave$.pipe(
    withLatestFrom(this.user$),
    switchMap(([, user]) => this.userService.edit({
      ...(this.formCmp.form.value as Omit<User, 'id'>),
      id: user.id,
    })),
  )

  ngOnInit(): void {
    this.save$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  save() {
    this.triggerSave$.next();
    this.router.navigate(['/']);
  }
}
