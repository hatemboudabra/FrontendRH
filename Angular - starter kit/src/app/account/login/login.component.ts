// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from '../../store/Authentication/authentication.actions';
import { AuthenticationService } from '../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  //styleUrls: ['./login.component.css'],
  standalone: true,
    imports: [ ReactiveFormsModule,FormsModule,RouterLink,RouterLinkActive,LucideAngularModule],
})
export class LoginComponent  {
  loginForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe({
      next: (response) => alert('Login successful: ' + response.token),
      error: (err) => alert('Login failed: ' + err),
    });
  }
  fieldTextType: boolean = false;

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
