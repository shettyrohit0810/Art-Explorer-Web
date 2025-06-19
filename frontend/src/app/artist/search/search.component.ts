import { Component, OnInit } from '@angular/core';
import { DetailsComponent } from '../details/details.component';
import { ArtistService } from '../artist.service';
import { AuthService } from '../../auth/auth.service';
import { NotificationService } from '../../notification.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchQuery = '';
  artists: any[] = [];
  loading = false;
  errorMessage = '';
  selectedArtistId: string | null = null;
  currentUser: any = null;
  hideArtistCards = false;

  favoritesSet: Set<string> = new Set();

  constructor(
    private artistService: ArtistService,
    public authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  
    this.authService.favorites$.subscribe(favs => {
      this.favoritesSet = favs;
    });
  
    // ✅ Restore artistId and hide cards if present
    const storedId = localStorage.getItem('selectedArtistId');
    if (storedId) {
      this.selectedArtistId = storedId;
      this.hideArtistCards = true;
      this.artists = [];
    }
  }
  

  onSearch() {
    this.errorMessage = '';
    this.loading = true;
    this.selectedArtistId = null;
    this.hideArtistCards = false;

    if (!this.searchQuery.trim()) {
      this.artists = [];
      this.loading = false;
      return;
    }

    this.artistService.searchArtists(this.searchQuery).subscribe({
      next: (data: any) => {
        this.artists = Array.isArray(data) ? data : [];
        this.loading = false;
        if (this.artists.length === 0) {
          this.errorMessage = 'No results.';
        }
      },
      error: (err: any) => {
        console.error('Search error:', err);
        this.errorMessage = err.error?.message || 'Error searching artists';
        this.loading = false;
      }
    });
  }

  onClear() {
    this.searchQuery = '';
    this.artists = [];
    this.errorMessage = '';
    this.selectedArtistId = null;
    this.hideArtistCards = false;
  }

  viewDetails(artistId: string) {
    this.selectedArtistId = null;
    this.hideArtistCards = false;
    setTimeout(() => {
      this.selectedArtistId = artistId;
    }, 0);
  }

  onArtistNameClicked() {
    this.hideArtistCards = true;
  }

  isFavorite(artist: any): boolean {
    return this.favoritesSet.has(artist.id);
  }

  toggleFavorite(artist: any, event: Event) {
    event.stopPropagation();
    if (this.isFavorite(artist)) {
      this.authService.removeFavorite(artist.id).subscribe({
        error: (err: any) => {
          console.error('Error removing favorite', err);
        }
      });
    } else {
      this.authService.addFavorite(artist.id).subscribe({
        error: (err: any) => {
          console.error('Error adding favorite', err);
        }
      });
    }
  }
}  