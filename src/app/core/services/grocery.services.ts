import { Injectable, signal, computed } from '@angular/core';
import { Grocery } from '../models/grocery.model';

@Injectable({
  providedIn: 'root'
})
export class GroceryService {
  // initial in-memory dataset (matches assignment hint)
  private readonly _groceries = signal<Grocery[]>([
    {
      id: '1',
      name: 'Apple',
      quantity: 5,
      image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=60'
    },
    {
      id: '2',
      name: 'Milk',
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1634141510639-d691d86f47be?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWlsa3xlbnwwfHwwfHx8MA%3D%3D'
    },
    {
      id: '3',
      name: 'Bread',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  ]);


  readonly groceries = computed(() => this._groceries());

  constructor() { }


  getAll(): Grocery[] {
    return this._groceries();
  }


  getById(id: string): Grocery | undefined {
    return this._groceries().find(g => g.id === id)
  }




  add(input: Omit<Grocery, 'id'>): void {
    if (!input.name.trim() || input.quantity <= 0) {
      return;
    }

    const newItem: Grocery = {
      ...input,
      id: crypto.randomUUID()
    };

    this._groceries.update(list => [...list, newItem]);
  }

  delete(id: string): void {
    this._groceries.update(list => list.filter(g => g.id !== id));
  }
}
