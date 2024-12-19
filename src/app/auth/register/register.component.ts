import {Component, inject, signal} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass} from "@angular/common";
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {AuthService} from "../auth.service";
import {HttpErrorResponse} from "@angular/common/http";
import {filter} from "rxjs";

function valuesEqual(controlName1: string, controlName2: string){
  return (control: AbstractControl) => {
    let value1 = control.get(controlName1)?.value;
    let value2 = control.get(controlName2)?.value;

    if (value1 === value2){
      return null;
    }

    return {valuesNotEqual: true};
  }
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  accountCreated = false;
  errorMessage = signal<string | null>(null);
  private authService = inject(AuthService);

  constructor(private router: Router) {
    this.setupRouteChangeListener();
  }

  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    passwords: new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      repeatPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    }, {
      validators: [valuesEqual('password', 'repeatPassword')]
    })
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Some fields are empty or invalid');
      return;
    }
    this.authService.getRegisterRequest({
      email: this.form.value.email!,
      password: this.form.value.passwords!.password!,
      fullName: this.form.value.firstName! + ' ' + this.form.value.lastName!
    }).subscribe({
      next: response => {
        console.log(response);
        this.errorMessage.set(null);
        this.accountCreated = true;
      },
      error: (error: HttpErrorResponse) => {
        let errorBody = error.error;
        this.errorMessage.set('Account not created. ' + errorBody.description);
      }
    })
  }

  isFieldInvalid(fieldName: string, groupName?: string) {
    if (groupName) {
      let field = this.form.get(groupName + '.' + fieldName)!;
      return field.invalid && field.touched;
    } else {
      let field = this.form.get(fieldName)!;
      return field.invalid && field.touched;
    }
  }

  private setupRouteChangeListener() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.errorMessage.set(null);
      })
  }
}
