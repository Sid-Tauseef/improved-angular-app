import { Injectable, signal, inject } from '@angular/core';
import { Grocery } from '../models/grocery.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroceryService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'https://grocery-api-psi.vercel.app/groceries';

  private readonly _groceries = signal<Grocery[]>([]);
  readonly groceries = this._groceries.asReadonly();

  load(): void {
    this.http.get<Grocery[]>(this.API_URL).subscribe({
      next: data => this._groceries.set(data),
      error: err => alert('Failed to load groceries: ' + err.message),
    });
  }

  getById(id: string): Observable<Grocery> {
    return this.http.get<Grocery>(`${this.API_URL}/${id}`);
  }

  add(input: Omit<Grocery, 'id'>): void {
    this.http.post<Grocery>(this.API_URL, input).subscribe({
      next: created => {
        this._groceries.update(list => [...list, created]);
      },
    });
  }

  delete(id: string): void {
    this.http.delete(`${this.API_URL}/${id}`).subscribe({
      next: () => {
        this._groceries.update(list => list.filter(item => item.id !== id));
      },
    });
  }

  update(id: string, changes: Partial<Omit<Grocery, 'id'>>): void {
    this.http.patch<Grocery>(`${this.API_URL}/${id}`, changes).subscribe({
      next: updated => {
        this._groceries.update(list =>
          list.map(item => (item.id === id ? updated : item))
        );
      },
    });
  }
}
