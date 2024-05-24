import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.css'],
})
export class ConfirmAccountComponent implements OnInit {
  token!: string;
  confirmSuccess: boolean = false;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
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
