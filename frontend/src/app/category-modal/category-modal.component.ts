// frontend\src\app\category-modal\category-modal.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.css']
})
export class CategoryModalComponent implements OnInit {
  @Input() artworkId: string = '';
  @Input() artworkTitle: string = '';
  @Input() artworkYear: string = '';
  @Input() artworkThumbnail: string = '';  // Added to display the artwork photo

  @Output() closed = new EventEmitter<void>();

  categories: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log('MODAL INIT');
    console.log('artworkId:', this.artworkId);
    console.log('artworkTitle:', this.artworkTitle);
    console.log('artworkYear:', this.artworkYear);
    console.log('artworkThumbnail:', this.artworkThumbnail);
  
    if (this.artworkId) {
      this.fetchCategories();
    } else {
      console.warn(' No artworkId passed — skipping category fetch');
    }
  }
  
  
  
  fetchCategories() {
    this.loading = true;
    this.http.get('/api/genes', {
      params: { artwork_id: this.artworkId },
      withCredentials: true
    }).subscribe({
      next: (res: any) => {
        console.log('Categories response:', res);
        this.categories = res?._embedded?.genes?.map((gene: any) => ({
          name: gene.name,
          thumbnail: gene._links.thumbnail.href
        })) || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.errorMessage = err.error?.message || 'Error fetching categories';
        this.loading = false;
      }
    });
  }
  

  close() {
    this.closed.emit();
  }
}
