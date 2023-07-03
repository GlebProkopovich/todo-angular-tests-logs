import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotifyComponent } from './notify.component';
import { NotificationService } from 'src/app/core/services/notification.service';
import { of } from 'rxjs';
import { LoggerService } from '../../services/logger.service';
import { By } from '@angular/platform-browser';

describe('NotifyComponent', () => {
  let notifyComponent: NotifyComponent;
  let fixture: ComponentFixture<NotifyComponent>;

  let fakeNotificationService = jasmine.createSpyObj('notificationService', [
    'handleError',
    'handleSuccess',
    'clear',
  ]);
  let fakeLoggerService = jasmine.createSpyObj('LoggerService', ['info']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotifyComponent],
      providers: [
        { provide: NotificationService, useValue: fakeNotificationService },
        { provide: LoggerService, useValue: fakeLoggerService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyComponent);
    notifyComponent = fixture.componentInstance;

    fakeNotificationService = TestBed.inject(NotificationService);
    fakeLoggerService = TestBed.inject(LoggerService);

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(notifyComponent).toBeTruthy();
  });

  it('should not render the notification message when notify$ is null', () => {
    notifyComponent.notify$ = of(null);
    fixture.detectChanges();

    const notificationElement = fixture.debugElement.query(
      By.css('.notificiation')
    );

    expect(notificationElement).toBeNull();
  });

  // it('should render notification message when notify$ has some value', () => {
  //   notifyComponent.notify$ = of({
  //     message: 'Some error',
  //     severity: 'error',
  //   });
  //   fixture.detectChanges();

  //   const notificationElement = fixture.debugElement.query(
  //     By.css('.notification')
  //   );

  //   expect(notificationElement).toBeTruthy();
  // });

  it('should call notificationService.clear() when closeNotification is called', () => {
    notifyComponent.closeNotification();
    expect(fakeNotificationService.clear).toHaveBeenCalled();
  });
});
