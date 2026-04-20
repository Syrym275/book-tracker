import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { UserMovie } from '../../interfaces/movie.interface';

@Component({
  selector: 'app-my-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="movie-list-page" style="padding: 20px;">
      <h2 style="color: white; margin-bottom: 30px;">My Watchlist / Tracked Movies</h2>
      @if(userMovies.length === 0) { <p style="color: #ccc;">Your list is empty.</p> }
      <div class="movies-grid">
        @for (um of userMovies; track um.id) {
          <div class="movie-card" style="padding: 20px; background: rgba(255,255,255,0.05); border-radius: 15px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px);">
            <h3 style="color: var(--primary-color); margin-top: 0;">{{ um.movie_title }}</h3>
            <p style="color: #ddd;">Status: <span class="genre-chip active">{{ um.status }}</span></p>
            <p style="color: #999; font-size: 0.9em;">Added: {{ um.added_at | date:'mediumDate' }}</p>
            <button 
              (click)="onRemove(um.id)" 
              style="margin-top: 15px; background: #ff4757; color: white; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; transition: 0.3s;"
              onmouseover="this.style.opacity='0.8'" 
              onmouseout="this.style.opacity='1'">
              Remove from list
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class MyListComponent implements OnInit {
  userMovies: UserMovie[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.loadList();
  }

  loadList() {
    this.movieService.getUserMovies().subscribe(res => this.userMovies = res);
  }

  onRemove(id: number) {
    if(confirm('Remove this movie from your list?')) {
      this.movieService.deleteUserMovie(id).subscribe(() => {
        this.loadList();
      });
    }
  }
}
