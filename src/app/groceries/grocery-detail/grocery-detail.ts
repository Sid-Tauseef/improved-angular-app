import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';

import { GroceryService } from '../../core/services/grocery.services';
import { Grocery, GROCERY_CATEGORIES } from '../../core/models/grocery.model';
import { uniqueGroceryNameValidator } from '../../core/validators/unique-grocery-name.validator';

@Component({
  selector: 'app-grocery-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './grocery-detail.html',
  styleUrl: './grocery-detail.scss',
})
export class GroceryDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly groceryService = inject(GroceryService);
  private readonly fb = inject(FormBuilder);

  readonly item = signal<Grocery | null>(null);
  readonly categories = GROCERY_CATEGORIES;
  readonly fallbackImage = 'assets/default-grocery.jpg';

  isEditing = false;

  readonly editForm: FormGroup = this.fb.nonNullable.group({
    name: ['', Validators.required],
    quantity: [0, [Validators.required, Validators.min(0)]],
    category: ['', Validators.required],
    lowStockThreshold: [5, Validators.min(0)],
    notes: [''],
    image: [''],
  });

  readonly isLowStock = computed(() => {
    const current = this.item();
    return !!current && current.quantity <= (current.lowStockThreshold ?? 5);
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    this.groceryService.getById(id).subscribe({
      next: data => this.item.set(data),
      error: () => this.router.navigate(['/']),
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  startEdit(): void {
    const current = this.item();
    if (!current) return;

    this.editForm.patchValue({
      name: current.name,
      quantity: current.quantity,
      category: current.category,
      lowStockThreshold: current.lowStockThreshold ?? 5,
      notes: current.notes ?? '',
      image: current.image ?? '',
    });

    const nameControl = this.editForm.controls['name'];
    nameControl.setValidators([
      Validators.required,
      uniqueGroceryNameValidator(this.groceryService, current.id),
    ]);
    nameControl.updateValueAndValidity({ emitEvent: false });

    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;

    this.editForm.controls['name'].setValidators([Validators.required]);
    this.editForm.controls['name'].updateValueAndValidity({ emitEvent: false });
  }

  saveEdit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const current = this.item();
    if (!current) return;

    const payload = {
      ...this.editForm.getRawValue(),
      notes: this.editForm.value.notes?.trim() || undefined,
      image: this.editForm.value.image?.trim() || undefined,
    };

    this.groceryService.update(current.id, payload);

    this.item.set({ ...current, ...payload });

    this.isEditing = false;

    this.editForm.controls['name'].setValidators([Validators.required]);
    this.editForm.controls['name'].updateValueAndValidity({ emitEvent: false });
  }

  deleteItem(): void {
    const current = this.item();
    if (!current) return;

    if (confirm(`Delete "${current.name}"?`)) {
      this.groceryService.delete(current.id);
      this.router.navigate(['/']);
    }
  }

  controlHasError(control: string, error: string): boolean {
    const c = this.editForm.get(control);
    return !!c && c.touched && c.hasError(error);
  }
}
