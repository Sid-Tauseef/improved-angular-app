import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Grocery } from '../../core/models/grocery.model';
import { GroceryService } from '../../core/services/grocery.services';
import { AsyncPipe } from '@angular/common';

@Component({    
  selector: 'app-grocery-list',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './grocery-list.html',
  styleUrl: './grocery-list.scss'
})
export class GroceryListComponent {

  groceries$!: Observable<Grocery[]>;

  constructor(
    private readonly groceryService: GroceryService,
    private readonly router: Router
  ) {
    this.groceries$ = this.groceryService.getAll();
  }

  viewDetail(item: Grocery): void {
    this.router.navigate(['/grocery', item.id]);
  }
}
