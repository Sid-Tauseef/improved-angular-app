import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { GroceryService } from '../../core/services/grocery.services';
import { Grocery } from '../../core/models/grocery.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grocery-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grocery-detail.html',
  styleUrl: './grocery-detail.scss',
})
export class GroceryDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private groceryService = inject(GroceryService);

  item?: Grocery;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if(!id){
      this.router.navigate(['/']);
      return;
    }  

    this.item = this.groceryService.getById(id);

    if(!this.item){
      this.router.navigate(['/']);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  deleteItem(): void {
    if(!this.item) return;

    const confirmed = confirm(`Are you sure you want to delete "${this.item.name}"?`);

    if(!confirmed) return;

    this.groceryService.delete(this.item.id);
    this.router.navigate(['/']);
  }
}
