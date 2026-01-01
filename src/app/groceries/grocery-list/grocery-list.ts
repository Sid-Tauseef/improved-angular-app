import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { GroceryService } from '../../core/services/grocery.services';
import { Grocery, GROCERY_CATEGORIES } from '../../core/models/grocery.model';
import { GroceryCardComponent } from '../grocery-card/grocery-card';
import { uniqueGroceryNameValidator } from '../../core/validators/unique-grocery-name.validator';

@Component({
  selector: 'app-grocery-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GroceryCardComponent],
  templateUrl: './grocery-list.html',
  styleUrl: './grocery-list.scss',
})
export class GroceryListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly groceryService = inject(GroceryService);
  readonly categories = GROCERY_CATEGORIES;

  readonly searchTerm = signal('');
  readonly filterCategory = signal('');
  readonly sortBy = signal<'name' | 'quantity' | 'category'>('name');

  readonly addForm = this.fb.nonNullable.group({
    name: [
      '',
      [Validators.required, uniqueGroceryNameValidator(this.groceryService)],
    ],
    quantity: [1, [Validators.required, Validators.min(1)]],
    category: ['', [Validators.required]],
    lowStockThreshold: [5, [Validators.min(0)]],
    notes: [''],
    image: [''],
  });

  readonly filteredGroceries = computed(() => {
    let items = this.groceryService.groceries();

    const search = this.searchTerm().trim().toLowerCase();
    if (search) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(search)
      );
    }

    const category = this.filterCategory();
    if (category) {
      items = items.filter(item => item.category === category);
    }

    const sort = this.sortBy();
    items = [...items].sort((a, b) => {
      if (sort === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sort === 'quantity') {
        return a.quantity - b.quantity;
      } else if (sort === 'category') {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });

    return items;
  });

  readonly lowStockCount = computed(() => {
    return this.groceryService.groceries().filter(item => {
      const threshold = item.lowStockThreshold ?? 5;
      return item.quantity <= threshold;
    }).length;
  });

  ngOnInit(): void {
    this.groceryService.load();
  }

  viewDetail(item: Grocery): void {
    this.router.navigate(['/grocery', item.id]);
  }

  addItem(): void {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      return;
    }

    const { name, quantity, category, lowStockThreshold, notes, image } =
      this.addForm.getRawValue();

    this.groceryService.add({
      name: name.trim(),
      quantity,
      category,
      lowStockThreshold: lowStockThreshold || 5,
      notes: notes?.trim() || undefined,
      image: image?.trim() || undefined,
    });

    this.addForm.reset({
      quantity: 1,
      category: '',
      lowStockThreshold: 5,
    });
  }

  deleteItem(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this item?');
    if (!confirmed) return;

    this.groceryService.delete(id);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.filterCategory.set('');
    this.sortBy.set('name');
  }
}
