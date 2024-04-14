import { Component } from '@angular/core';
import { faInfoCircle, faEnvelope, faGavel } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  faInfoCircle = faInfoCircle;
  faEnvelope = faEnvelope;
  faGavel = faGavel;
}
