import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  // [(ngModel)] form controls #3, #4, #5, #6
  username = '';
  email = '';
  password = '';
  passwordConfirm = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // (click) event #3 — register
  onRegister(): void {
    this.errorMessage = '';

    if (this.password !== this.passwordConfirm) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;

    this.authService.register(this.username, this.email, this.password, this.passwordConfirm).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/movies']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error) {
          const errors = err.error;
          const messages: string[] = [];
          for (const key of Object.keys(errors)) {
            const val = errors[key];
            if (Array.isArray(val)) {
              messages.push(...val);
            } else if (typeof val === 'string') {
              messages.push(val);
            }
          }
          this.errorMessage = messages.join(' ') || 'Registration failed.';
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    });
  }
}
