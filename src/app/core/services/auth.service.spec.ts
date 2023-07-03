import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { LoggerService } from 'src/app/shared/services/logger.service';
import { RouterTestingModule } from '@angular/router/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { LoginRequestData } from '../models/auth.models';
import { environment } from 'src/environments/environment';
import { ResultCodeEnum } from '../enums/resultCode.enum';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;
  let loginData: LoginRequestData;
  let router: Router;

  let fakeLoggerService = jasmine.createSpyObj('loggerService', [
    'info',
    'warn',
    'error',
  ]);
  let fakeNotificationService = jasmine.createSpyObj('notificationService', [
    'handleError',
    'handleSuccess',
    'clear',
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: NotificationService, useValue: fakeNotificationService },
        { provide: LoggerService, useValue: fakeLoggerService },
      ],
    });

    loginData = {
      email: 'p-pup1@mail.ru',
      password: 'ntcn2614',
      rememberMe: true,
    };

    authService = TestBed.inject(AuthService);
    fakeNotificationService = TestBed.inject(NotificationService);
    fakeLoggerService = TestBed.inject(LoggerService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should set isAuth to true and route to "/" on successful login', () => {
    authService.login(loginData);

    const req = httpMock.expectOne(`${environment.baseUrl}/auth/login`);
    req.flush({ resultCode: ResultCodeEnum.success });

    expect(authService.isAuth).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should set isAuth to false and route to "/login" when called logout() function', () => {
    authService.logout();

    const req = httpMock.expectOne(`${environment.baseUrl}/auth/login`);
    req.flush({ resultCode: ResultCodeEnum.success });

    expect(authService.isAuth).toBeFalsy();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show error message when email and password are incorrect', () => {
    loginData = {
      email: 'asd',
      password: '1',
      rememberMe: false,
    };

    authService.login(loginData);
    const req = httpMock.expectOne(`${environment.baseUrl}/auth/login`);
    req.error(new ErrorEvent('Network error'));

    expect(fakeNotificationService.handleError).toHaveBeenCalled();
  });

  it('should set isAuth to true and log user authorization', () => {
    authService.me();

    const req = httpMock.expectOne(`${environment.baseUrl}/auth/me`);
    req.flush({ resultCode: ResultCodeEnum.success });

    expect(authService.isAuth).toBe(true);
  });

  it('should log warning when user is not authorized', () => {
    authService.me();

    const req = httpMock.expectOne(`${environment.baseUrl}/auth/me`);
    req.flush({ resultCode: ResultCodeEnum.error });

    expect(fakeLoggerService.warn).toHaveBeenCalled();
  });

  it('should log the error when logout failed', () => {
    authService.logout();

    const req = httpMock.expectOne(`${environment.baseUrl}/auth/login`);
    req.flush({ resultCode: ResultCodeEnum.error });

    expect(fakeLoggerService.error).toHaveBeenCalled();
  });

  it('should log the error when logout failed', () => {
    loginData = {
      email: 'gleb@tut',
      password: '123456',
      rememberMe: true,
    };
    authService.login(loginData);

    const req = httpMock.expectOne(`${environment.baseUrl}/auth/login`);
    req.flush({
      resultCode: ResultCodeEnum.error,
      messages: 'Invalid credentials',
    });

    expect(fakeLoggerService.error).toHaveBeenCalled();
  });
});
