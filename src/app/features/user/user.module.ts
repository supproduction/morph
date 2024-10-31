import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserService } from './services/user.service';
import { UsersService } from './services/users.service';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
  ],
  providers: [UsersService, UserService],
})
export class UserModule { }
