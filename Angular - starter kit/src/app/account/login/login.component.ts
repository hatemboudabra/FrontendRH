import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../core/services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [ 
    ReactiveFormsModule, 
    FormsModule, 
    RouterLink, 
    RouterLinkActive, 
    LucideAngularModule, 
    CommonModule
  ],
})
export class LoginComponent {
  loginForm!: FormGroup;
  submitted = false;
  fieldTextType = false;
  //private isReloaded = false;
  constructor(
    private fb: FormBuilder, 
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [
        Validators.required, 
       // Validators.minLength(8), 
       // Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
      ]]
    });
   

  }

  get f() { 
    return this.loginForm.controls; 
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe({
      next: (response) => {
        document.getElementById('successAlert')?.classList.remove('hidden');
      
        this.router.navigate(['']);
     
      },
      error: (err) => {
        console.error('Login failed', err);
      }
    });
  }

  toggleFieldTextType(): void {
    this.fieldTextType = !this.fieldTextType;
  }
}