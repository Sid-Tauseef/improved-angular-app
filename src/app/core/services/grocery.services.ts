import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Grocery } from '../models/grocery.model';

@Injectable({
  providedIn: 'root'
})
export class GroceryService {
  // initial in-memory dataset (matches assignment hint)
  private initialData: Grocery[] = [
    {
      id: 1,
      name: 'Apple',
      quantity: 5,
      image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=60'
    },
    {
      id: 2,
      name: 'Milk',
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1634141510639-d691d86f47be?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWlsa3xlbnwwfHwwfHx8MA%3D%3D'
    },
    {
      id: 3,
      name: 'Bread',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  ];

  // internal subject holding the current list
  private groceries$ = new BehaviorSubject<Grocery[]>([...this.initialData]);

  constructor() {}

  // Observable stream for components to subscribe to
  getAll(): Observable<Grocery[]> {
    return this.groceries$.asObservable();
  }

  getById(id: number): Grocery | undefined {
    return this.groceries$.getValue().find(g => g.id === id);
  }

  add(grocery: Omit<Grocery, 'id'>): Grocery {
    const list = this.groceries$.getValue();
    const nextId = list.length ? Math.max(...list.map(i => i.id)) + 1 : 1;
    const newItem: Grocery = { id: nextId, ...grocery };
    this.groceries$.next([...list, newItem]);
    return newItem;
  }

  delete(id: number): void {
    const list = this.groceries$.getValue();
    this.groceries$.next(list.filter(i => i.id !== id));
  }

  // replace/update if needed later
  update(updated: Grocery): void {
    const list = this.groceries$.getValue().map(i => i.id === updated.id ? updated : i);
    this.groceries$.next(list);
  }
}
