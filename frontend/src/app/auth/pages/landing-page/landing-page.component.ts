import { Component } from '@angular/core';
import {
  faGift,
  faLaughBeam,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent {
  // Declarar los íconos que se utilizarán en el componente
  faGift = faGift;
  faLaughBeam = faLaughBeam;
  faUsers = faUsers;

  constructor() {}

  ngOnInit(): void {}

  images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
}
