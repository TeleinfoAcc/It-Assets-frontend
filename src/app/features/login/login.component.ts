import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private api: ApiService,
    private snakbar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
      proj_id: [''],

    });

  }

  project: any[] = [];

  ngOnInit(): void {

    this.getProjects();

  }

  getProjects() {
    this.api.getProjectsonQamon().subscribe({
      next: (response: any) => {
        this.project = Array.isArray(response) ? response : response.data;
        // console.log('Projects loaded:', this.project);
      },
      error: error => {
        console.error('Failed to load projects:', error);
      }
    });
  }

  onLogin(loginData: any) {
    this.authService.login(loginData).subscribe({
      next: response => {
        const pms = Number(sessionStorage.getItem('pms_id'));
        if (pms === 2) {
          const slug = sessionStorage.getItem('proj_slug');
          this.router.navigate(['/projects', slug]);
        } else {
          this.router.navigate(['/projects']);
        }
      },
      error: error => {
        this.snakbar.open('Login failed. ' + error.error.message, 'Close', {
          duration: 3000, panelClass: ['error-snackbar']
        });
        console.error('Error logging in:', error);
      }
    });

  }

}
