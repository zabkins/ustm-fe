import { Component } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

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
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
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

}
