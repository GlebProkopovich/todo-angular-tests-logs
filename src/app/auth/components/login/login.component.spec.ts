import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { LoggerService } from 'src/app/shared/services/logger.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let loginComponent: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let fakeEmailControl: FormControl;
  let fakePasswordControl: FormControl;
  let fakeRememberMeControl: FormControl;

  let fakeLoggerService = jasmine.createSpyObj('LoggerService', ['info']);
  let fakeAuthService = jasmine.createSpyObj('AuthService', ['login']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        {
          provide: LoggerService,
          useValue: fakeLoggerService,
        },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    loginComponent = fixture.componentInstance;

    fakeEmailControl = new FormControl('');
    fakePasswordControl = new FormControl('');
    fakeRememberMeControl = new FormControl(false);

    fakeAuthService = TestBed.inject(AuthService);
    fakeLoggerService = TestBed.inject(LoggerService);

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(loginComponent).toBeTruthy();
  });

  it('should initialize the login form with default values', () => {
    const formControls = loginComponent.loginForm.controls;
    expect(formControls.email.value).toBe('');
    expect(formControls.password.value).toBe('');
    expect(formControls.rememberMe.value).toBe(false);
  });

  it('should display the error when email input is empty and touched', () => {
    loginComponent.email?.markAsTouched();

    fixture.detectChanges();

    const emailError = fixture.debugElement.query(By.css('.email-error'));
    expect(emailError).toBeTruthy();
  });

  it('should display the error when password input is empty and touched', () => {
    loginComponent.password?.markAsTouched();

    fixture.detectChanges();

    const passwordError = fixture.debugElement.query(By.css('.password-error'));
    expect(passwordError).toBeTruthy();
  });

  it('should display the error when the text of email is not valid and input is touched', () => {
    loginComponent.email?.markAsTouched();
    fakeEmailControl.setValue('fail');

    fixture.detectChanges();

    const emailError = fixture.debugElement.query(By.css('.email-error'));
    expect(emailError).toBeTruthy();
  });

  it('should display the error when the length of password less than 3 symbols and input is touched', () => {
    loginComponent.password?.markAsTouched();
    fakePasswordControl.setValue('1s');

    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('.password-error');
    expect(errorElement).toBeTruthy();
  });

  it('should make the background of email`s input red when the text of the email is not valid', () => {
    const emailInputElement = fixture.nativeElement.querySelector('#email');
    loginComponent.email?.markAsTouched();
    fakeEmailControl.setValue('gleb@tut');

    fixture.detectChanges();

    const computedStyles = window.getComputedStyle(emailInputElement);
    const backgroundColor = computedStyles.getPropertyValue('background-color');
    expect(backgroundColor).toContain('rgba(191, 79, 97, 0.75)');
  });

  it('should make the background of password`s input red when the text of the password is not valid', () => {
    const passwordInputElement =
      fixture.nativeElement.querySelector('#password');
    loginComponent.password?.markAsTouched();
    fakePasswordControl.setValue('51');

    fixture.detectChanges();

    const computedStyles = window.getComputedStyle(passwordInputElement);
    const backgroundColor = computedStyles.getPropertyValue('background-color');
    expect(backgroundColor).toContain('rgba(191, 79, 97, 0.75)');
  });

  it('should update "rememberMe" property when checkbox is clicked', () => {
    const checkboxRememberMe = fixture.debugElement.query(By.css('#checkbox'));
    checkboxRememberMe.nativeElement.click();

    fixture.detectChanges();

    expect(loginComponent.loginForm.value.rememberMe).toBe(true);
  });

  it('should call onLoginSubmit() when inputs are valid and the button "Sign in" is clicked', () => {
    loginComponent.email?.setValue('gleb@tut.by');
    loginComponent.password?.setValue('1234567');

    fixture.detectChanges();

    const fakeOnLoginSubmit = spyOn(loginComponent, 'onLoginSubmit');
    const signInButton = fixture.debugElement.query(By.css('.signIn-btn'));
    signInButton.nativeElement.click();
    expect(fakeOnLoginSubmit).toHaveBeenCalled();
  });

  it('should call authService.login() when form is submitted', () => {
    loginComponent.onLoginSubmit();
    expect(fakeAuthService.login).toHaveBeenCalled();
  });

  it('should call loggerService.info() when form is submitted', () => {
    loginComponent.onLoginSubmit();
    expect(fakeLoggerService.info).toHaveBeenCalled();
  });
});
