import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  constructor(private http: HttpClient) {}

  searchArtists(query: string): Observable<any> {
    return this.http.get(`/api/artists/search?q=${query}`, { withCredentials: true });
  }

  getArtistDetails(artistId: string): Observable<any> {
    return this.http.get(`/api/artists/${artistId}`, { withCredentials: true });
  }

  getArtistArtworks(artistId: string): Observable<any> {
    return this.http.get(`/api/artists/${artistId}/artworks`, { withCredentials: true });
  }

  getSimilarArtists(artistId: string): Observable<any> {
    return this.http.get(`/api/artists/${artistId}/similar`, { withCredentials: true });
  }
}
