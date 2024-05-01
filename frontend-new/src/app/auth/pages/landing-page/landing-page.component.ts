import { Component } from '@angular/core';
import { faUsers, faStar, faBrain } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent {
  faUsers = faUsers;
  faStar = faStar;
  faBrain = faBrain;
}
