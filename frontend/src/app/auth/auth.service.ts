// frontend\src\app\auth\auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NotificationService } from '../notification.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;

  private favoritesSet = new Set<string>();
  private favoritesSubject = new BehaviorSubject<Set<string>>(new Set());
  public favorites$ = this.favoritesSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  get currentUser(): any {
    return this.currentUserSubject.value;
  }

  set currentUser(user: any) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post('/api/auth/login', credentials, { withCredentials: true }).pipe(
      tap((response: any) => {
        this.isLoggedIn = true;
        this.currentUser = response.user;
        this.syncFavorites();
        this.notificationService.show('Logged in', 'success');
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post('/api/auth/register', userData, { withCredentials: true }).pipe(
      tap((response: any) => {
        this.isLoggedIn = true;
        this.currentUser = response.user;
        this.syncFavorites();
        this.notificationService.show('Registered successfully', 'success');
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post('/api/auth/logout', {}, { withCredentials: true }).pipe(
      tap(() => {
        this.clearAuthState();
        this.notificationService.show('Logged out', 'success'); // 🛑 REMOVE THIS LINE
      })
    );
  }
  

  deleteAccount(): Observable<any> {
    return this.http.delete('/api/auth/delete', { withCredentials: true }).pipe(
      tap(() => {
        this.clearAuthState();
        this.notificationService.show('Account deleted', 'danger');
      })
    );
  }

  isFavorite(artistId: string): boolean {
    return this.favoritesSet.has(artistId);
  }

  addFavorite(artistId: string): Observable<any> {
    this.favoritesSet.add(artistId);
    this.emitFavorites();
    return this.http.get(`/api/favorites/add?artistId=${artistId}`, { withCredentials: true }).pipe(
      tap(() => {
        this.syncFavorites();
        this.notificationService.show('Added to favorites', 'success'); // ✅ keep only here
      })
    );
  }
  

  removeFavorite(artistId: string): Observable<any> {
    this.favoritesSet.delete(artistId);
    this.emitFavorites();
    return this.http.get(`/api/favorites/remove?artistId=${artistId}`, { withCredentials: true }).pipe(
      tap(() => {
        this.syncFavorites();
        this.notificationService.show('Removed from favorites', 'danger');
      })
    );
  }

  syncFavorites() {
    this.http.get('/api/favorites', { withCredentials: true }).subscribe((res: any) => {
      const updated = new Set<string>();
      for (const fav of res.favorites || []) {
        updated.add(fav.artistId);
      }
      this.favoritesSet = updated;
      this.emitFavorites();
    });
  }

  checkAuth() {
    this.http.get('/api/auth/me', { withCredentials: true }).subscribe({
      next: (res: any) => {
        if (res.authenticated) {
          this.isLoggedIn = true;
          this.currentUser = res.user;
          const updated = new Set<string>((res.user.favorites || []).map((f: any) => f.artistId));
          this.favoritesSet = updated;
          this.emitFavorites();
        } else {
          this.clearAuthState();
        }
      },
      error: () => this.clearAuthState()
    });
  }

  private emitFavorites() {
    this.favoritesSubject.next(new Set(this.favoritesSet));
  }

  private clearAuthState() {
    this.isLoggedIn = false;
    this.currentUser = null;
    this.favoritesSet.clear();
    this.emitFavorites();
  }
}
