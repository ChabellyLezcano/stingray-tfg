import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.css'],
})
export class ConfirmAccountComponent implements OnInit {
  // Token received from the route parameter
  token!: string;

  // Flag to indicate if the account confirmation was successful
  confirmSuccess: boolean = false;

  // Flag to indicate if the component is currently loading
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  // Lifecycle hook that is called when the component is initialized
  ngOnInit(): void {
    // Retrieve the token from the route parameter
    this.token = this.route.snapshot.paramMap.get('token') || '';

    this.confirmAccount();
  }

  // Method to confirm the user's account using the provided token
  confirmAccount() {
    this.authService.confirmAccount(this.token).subscribe({
      next: (response) => {
        if (response === true) {
          this.confirmSuccess = true;
        }
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
