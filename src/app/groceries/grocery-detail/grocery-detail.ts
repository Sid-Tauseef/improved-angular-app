import { Component, computed, inject } from '@angular/core';
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

  // item?: Grocery;
  private readonly id = this.route.snapshot.paramMap.get('id');

  readonly item = computed<Grocery | undefined>(()=>{
    if(!this.id) return undefined;
    return this.groceryService.groceries().find(g=> g.id === this.id);
  });

  isEditing = false;

  editedName = '';
  editedQuantity = 0;
  editedImage = '';

  constructor() {
    if(!this.id){
      this.router.navigate(['/']);
    } 
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  deleteItem(): void {
    const current = this.item();
    if(!current) return;

    const confirmed = confirm(`Are you sure you want to delete "${current.name}"?`);

    if(!confirmed) return;

    this.groceryService.delete(current.id);
    this.router.navigate(['/']);
  }


  startEdit():void{
    const current = this.item();
    if(!current) return;

    this.editedName = current.name;
    this.editedQuantity = current.quantity;
    this.editedImage = current.image || '';
    this.isEditing = true;
  }

  cancelEdit():void{
    this.isEditing = false;
  }

  saveEdit():void{
    const current = this.item();
    if(!current) return;

    if(!this.editedName.trim() || this.editedQuantity <=0){
      alert("Invalid Values Provided");
      return;
    }

    this.groceryService.update(current.id,{
      name: this.editedName.trim(),
      quantity: this.editedQuantity,
      image: this.editedImage.trim() || undefined
    });

    this.isEditing = false;
  }
}
