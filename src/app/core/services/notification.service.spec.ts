import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { Notify } from '../models/notify.models';

describe('NotificationService', () => {
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService],
    });
    notificationService = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(notificationService).toBeTruthy();
  });

  it('method handleError should emit a success notification', () => {
    const successMessage = 'Action completed successfully';

    notificationService.handleSuccess(successMessage);

    notificationService.notify$.subscribe((notification: Notify | null) => {
      expect(notification).toBeTruthy();
      expect(notification!.severity).toBe('success');
      expect(notification!.message).toBe(successMessage);
    });
  });

  it('method handleSuccess should emit a success notification', () => {
    const successMessage = 'Action completed successfully';

    notificationService.handleSuccess(successMessage);

    notificationService.notify$.subscribe((notification: Notify | null) => {
      expect(notification).toBeTruthy();
      expect(notification!.severity).toBe('success');
      expect(notification!.message).toBe(successMessage);
    });
  });

  it('method clear should clear the notification', () => {
    const errorMessage = 'An error occurred';

    notificationService.handleError(errorMessage);

    notificationService.clear();

    notificationService.notify$.subscribe((notification: Notify | null) => {
      expect(notification).toBeNull();
    });
  });
});
