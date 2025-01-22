import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LUCIDE_ICONS, LucideAngularModule, LucideIconProvider, icons } from 'lucide-angular';
import { AuthenticationService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }],
  standalone: true,
  imports: [LucideAngularModule, ReactiveFormsModule,FormsModule,RouterLink],
})
export class RegisterComponent implements OnInit {
  registerForm!: UntypedFormGroup;
  submitted = false;

  // Define available roles
  roles: string[] = ['CHEF', 'RESPONSABLE_RH', 'COLLABORATEUR'];

  constructor(private formBuilder: UntypedFormBuilder, private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required], 
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    // If the form is invalid, stop further execution
    if (this.registerForm.invalid) return;

    const user = this.registerForm.value;
    this.authService.register(user).subscribe({
      next: () => alert('User registered successfully'),
      error: (err) => alert('Registration failed: ' + err),
    });
  }
}

