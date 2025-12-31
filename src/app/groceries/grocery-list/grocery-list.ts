import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GroceryService } from '../../core/services/grocery.services';
import { Grocery } from '../../core/models/grocery.model';

@Component({    
  selector: 'app-grocery-list',
  standalone: true,
  templateUrl: './grocery-list.html',
  styleUrl: './grocery-list.scss'
})
export class GroceryListComponent {

  private readonly router = inject(Router);
  readonly groceryService = inject(GroceryService);

  viewDetail(item: Grocery):void{
    this.router.navigate(['/grocery',item.id]);
  }
} 
