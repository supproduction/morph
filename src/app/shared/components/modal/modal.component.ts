import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  @Input() title!: string;
  @Output() closed = new EventEmitter<void>();

  private modalService = inject(NgbModal);

  open(content: TemplateRef<any>) {
    this.modalService.open(content).result.then(
      () => this.closed.emit(),
      () => this.closed.emit()
    );
  }

  close() {
    this.modalService.dismissAll();
  }
}
