import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { GroceryService } from '../../core/services/grocery.services';
import { Grocery } from '../../core/models/grocery.model';

@Component({
  selector: 'app-grocery-detail',
  standalone: true,
  templateUrl: './grocery-detail.html',
  styleUrl: './grocery-detail.scss',
})
export class GroceryDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private groceryService = inject(GroceryService);

  item?: Grocery;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (isNaN(id)) {
      this.router.navigate(['/']);
      return;
    }

    this.item = this.groceryService.getById(id);

    if (!this.item) {
      this.router.navigate(['/']);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
