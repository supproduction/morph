import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '@shared/interface/responses';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnChanges {
  @Input() user?: User | null;

  private fb = inject(FormBuilder);

  @ViewChild(FormGroupDirective)
  formDir!: FormGroupDirective;

  form = this.fb.group({
    name: this.fb.nonNullable.control(
      '',
      [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(/^[A-Za-z0-9](?:[A-Za-z0-9 ]*[A-Za-z0-9])?$/)
      ]
    ),
    email: this.fb.nonNullable.control('', [Validators.email, Validators.required]),
    emails: this.fb.array([this.fb.nonNullable.control('', [Validators.email])]),
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && changes['user'].currentValue) {
      if (this.user!.emails?.length) {
        this.form.controls.emails!.clear();
      }

      queueMicrotask(() => {
        for (const email of this.user!.emails ?? []) {
          this.form.controls.emails!.push(this.fb.nonNullable.control(email, [Validators.email]));
        }

        this.formDir.resetForm(this.user);
      })
    }
  }

  addEmail() {
    this.form.controls.emails!.push(this.fb.nonNullable.control('', [Validators.email]));
  }

  removeItem(index: number) {
    this.form.controls.emails!.removeAt(index);
    this.form.markAsDirty();
  }
}
