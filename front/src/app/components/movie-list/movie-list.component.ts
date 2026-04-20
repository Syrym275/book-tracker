import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { AuthService } from '../../services/auth.service';
import { Movie } from '../../interfaces/movie.interface';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css'
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  errorMessage = '';
  searchQuery = '';
  isLoading = true;
  isLoggedIn = false;

  genres = [
    { name: 'All', slug: '' },
    { name: 'Action', slug: 'action' },
    { name: 'Comedy', slug: 'comedy' },
    { name: 'Adventure', slug: 'adventure' },
    { name: 'Drama', slug: 'drama' },
    { name: 'Sci-Fi', slug: 'sci-fi' },
    { name: 'Thriller', slug: 'thriller' },
    { name: 'Horror', slug: 'horror' },
    { name: 'Animation', slug: 'animation' }
  ];
  selectedGenre = '';
  showTopRated = false;

  constructor(private movieService: MovieService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(val => this.isLoggedIn = val);
    this.loadMovies();
  }

  loadMovies(): void {
    this.isLoading = true;
    this.movieService.getMovies(this.searchQuery, this.selectedGenre, this.showTopRated).subscribe({
      next: (data) => {
        this.movies = data;
        this.isLoading = false;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Failed to load movies. Make sure backend is running.';
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.loadMovies();
  }

  onSelectGenre(slug: string): void {
    this.selectedGenre = slug;
    this.loadMovies();
  }

  toggleTopRated(): void {
    this.showTopRated = !this.showTopRated;
    this.loadMovies();
  }

  onTrack(movie: Movie, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.movieService.trackMovie(movie.id, 'want_to_watch').subscribe({
      next: () => alert(`"${movie.title}" added to your watchlist!`),
      error: () => alert('Already in your list or an error occurred.')
    });
  }
}
