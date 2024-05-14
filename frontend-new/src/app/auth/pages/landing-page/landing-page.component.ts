import { Component } from '@angular/core';
import { faUsers, faStar, faBrain } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent {
  images: any[];

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  constructor() {
    this.images = [
      { src: '../../../../assets/images/landing-1.jpg' },
      { src: '../../../../assets/images/landing-2.jpg' },
      { src: '../../../../assets/images/landing-3.jpg' },
      { src: '../../../../assets/images/landing-4.jpg' },
    ];
  }
}
