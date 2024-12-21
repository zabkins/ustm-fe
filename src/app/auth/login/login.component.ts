import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {NgClass} from "@angular/common";
import {HttpErrorResponse} from "@angular/common/http";
import {ErrorBody} from "./auth.models";
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {filter} from "rxjs";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  errorMessage = signal<string | null>(null);
  private authService = inject(AuthService);

  constructor(private router: Router) {
    this.setupRouteChangeListener();
  }

  form = new FormGroup({
    email: new FormControl((''), {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl((''), {
      validators: [Validators.required],
    })
  })

  onSubmit() {
    if (this.form.invalid) {
      this.errorMessage.set('Email and password cannot be empty');
      this.form.markAllAsTouched();
      return;
    }
    this.authService.getLoginRequest({
      email: this.form.value.email!,
      password: this.form.value.password!
    }).subscribe({
      next: response => {
        this.authService.loginUser(response);
        this.router.navigate([''], {
          replaceUrl: true
        })
      },
      error: (error: HttpErrorResponse) => {
        let errorBody: ErrorBody = error.error;
        console.log(errorBody);
        this.errorMessage.set('Login unsuccessful. ' + errorBody.detail);
      }
    })
  }

  isFieldInvalid(fieldName: string) {
    let field = this.form.get(fieldName)!;
    return field.invalid && field.touched;
  }

  private setupRouteChangeListener() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.errorMessage.set(null);
      })
  }
}
