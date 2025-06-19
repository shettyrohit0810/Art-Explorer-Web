// frontend\src\app\app.component.ts
import { Component, OnInit } from '@angular/core';
import { ModalService } from './modal.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showCategoryModal = false;
  selectedArtworkId = '';
  selectedArtworkTitle = '';
  selectedArtworkThumbnail = '';
  selectedArtworkYear = '';

  constructor(
    private modalService: ModalService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Check authentication on app load.
    this.authService.checkAuth();

    // Subscribe to modal changes.
    this.modalService.modalData$.subscribe((artwork) => {
      if (artwork) {
        this.selectedArtworkId = artwork.id;
        this.selectedArtworkTitle = artwork.title;
        this.selectedArtworkThumbnail = artwork.thumbnail;
        this.selectedArtworkYear = artwork.year;
        this.showCategoryModal = true;
      } else {
        this.showCategoryModal = false;
      }
    });
  }

  closeCategoryModal() {
    this.modalService.closeModal();
  }
}
