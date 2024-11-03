import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, inject, Input, Output, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, NgbModalModule],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  @Input() title!: string;
  @Output() closed = new EventEmitter<void>();

  private modalService = inject(NgbModal);

  @ContentChild(TemplateRef) trigger!: TemplateRef<any>;

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
