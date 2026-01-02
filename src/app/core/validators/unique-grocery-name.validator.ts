import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { GroceryService } from '../services/grocery.services';

export function uniqueGroceryNameValidator(
  groceryService: GroceryService,
  excludeId?: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = control.value;
    const value = typeof raw === 'string' ? raw.trim().toLowerCase() : '';

    if (!value) return null;

    const exists = groceryService
      .groceries()
      .some(g => g.name.trim().toLowerCase() === value && g.id !== excludeId);

    return exists ? { duplicateName: true } : null;
  };
}
