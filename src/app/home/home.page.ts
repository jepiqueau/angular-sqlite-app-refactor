import { Component } from '@angular/core';
import { DetailService } from '../services/detail.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public detail: boolean;

  constructor(private _detailService: DetailService) {
  }
  ionViewWillEnter() {
    
      this.detail = this._detailService.get();
      console.log("**** ionViewWillEnter " + this.detail);

  }

}
