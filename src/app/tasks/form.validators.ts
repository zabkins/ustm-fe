import {AbstractControl, FormControl, FormGroup} from "@angular/forms";

export function finishDateNotInPast() {
  return (control: AbstractControl) => {
    const finishDate = control.value;
    if (finishDate && new Date(finishDate) < new Date()) {
      return {finishDateInPast: true};
    }
    return null;
  };
}

export function finishDateBeforeStartDate() {
  return (control: AbstractControl) => {
    const startDate = control.get('startDate')?.value;
    const finishDate = control.get('finishDate')?.value;
    if (startDate && finishDate && new Date(startDate) >= new Date(finishDate)) {
      return {finishDateBeforeStartDate: true};
    }
    return null;
  };
}

export function isFormValid(form: FormGroup) {
  let errors: string[] = [];
  if (form.get('name')?.hasError('required')) {
    errors.push('Name is required');
  }
  if (form.get('description')?.hasError('required')) {
    errors.push('Description is required');
  }
  if (form.get('startDate')?.hasError('required')) {
    errors.push('Start date is required');
  }
  if (form.get('finishDate')?.hasError('required')) {
    errors.push('Finish date is required');
  }
  if (form.get('finishDate')?.hasError('finishDateInPast')) {
    errors.push('Finish date cannot be in the past');
  }
  if (form.hasError('finishDateBeforeStartDate')) {
    errors.push('Finish date cannot be earlier than start date');
  }
  return errors;
}
