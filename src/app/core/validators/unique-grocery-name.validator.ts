import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { GroceryService } from '../services/grocery.services';

export function uniqueGroceryNameValidator(
  groceryService: GroceryService
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.trim().toLowerCase();

    if (!value) {
      return null;
    }

    const exists = groceryService
      .groceries()
      .some(g => g.name.trim().toLowerCase() === value);

    return exists ? { duplicateName: true } : null;
  };
}
