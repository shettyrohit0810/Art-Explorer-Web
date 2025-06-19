// frontend\src\app\artist\details\details.component.ts
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  OnInit
} from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArtistService } from '../artist.service';
import { HttpClient } from '@angular/common/http';
import { CategoryModalComponent } from '../../category-modal/category-modal.component';
import { SimilarComponent } from '../similar/similar.component';
import { AuthService } from '../../auth/auth.service';
import { ModalService } from '../../modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, CategoryModalComponent, SimilarComponent],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() artistId: string = '';

  showCategoryModal = false;
  selectedArtworkId = '';
  selectedArtworkTitle = '';
  selectedArtworkYear = '';
  selectedArtworkThumbnail = '';

  artist: any = null;
  artworks: any[] = [];
  activeTab: 'info' | 'artworks' = 'info';

  loadingArtist = false;
  loadingArtworks = false;
  errorMessage = '';

  isFavorite = false;
  private favoritesSub!: Subscription;

  constructor(
    private artistService: ArtistService,
    private http: HttpClient,
    public authService: AuthService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    if (!this.artistId) {
      const savedArtistId = localStorage.getItem('selectedArtistId');
      if (savedArtistId) {
        this.artistId = savedArtistId;
        this.fetchArtistDetails(this.artistId);
      }
    }

    this.subscribeToFavorites();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['artistId'] &&
      changes['artistId'].currentValue &&
      changes['artistId'].currentValue !== changes['artistId'].previousValue
    ) {
      localStorage.setItem('selectedArtistId', this.artistId);
      this.fetchArtistDetails(this.artistId);
    }
  }

  ngOnDestroy() {
    this.favoritesSub?.unsubscribe();
  }

  /** ✅ Keeps local star state in sync */
  subscribeToFavorites() {
    this.favoritesSub?.unsubscribe();
    this.favoritesSub = this.authService.favorites$.subscribe(() => {
      this.isFavorite = this.authService.isFavorite(this.artistId);
    });
  }

  fetchArtistDetails(artistId: string) {
    this.errorMessage = '';
    this.loadingArtist = true;
    this.artist = null;

    this.artistService.getArtistDetails(artistId).subscribe({
      next: (data) => {
        this.artist = data;
        this.loadingArtist = false;

        if (this.activeTab === 'artworks') {
          setTimeout(() => {
            const wrapper = document.querySelector('.details-wrapper');
            if (wrapper) {
              wrapper.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error fetching artist details';
        this.artist = {
          name: 'Unknown Artist',
          nationality: 'Unknown',
          birthday: null,
          deathday: null,
          biography: ''
        };
        this.loadingArtist = false;
      }
    });

    this.loadingArtworks = true;
    this.artistService.getArtistArtworks(artistId).subscribe({
      next: (data) => {
        this.artworks = data.map((artwork: any) => ({
          id: artwork.id,
          title: artwork.title,
          date: artwork.date,
          thumbnail: artwork.image || 'assets/placeholder.png'
        }));
        this.loadingArtworks = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error fetching artworks';
        this.loadingArtworks = false;
      }
    });
  }

  toggleFavorite() {
    if (this.isFavorite) {
      this.authService.removeFavorite(this.artistId).subscribe({
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error removing from favorites';
        }
      });
    } else {
      this.authService.addFavorite(this.artistId).subscribe({
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error adding to favorites';
        }
      });
    }
  }

  openCategoryModal(artwork: any) {
    const parsedYear = artwork.date?.match(/\d{4}/)?.[0] || '';
    this.selectedArtworkId = artwork.id;
    this.selectedArtworkTitle = artwork.title;
    this.selectedArtworkYear = parsedYear;
    this.selectedArtworkThumbnail = artwork.thumbnail;
    this.showCategoryModal = true;
  }
}
