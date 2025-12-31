import { Routes } from '@angular/router';
import { GroceryListComponent } from './groceries/grocery-list/grocery-list';
import { GroceryDetailComponent } from './groceries/grocery-detail/grocery-detail';

export const routes: Routes = [
  { path: '', component: GroceryListComponent },
  { path: 'grocery/:id', component: GroceryDetailComponent },
  { path: '**', redirectTo: '' },
];
