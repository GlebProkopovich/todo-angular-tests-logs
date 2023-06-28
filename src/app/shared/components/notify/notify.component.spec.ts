import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotifyComponent } from './notify.component';
import { NotificationService } from 'src/app/core/services/notification.service';
import { of } from 'rxjs';

describe('NotifyComponent', () => {
  let notifyComponent: NotifyComponent;
  let fixture: ComponentFixture<NotifyComponent>;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotifyComponent],
      providers: [NotificationService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyComponent);
    notifyComponent = fixture.componentInstance;
    notificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(notifyComponent).toBeTruthy();
  });

  it('should not render the notification message when notify$ is null', () => {
    notifyComponent.notify$ = of(null);
    fixture.detectChanges();

    const notificationElement: HTMLElement =
      fixture.nativeElement.querySelector('.notification');

    expect(notificationElement).toBeNull();
  });

  it('should render notification message when notify$ has some value', () => {
    notifyComponent.notify$ = of({ message: 'Some error', severity: 'error' });
    fixture.detectChanges();

    const notificationElement: HTMLElement =
      fixture.nativeElement.querySelector('.notification');

    expect(notificationElement).toBeTruthy();
  });

  it('should call notificationService.clear() when closeNotification is called', () => {
    spyOn(notificationService, 'clear');
    notifyComponent.closeNotification();
    expect(notificationService.clear).toHaveBeenCalled();
  });
});
