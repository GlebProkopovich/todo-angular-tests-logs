import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommonResponseType } from 'src/app/core/models/core.models';
import { ResultCodeEnum } from 'src/app/core/enums/resultCode.enum';
import { Router } from '@angular/router';
import { LoginRequestData, MeResponse } from 'src/app/core/models/auth.models';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from 'src/app/core/services/notification.service';
import { LoggerService } from 'src/app/shared/services/logger.service';

@Injectable()
export class AuthService {
  isAuth = false;

  resolveAuthRequest: Function = () => {};

  authRequest = new Promise((resolve) => {
    this.resolveAuthRequest = resolve;
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService,
    private loggerService: LoggerService
  ) {}
  login(data: LoginRequestData) {
    this.http
      .post<CommonResponseType<{ userId: number }>>(
        `${environment.baseUrl}/auth/login`,
        data
      )
      .pipe(catchError(this.errorHandler.bind(this)))
      .subscribe((res) => {
        if (res.resultCode === ResultCodeEnum.success) {
          this.isAuth = true;
          this.router.navigate(['/']);
          this.loggerService.info(
            'Successful login, route to "/"',
            'AuthService'
          );
        } else {
          this.notificationService.handleError(res.messages[0]);
          this.loggerService.error(
            `Showed the error: ${res.messages[0]}`,
            'AuthService'
          );
        }
      });
  }
  logout() {
    this.http
      .delete<CommonResponseType>(`${environment.baseUrl}/auth/login`)
      .pipe(catchError(this.errorHandler.bind(this)))
      .subscribe((res) => {
        if (res.resultCode === ResultCodeEnum.success) {
          this.router.navigate(['/login']);
          this.loggerService.info(
            'Successful logout, route to "/login"',
            'AuthService'
          );
        } else {
          this.loggerService.error(
            'Logout error, something went wrong...',
            'AuthService'
          );
        }
      });
  }

  me() {
    this.http
      .get<CommonResponseType<MeResponse>>(`${environment.baseUrl}/auth/me`)
      .pipe(catchError(this.errorHandler.bind(this)))
      .subscribe((res) => {
        if (res.resultCode === ResultCodeEnum.success) {
          this.isAuth = true;
          this.loggerService.info('User is authorized', 'AuthService');
        } else {
          this.loggerService.warn('User is not authorized', 'AuthService');
        }
        this.resolveAuthRequest();
      });
  }
  private errorHandler(err: HttpErrorResponse) {
    this.notificationService.handleError(err.message);
    return EMPTY;
  }
}
