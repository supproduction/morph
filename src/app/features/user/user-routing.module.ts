import { inject, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { UserService } from './services/user.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/user-list/user-list.component').then(module => module.UserListComponent),
  },
  {
    path: 'user/:id',
    loadComponent: () => import('./components/user/user.component').then(module => module.UserComponent),
    resolve: {
      user: (route: ActivatedRouteSnapshot) => inject(UserService).get(route.params['id']),
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }
