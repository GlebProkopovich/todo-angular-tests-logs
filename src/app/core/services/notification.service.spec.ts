import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { Notify } from '../models/notify.models';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let message: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService],
    });

    notificationService = TestBed.inject(NotificationService);
    message = 'Error message';
  });

  it('should be created', () => {
    expect(notificationService).toBeTruthy();
  });

  it('should initialize notify$ as null', () => {
    notificationService.notify$.subscribe((value) => {
      expect(value).toBeNull();
    });
  });

  it('should emit error notification', () => {
    const expectedNotify: Notify = { severity: 'error', message };

    notificationService.handleError(message);

    notificationService.notify$.subscribe((value) => {
      expect(value).toEqual(expectedNotify);
    });
  });

  it('should emit success notification', () => {
    const message = 'Success message';
    const expectedNotify: Notify = { severity: 'success', message };

    notificationService.handleSuccess(message);

    notificationService.notify$.subscribe((value) => {
      expect(value).toEqual(expectedNotify);
    });
  });

  it('should clear the notification', () => {
    notificationService.handleError(message);
    notificationService.clear();

    notificationService.notify$.subscribe((value) => {
      expect(value).toBeNull();
    });
  });
});
