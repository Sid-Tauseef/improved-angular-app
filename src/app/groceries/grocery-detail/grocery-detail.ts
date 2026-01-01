import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { GroceryService } from '../../core/services/grocery.services';
import { Grocery, GROCERY_CATEGORIES } from '../../core/models/grocery.model';

@Component({
  selector: 'app-grocery-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grocery-detail.html',
  styleUrl: './grocery-detail.scss',
})
export class GroceryDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly groceryService = inject(GroceryService);

  readonly item = signal<Grocery | null>(null);
  readonly categories = GROCERY_CATEGORIES;
  readonly fallbackImage = 'assets/default-grocery.jpg';

  isEditing = false;

  editedName = '';
  editedQuantity = 0;
  editedCategory = '';
  editedLowStockThreshold = 5;
  editedNotes = '';
  editedImage = '';

  readonly isLowStock = computed(() => {
    const current = this.item();
    if (!current) return false;

    const threshold = current.lowStockThreshold ?? 5;
    return current.quantity <= threshold;
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    this.groceryService.getById(id).subscribe({
      next: data => this.item.set(data),
      error: () => {
        alert('Grocery item not found');
        this.router.navigate(['/']);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  deleteItem(): void {
    const current = this.item();
    if (!current) return;

    const confirmed = confirm(
      `Are you sure you want to delete "${current.name}"?`
    );
    if (!confirmed) return;

    this.groceryService.delete(current.id);
    this.router.navigate(['/']);
  }

  startEdit(): void {
    const current = this.item();
    if (!current) return;

    this.editedName = current.name;
    this.editedQuantity = current.quantity;
    this.editedCategory = current.category;
    this.editedLowStockThreshold = current.lowStockThreshold ?? 5;
    this.editedNotes = current.notes || '';
    this.editedImage = current.image || '';
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  saveEdit(): void {
    const current = this.item();
    if (!current) return;

    if (
      !this.editedName.trim() ||
      this.editedQuantity < 0 ||
      !this.editedCategory
    ) {
      alert('Please fill in all required fields with valid values');
      return;
    }

    this.groceryService.update(current.id, {
      name: this.editedName.trim(),
      quantity: this.editedQuantity,
      category: this.editedCategory,
      lowStockThreshold: this.editedLowStockThreshold,
      notes: this.editedNotes.trim() || undefined,
      image: this.editedImage.trim() || undefined,
    });

    this.item.set({
      ...current,
      name: this.editedName.trim(),
      quantity: this.editedQuantity,
      category: this.editedCategory,
      lowStockThreshold: this.editedLowStockThreshold,
      notes: this.editedNotes.trim() || undefined,
      image: this.editedImage.trim() || undefined,
    });

    this.isEditing = false;
  }
}
