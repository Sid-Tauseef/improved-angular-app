import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroceryService } from '../../core/services/grocery.services';
import { Grocery } from '../../core/models/grocery.model';
import { CommonModule } from '@angular/common';

@Component({    
  selector: 'app-grocery-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grocery-list.html',
  styleUrl: './grocery-list.scss'
})

export class GroceryListComponent implements OnInit {

  private readonly router = inject(Router);
  readonly groceryService = inject(GroceryService);


  ngOnInit(): void {
    this.groceryService.load();
  }

  viewDetail(item: Grocery):void{
    this.router.navigate(['/grocery',item.id]);
  }

  addItem(
    name:string,
    quantity:string,
    image?:string
  ):void{
      this.groceryService.add({
        name:name.trim(),
        quantity:Number(quantity),
        image: image?.trim() || undefined
      });
  }

  deleteItem(id:string , event: Event):void{
    event.stopPropagation();
    
    const confirmed = confirm('Are you sure you want to delete this item?');
    if(!confirmed){
      return;
    }
    
    this.groceryService.delete(id);
  }
} 
