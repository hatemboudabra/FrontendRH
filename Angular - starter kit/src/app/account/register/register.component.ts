import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LUCIDE_ICONS, LucideAngularModule, LucideIconProvider, icons } from 'lucide-angular';
import { AuthenticationService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }],
  standalone: true,
  imports: [LucideAngularModule, ReactiveFormsModule, FormsModule, RouterLink, CommonModule],
})
export class RegisterComponent implements OnInit {
  registerForm!: UntypedFormGroup;
  submitted = false;

  constructor(private formBuilder: UntypedFormBuilder, private authService: AuthenticationService,private router:Router) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      roles: [['COLLABORATEUR'], Validators.required],
    });
  }

  get f() {
    return this.registerForm.controls;
  }
  onSubmit(): void {
    this.submitted = true;
  
    if (this.registerForm.invalid) return;
  
    const user = this.registerForm.value;
    this.authService.register(user).subscribe({
      next: (response: any) => {
        alert(response.message || response);
        this.router.navigate(['/account-login'])
      },
      error: (err) => {
        alert('Registration failed: ' + (err.error || 'Unknown error'));
      },
    });
  }
}