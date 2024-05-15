import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-detail-layout',
  templateUrl: './detail-layout.component.html',
  styleUrls: ['./detail-layout.component.css'],
})
export class DetailLayoutComponent {
  constructor(public location: Location) {}
}
