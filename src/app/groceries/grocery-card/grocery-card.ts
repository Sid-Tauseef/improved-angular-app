import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Grocery } from '../../core/models/grocery.model';

@Component({
  selector: 'app-grocery-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grocery-card.html',
  styleUrl: './grocery-card.scss',
})
export class GroceryCardComponent {
  @Input({ required: true }) set item(value: Grocery) {
    this._item.set(value);
  }

  get item(): Grocery {
    return this._item();
  }

  @Output() view = new EventEmitter<Grocery>();
  @Output() delete = new EventEmitter<string>();

  private readonly _item = signal<Grocery>({} as Grocery);
  readonly fallbackImage = 'assets/default-grocery.jpg';

  readonly isLowStock = computed(() => {
    const item = this._item();
    const threshold = item.lowStockThreshold ?? 5;
    return item.quantity <= threshold;
  });

  onView(): void {
    this.view.emit(this.item);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.item.id);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackImage;
  }
}
