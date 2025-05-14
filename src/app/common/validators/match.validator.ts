import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchValidator(matchTo: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlToMatch = control.parent?.get(matchTo);
    if (controlToMatch && controlToMatch.value !== control.value) {
      controlToMatch.markAsDirty();
      controlToMatch.setErrors({ match: true });
      return { match: true };
    }

    if (controlToMatch && controlToMatch.errors) {
      const keys = Object.keys(controlToMatch.errors);
      if (keys.length === 1) {
        controlToMatch.setErrors(null);
      } else {
        delete controlToMatch.errors['match'];
      }
    }

    if (control && control.errors) {
      delete control.errors['match'];
    }

    return null;
  };
}
