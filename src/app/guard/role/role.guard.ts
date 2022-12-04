import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const userRole: string = this.authService.getRoleId();
    const permission = route.data["permission"];

    let canActivate: boolean;

    if (!permission) throw new Error('Permissions is not setup!');
    if (!permission.only.length) throw new Error('Roles are not setup!');

    canActivate = permission.only.includes(userRole);
    if (!canActivate) this.router.navigate([permission.redirectTo]);

    return canActivate;
  }

}
