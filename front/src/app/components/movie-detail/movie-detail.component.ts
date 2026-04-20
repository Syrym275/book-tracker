import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { AuthService } from '../../services/auth.service';
import { Movie, Review } from '../../interfaces/movie.interface';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css'
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | null = null;
  reviews: Review[] = [];
  isLoggedIn = false;
  isLoading = true;

  // Review form fields — using [(ngModel)]
  newReviewBody = '';
  newReviewRating = 8;
  showReviewForm = false;
  reviewError = '';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(val => this.isLoggedIn = val);

    const movieId = Number(this.route.snapshot.paramMap.get('id'));

    // Load movie from the list
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.movie = movies.find(m => m.id === movieId) || null;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });

    // Load reviews
    if (movieId) {
      this.movieService.getReviews(movieId).subscribe({
        next: (reviews) => this.reviews = reviews,
        error: () => {}
      });
    }
  }

  // (click) event — toggle review form
  onToggleReviewForm(): void {
    this.showReviewForm = !this.showReviewForm;
    this.reviewError = '';
  }

  // (click) event — submit review
  onSubmitReview(): void {
    if (!this.movie) return;
    if (!this.newReviewBody.trim()) {
      this.reviewError = 'Please write a review.';
      return;
    }
    this.movieService.createReview(this.movie.id, this.newReviewBody, this.newReviewRating).subscribe({
      next: (review) => {
        this.reviews.unshift(review);
        this.newReviewBody = '';
        this.newReviewRating = 8;
        this.showReviewForm = false;
      },
      error: (err) => {
        if (err.status === 400 && err.error?.non_field_errors) {
          this.reviewError = 'You can only leave one review per movie. Please delete your existing review to write a new one.';
        } else if (err.error && typeof err.error === 'object') {
          const key = Object.keys(err.error)[0];
          this.reviewError = `${key}: ${err.error[key]}`;
        } else {
          this.reviewError = 'Failed to submit review.';
        }
      }
    });
  }

  // (click) event — delete review
  onDeleteReview(reviewId: number): void {
    if (confirm('Delete this review?')) {
      this.movieService.deleteReview(reviewId).subscribe({
        next: () => { this.reviews = this.reviews.filter(r => r.id !== reviewId); },
        error: (err) => {
          if (err.status === 404) {
            alert('You cannot delete someone else\'s review!');
          } else {
            alert('Could not delete review.');
          }
        }
      });
    }
  }

  selectedStatus = 'want_to_watch';

  // (click) event — track movie
  onTrackMovie(): void {
    if (!this.movie) return;
    this.movieService.trackMovie(this.movie.id, this.selectedStatus).subscribe({
      next: () => alert(`Movie updated to: ${this.selectedStatus}`),
      error: () => alert('Failed to update status.')
    });
  }
}
