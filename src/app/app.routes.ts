import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./features/user/user.module').then(module => module.UserModule),
      },
    ],
  },
];
