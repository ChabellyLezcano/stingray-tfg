import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { ReviewService } from '../../services/review.service';
import { MessageService } from 'primeng/api';
import { Reservation } from '../../interfaces/interfaces.interface';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservations-user',
  templateUrl: './reservations-user.component.html',
  styleUrls: ['./reservations-user.component.css'],
})
export class ReservationsUserComponent implements OnInit {
  reservations: Reservation[] = [];
  paginatedReservations: Reservation[] = [];
  isLoading: boolean = true;
  pageSize: number = 20;
  totalRecords: number = 0;
  filteredReservations: Reservation[] = [];
  reviewsMap: { [gameId: string]: boolean } = {};

  constructor(
    private reservationService: ReservationService,
    private reviewService: ReviewService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  // Method to load reservations
  loadReservations(): void {
    this.isLoading = true;
    this.reservationService.getUserReservationHistory().subscribe({
      next: async (response) => {
        this.isLoading = false;
        if (response.ok) {
          this.reservations = response.reservations.sort(
            (a, b) =>
              new Date(b.reservationDate).getTime() -
              new Date(a.reservationDate).getTime(),
          );
          await this.checkReviewsForReservations();
          this.filteredReservations = this.reservations;
          this.totalRecords = this.filteredReservations.length;
          this.paginate({ first: 0, rows: this.pageSize });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.msg || 'Failed to load reservations',
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching reservations:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load reservations',
        });
      },
    });
  }

  // Method to cancel reservations
  cancelReservation(reservationId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar reserva',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationService.cancelReservation(reservationId).subscribe({
          next: (response) => {
            if (response.ok) {
              this.messageService.add({
                severity: 'success',
                summary: 'Reserva cancelada',
                detail: response.msg,
              });
              this.loadReservations();
            } else {
              Swal.fire(
                'Error',
                response.msg || 'Hubo un problema al cancelar la reserva.',
                'error',
              );
            }
          },
          error: (error) => {
            console.error('Error canceling reservation:', error);
            Swal.fire(
              'Error',
              error ||
                'Hubo un problema al cancelar la reserva. Inténtalo de nuevo más tarde.',
              'error',
            );
          },
        });
      }
    });
  }

  // Method to check if user has reviewed a game
  checkIfUserHasReview(gameId: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.reviewService.userHasReview(gameId).subscribe({
        next: (response) => {
          resolve(response.hasReview ?? false);
        },
        error: (error) => {
          console.error('Error checking if user has review:', error);
          resolve(false);
        },
      });
    });
  }

  // Method to handle pagination
  paginate(event: any): void {
    const start = event.first;
    const end = event.first + event.rows;
    this.paginatedReservations = this.filteredReservations.slice(start, end);
  }

  // Method to apply filters
  applyFilter(filter: string): void {
    if (filter === 'all') {
      this.filteredReservations = this.reservations;
    } else {
      this.filteredReservations = this.reservations.filter(
        (reservation) => reservation.status === filter,
      );
    }
    this.totalRecords = this.filteredReservations.length;
    this.paginate({ first: 0, rows: this.pageSize });
  }

  // Function to check reviews for a game
  async checkReviewsForReservations() {
    for (const reservation of this.reservations) {
      const hasReview = await this.checkIfUserHasReview(
        reservation.boardGameId._id,
      );
      this.reviewsMap[reservation.boardGameId._id] = hasReview;
    }
  }
}
