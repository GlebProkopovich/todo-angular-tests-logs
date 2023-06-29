import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotifyComponent } from './components/notify/notify.component';
import { LoggerService } from './services/logger.service';

@NgModule({
  declarations: [NotifyComponent],
  imports: [CommonModule],
  exports: [NotifyComponent],
  providers: [LoggerService],
})
export class SharedModule {}
