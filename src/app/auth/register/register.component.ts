import {Component, signal} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass} from "@angular/common";
import {RouterLink} from "@angular/router";

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
    this.accountCreated = true;
    this.errorMessage.set(null);
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
}
