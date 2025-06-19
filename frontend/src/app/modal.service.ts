// frontend/src/app/modal.service.ts (cleaned)
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalData = new BehaviorSubject<any>(null);
  modalData$ = this.modalData.asObservable();

  openModal(data: any) {
    this.modalData.next(data);
  }

  closeModal() {
    this.modalData.next(null);
  }
}
