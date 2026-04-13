import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div class="card shadow" style="width: 400px;">
        <div class="card-body p-5">
          <div class="text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi text-primary mb-3">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
              <path d="M19 10H5a2 2 0 00-2 2v1a2 2 0 002 2h14a2 2 0 002-2v-1a2 2 0 00-2-2z"/>
              <circle cx="12" cy="14" r="4"/>
            </svg>
            <h3>Panel Admin</h3>
            <p class="text-muted">Ingresa tus credenciales</p>
          </div>

          <div *ngIf="error" class="alert alert-danger">
            {{ error }}
          </div>

          <form (ngSubmit)="login()">
            <div class="mb-3">
              <label class="form-label">Usuario</label>
              <input type="text" class="form-control" [(ngModel)]="usuario" name="usuario" required>
            </div>

            <div class="mb-3">
              <label class="form-label">Contraseña</label>
              <input type="password" class="form-control" [(ngModel)]="password" name="password" required>
            </div>

            <div class="mb-3 text-center">
              <div class="bg-light p-3 rounded">
                <small class="text-muted">reCAPTCHA (demo)</small>
              </div>
            </div>

            <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
              {{ loading ? 'Ingresando...' : 'Ingresar' }}
            </button>
          </form>

          <div class="text-center mt-3">
            <a routerLink="/" class="text-decoration-none">← Volver al inicio</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  usuario = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.loading = true;
    this.error = '';

    this.api.login(this.usuario, this.password, 'demo-token').subscribe({
      next: (data) => {
        this.auth.login(data.token, data.usuario);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Credenciales inválidas';
      },
      complete: () => this.loading = false
    });
  }
}
