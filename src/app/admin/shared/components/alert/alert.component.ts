import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlertService, AlertType } from '../../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() delay = 5000;

  private alertSubscription$: Subscription;

  public text: string;
  public type: AlertType = 'success';

  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.alertSubscription$ = this.alertService.alert$.subscribe(
      (alert) => {
        this.text = alert.text;
        this.type = alert.type;

        const timeout = setTimeout(
          () => {
            clearTimeout(timeout);
            this.text = '';
          },
          5000
        );
      }
    );
  }

  ngOnDestroy(): void {
    this.alertSubscription$?.unsubscribe();
  }

}
