import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { MessageService } from 'primeng/api';
import { Reservation } from '../../interfaces/interfaces.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservations-admin',
  templateUrl: './reservations-admin.component.html',
  styleUrls: ['./reservations-admin.component.css'],
  providers: [MessageService],
})
export class ReservationsAdminComponent implements OnInit {
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  isLoading: boolean = true;
  pageSize: number = 20;
  totalRecords: number = 0;
  currentPage: number = 1;
  displayRejectModal: boolean = false;
  selectedReservationId: string = '';
  rejectionMessage: string = '';
  selectedFilter: string = 'all';

  constructor(
    private reservationService: ReservationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadAdminReservations(this.currentPage);
  }

  // Method to load admin reservations
  loadAdminReservations(page: number, status: string = 'all'): void {
    this.isLoading = true;
    this.reservationService
      .getAdminReservationHistory(page, this.pageSize, status)
      .subscribe({
        next: (response) => {
          if (response.ok) {
            this.reservations = response.reservations;
            this.filteredReservations = response.reservations;
            this.totalRecords = response.totalRecords;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.msg || 'Failed to load reservations',
            });
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load reservations',
          });
        },
      });
  }

  // Method to accept reservation
  acceptReservation(reservationId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres aprobar esta reserva?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationService.acceptReservation(reservationId).subscribe({
          next: (response) => {
            if (response.ok) {
              this.messageService.add({
                severity: 'success',
                summary: 'Reserva aprobada',
                detail: response.msg,
              });
              this.loadAdminReservations(this.currentPage, this.selectedFilter); // Pasar el filtro seleccionado
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.msg || 'Failed to accept reservation',
              });
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to accept reservation',
            });
          },
        });
      }
    });
  }

  // Method to reject reservation
  rejectReservation(): void {
    if (this.rejectionMessage.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Rejection message is required',
      });
      return;
    }

    this.reservationService
      .rejectReservation(this.selectedReservationId, this.rejectionMessage)
      .subscribe({
        next: (response) => {
          if (response.ok) {
            this.messageService.add({
              severity: 'success',
              summary: 'Reserva rechazada',
              detail: response.msg,
            });
            this.loadAdminReservations(this.currentPage, this.selectedFilter);
            this.displayRejectModal = false;
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.msg || 'Failed to reject reservation',
            });
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to reject reservation',
          });
        },
      });
  }

  // Method to mark a game as picked up
  markAsPickedUp(reservationId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres marcar esta reserva como recogida?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, marcar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationService.markAsPickedUp(reservationId).subscribe({
          next: (response) => {
            if (response.ok) {
              this.messageService.add({
                severity: 'success',
                summary: 'Reserva marcada como recogida',
                detail: response.msg,
              });
              this.loadAdminReservations(this.currentPage, this.selectedFilter);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  response.msg || 'Failed to mark reservation as picked up',
              });
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to mark reservation as picked up',
            });
          },
        });
      }
    });
  }

  // Method to mark a game as completed
  markAsCompleted(reservationId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres marcar esta reserva como completada?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, marcar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationService.markAsCompleted(reservationId).subscribe({
          next: (response) => {
            if (response.ok) {
              this.messageService.add({
                severity: 'success',
                summary: 'Reserva marcada como completada',
                detail: response.msg,
              });
              this.loadAdminReservations(this.currentPage, this.selectedFilter); // Pasar el filtro seleccionado
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  response.msg || 'Failed to mark reservation as completed',
              });
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to mark reservation as completed',
            });
          },
        });
      }
    });
  }

  // Method to delete a reservation
  deleteReservation(reservationId: string): void {
    this.openRejectModal(reservationId);
  }

  // Method to apply filter
  applyFilter(filter: string): void {
    this.selectedFilter = filter;
    this.loadAdminReservations(this.currentPage, this.selectedFilter);
  }

  // Method to handle pagination
  paginate(event: any): void {
    this.currentPage = event.page + 1;
    this.loadAdminReservations(this.currentPage, this.selectedFilter);
  }

  // Method to open the rejection reservation modal
  openRejectModal(reservationId: string): void {
    this.selectedReservationId = reservationId;
    this.rejectionMessage = '';
    this.displayRejectModal = true;
  }
}
