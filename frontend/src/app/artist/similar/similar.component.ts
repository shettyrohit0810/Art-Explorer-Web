// frontend\src\app\artist\similar\similar.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { ArtistService } from '../artist.service';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-similar',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe],
  templateUrl: './similar.component.html',
  styleUrls: ['./similar.component.css']
})
export class SimilarComponent implements OnInit, OnChanges, OnDestroy {
  @Input() artistId: string = '';
  @Output() selectArtist = new EventEmitter<string>();

  similarArtists: any[] = [];
  loading = false;
  errorMessage = '';
  favorites: Set<string> = new Set(); //  Use Set for efficiency and consistency

  private favoritesSub!: Subscription;

  constructor(
    private artistService: ArtistService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.syncFavorites(); //  Sync once on init
    this.subscribeToFavorites();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['artistId']?.currentValue) {
      this.fetchSimilarArtists();
    }
  }

  ngOnDestroy(): void {
    this.favoritesSub?.unsubscribe();
  }

  private subscribeToFavorites() {
    this.favoritesSub?.unsubscribe();
    this.favoritesSub = this.authService.favorites$.subscribe((favorites: Set<string>) => {
      this.favorites = favorites;
    });
  }

  private fetchSimilarArtists() {
    this.loading = true;
    this.artistService.getSimilarArtists(this.artistId).subscribe({
      next: (data: any) => {
        this.similarArtists = Array.isArray(data) ? data : [];
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error fetching similar artists';
        this.loading = false;
      }
    });
  }

  isFavorite(id: string): boolean {
    return this.authService.isFavorite(id); //  Use centralized logic
  }

  toggleFavorite(artist: any, event: Event) {
    event.stopPropagation();
    const update$ = this.isFavorite(artist.id)
      ? this.authService.removeFavorite(artist.id)
      : this.authService.addFavorite(artist.id);

    update$.subscribe(); //  Updates syncFavorites + optimistic
  }

  onArtistClick(id: string) {
    this.selectArtist.emit(id);
  }
}
