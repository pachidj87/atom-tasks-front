import { Component, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  template: '',
})
export abstract class FormPageComponent implements OnDestroy {
  subscription!: Subscription;
  form!: FormGroup;

  constructor() {}

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  showErrorMessage(controlName: string, error: string) {
    const control: AbstractControl | null = this.form.get(controlName);
    return control && control.hasError(error) && (control.dirty || control.touched);
  }
}
