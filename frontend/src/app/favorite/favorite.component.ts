import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';


@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favorites: any[] = [];
  loading = false;
  errorMessage = '';
  intervalId: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService 
  ) {
    this.fetchFavorites();
  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.favorites = this.favorites.map(fav => ({
        ...fav,
        relativeTime: this.calculateRelativeTime(fav.addedAt)
      }));
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  fetchFavorites(): void {
    this.loading = true;
    this.http.get('/api/favorites', { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.favorites = (res.favorites || []).map((fav: any) => ({
          ...fav,
          relativeTime: this.calculateRelativeTime(fav.addedAt)
        }));
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error fetching favorites';
        this.loading = false;
      }
    });
  }

  viewArtistDetails(artistId: string): void {
    this.router.navigate(['/details', artistId]);
  }

  removeFavorite(artistId: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.http.get(`/api/favorites/remove?artistId=${artistId}`, { withCredentials: true }).subscribe({
      next: () => {
        this.fetchFavorites();
        this.notificationService.show('Removed from favorites', 'danger'); // ✅ Toast on success
      },
      error: (err) => {
        console.error('Error removing favorite:', err);
        this.errorMessage = err.error?.message || 'Failed to remove favorite';
      }
    });
  }

  private calculateRelativeTime(dateStr: string): string {
    const now = new Date();
    const then = new Date(dateStr);
    const diffSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diffSeconds < 0) return 'just now';
    if (diffSeconds < 60) return diffSeconds === 1 ? '1 second ago' : `${diffSeconds} seconds ago`;
    if (diffSeconds < 3600) {
      const minutes = Math.floor(diffSeconds / 60);
      return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    }
    if (diffSeconds < 86400) {
      const hours = Math.floor(diffSeconds / 3600);
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    }
    const days = Math.floor(diffSeconds / 86400);
    return days === 1 ? '1 day ago' : `${days} days ago`;
  }
}
