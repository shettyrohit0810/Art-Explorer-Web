// frontend\src\app\app.component.ts
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { CategoryModalComponent } from './category-modal/category-modal.component';
import { NgIf } from '@angular/common';
import { ModalService } from './modal.service';
import { AuthService } from './auth/auth.service';
import { NotificationComponent } from './notification/notification.component'; // Added NotificationComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    RouterOutlet,
    CategoryModalComponent,
    NgIf,
    NotificationComponent  // Added to imports
  ],
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
