import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent {
  responsiveOptions: any[];

  images: string[] = [
    '/assets/images/carousel-1.jpg',
    '/assets/images/carousel-2.jpg',
    '/assets/images/carousel-3.jpg',
    '/assets/images/carousel-4.jpg',
  ];

  constructor() {
    this.responsiveOptions = [
      {
        breakpoint: '999px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '595px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }
}
