import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoggerService } from 'src/app/shared/services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private loggerService: LoggerService
  ) {}
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    await this.authService.authRequest;
    const isAuth = this.authService.isAuth;
    if (!isAuth) {
      this.router.navigate(['/login']);
      this.loggerService.error(
        'User is not authorized, route to "/login"',
        'AuthGuard'
      );
    }
    return isAuth;
  }
}
