import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationService } from './notification.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ResultCodeEnum } from '../enums/resultCode.enum';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AuthService,
        {
          provide: NotificationService,
        },
      ],
    });
    authService = TestBed.inject(AuthService);
    notificationService = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should set isAuth to true and route to "/" on successful login', () => {
    const loginData = {
      email: 'p-pup1@mail.ru',
      password: 'ntcn2614',
      rememberMe: true,
    };
    const responseData = {
      data: {
        userId: 24083,
      },
      messages: [],
      fieldsErrors: [],
      resultCode: ResultCodeEnum.success,
    };

    const routerSpy = spyOn(router, 'navigate');

    authService.login(loginData);

    const req = httpMock.expectOne(`${environment.baseUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(responseData);

    expect(authService.isAuth).toBe(true);

    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });

  it('should set isAuth to true if the user is logged (/auth/me) request', () => {
    authService.me();

    const req = httpMock.expectOne(`${environment.baseUrl}/auth/me`);
    expect(req.request.method).toBe('GET');
    const responseData = {
      data: {
        id: 24083,
        login: 'pavel_ishmukov',
        email: 'p-pup1@mail.ru',
      },
      messages: [],
      fieldsErrors: [],
      resultCode: ResultCodeEnum.success,
    };
    req.flush(responseData);

    expect(authService.isAuth).toBe(true);
  });

  it('should set isAuth to false and route to "/login" on successful logout', () => {
    const responseData = {
      resultCode: ResultCodeEnum.success,
      messages: [],
      fieldsErrors: [],
    };

    const routerSpy = spyOn(router, 'navigate');

    authService.logout();

    const req = httpMock.expectOne(`${environment.baseUrl}/auth/login`);
    expect(req.request.method).toBe('DELETE');

    req.flush(responseData);

    expect(authService.isAuth).toBe(false);

    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should handle login error and show error notification when written email is not valid', () => {
    const loginData = {
      email: 'hello',
      password: 'world',
      rememberMe: true,
    };
    const responseData = {
      data: {},
      messages: ['Enter valid Email'],
      fieldsErrors: [
        {
          field: 'email',
          error: 'Enter valid Email',
        },
      ],
      resultCode: ResultCodeEnum.error,
    };
    const errorMessage = 'Enter valid Email';

    spyOn(notificationService, 'handleError');

    authService.login(loginData);

    const req = httpMock.expectOne(`${environment.baseUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(responseData);

    expect(notificationService.handleError).toHaveBeenCalledWith(errorMessage);
  });
});
