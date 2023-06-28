import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [AuthService, NotificationService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    notificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with default values', () => {
    const formControls = component.loginForm.controls;
    expect(formControls.email).toBeInstanceOf(FormControl);
    expect(formControls.email.value).toBe('');
    expect(formControls.password).toBeInstanceOf(FormControl);
    expect(formControls.password.value).toBe('');
    expect(formControls.rememberMe).toBeInstanceOf(FormControl);
    expect(formControls.rememberMe.value).toBe(false);
  });

  it('should call authService.login() when form is submitted with valid inputs', () => {
    const loginSpy = spyOn(authService, 'login');
    const email = 'test@example.com';
    const password = 'password';
    const rememberMe = true;
    const data = {
      email,
      password,
      rememberMe,
    };
    component.loginForm.setValue(data);
    component.onLoginSubmit();
    expect(loginSpy).toHaveBeenCalledWith(data);
  });

  it('should display the error when email input is empty and touched', () => {
    component.email?.markAsTouched();
    fixture.detectChanges();
    const errorElement = fixture.nativeElement.querySelector('.email-error');
    expect(errorElement).toBeTruthy();
  });

  it('should display the error when password input is empty and touched', () => {
    component.password?.markAsTouched();
    fixture.detectChanges();
    const errorElement = fixture.nativeElement.querySelector('.password-error');
    expect(errorElement).toBeTruthy();
  });

  it('should display the error when the text of email is not valid and input is touched', () => {
    component.email?.markAsTouched();
    component.email?.setValue('Not valid text');
    fixture.detectChanges();
    const errorElement = fixture.nativeElement.querySelector('.email-error');
    expect(errorElement).toBeTruthy();
  });

  it('should display the error when the length of password less than 3 symbols and input is touched', () => {
    component.password?.markAsTouched();
    component.password?.setValue('1s');
    fixture.detectChanges();
    const errorElement = fixture.nativeElement.querySelector('.password-error');
    expect(errorElement).toBeTruthy();
  });

  it('should make the background of email`s input green when the text of the email is valid', () => {
    const emailInputElement = fixture.nativeElement.querySelector('#email');
    component.email?.markAsTouched();
    component.email?.setValue('helloWorld@gmail.com');
    fixture.detectChanges();
    const computedStyles = window.getComputedStyle(emailInputElement);
    const backgroundColor = computedStyles.getPropertyValue('background-color');
    expect(backgroundColor).toContain('rgba(96, 191, 44, 0.75)');
  });

  it('should make the background of password`s input green when the text of the password is valid', () => {
    const passwordInputElement =
      fixture.nativeElement.querySelector('#password');
    component.password?.markAsTouched();
    component.password?.setValue('51983gleb');
    fixture.detectChanges();
    const computedStyles = window.getComputedStyle(passwordInputElement);
    const backgroundColor = computedStyles.getPropertyValue('background-color');
    expect(backgroundColor).toContain('rgba(96, 191, 44, 0.75)');
  });

  xit('should navigate to "/" on successful sign in (valid email and password)', async () => {
    const email = 'p-pup1@mail.ru';
    const password = 'ntcn2614';
    const rememberMe = true;
    const signInBtn = fixture.nativeElement.querySelector('.signIn-btn');
    const data = {
      email,
      password,
      rememberMe,
    };
    component.loginForm.setValue(data);
    signInBtn.click();
    spyOn(authService, 'login').and.callFake(() => Promise.resolve());
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(authService.login).toHaveBeenCalledOnceWith(data);
    // expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
