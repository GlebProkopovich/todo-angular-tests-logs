import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Observable } from 'rxjs';
import { Notify } from 'src/app/core/models/notify.models';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'tl-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.css'],
})
export class NotifyComponent implements OnInit {
  notify$?: Observable<Notify | null>;

  constructor(
    private notificationService: NotificationService,
    private loggerService: LoggerService
  ) {}

  ngOnInit(): void {
    this.notify$ = this.notificationService.notify$;
  }

  closeNotification() {
    this.notificationService.clear();
    this.loggerService.info('Notification closed', 'NotifyComponent');
  }
}
