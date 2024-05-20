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
  isLoading: boolean = true;
  pageSize: number = 20;
  totalRecords: number = 0;
  currentPage: number = 1;

  constructor(
    private reservationService: ReservationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadAdminReservations(this.currentPage);
  }

  loadAdminReservations(page: number): void {
    this.isLoading = true;
    this.reservationService
      .getAdminReservationHistory(page, this.pageSize)
      .subscribe({
        next: (response) => {
          console.log(response);
          if (response.ok) {
            this.reservations = response.reservations;
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
          console.error('Error fetching reservations:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load reservations',
          });
        },
      });
  }

  paginate(event: any): void {
    this.currentPage = event.page + 1;
    this.loadAdminReservations(this.currentPage);
  }

  // Methods for accepting, rejecting, marking as picked up, marking as completed, deleting reservations

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
              this.loadAdminReservations(this.currentPage);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.msg || 'Failed to accept reservation',
              });
            }
          },
          error: (error) => {
            console.error('Error accepting reservation:', error);
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

  rejectReservation(reservationId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres rechazar esta reserva?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationService.rejectReservation(reservationId).subscribe({
          next: (response) => {
            if (response.ok) {
              this.messageService.add({
                severity: 'success',
                summary: 'Reserva rechazada',
                detail: response.msg,
              });
              this.loadAdminReservations(this.currentPage);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.msg || 'Failed to reject reservation',
              });
            }
          },
          error: (error) => {
            console.error('Error rejecting reservation:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to reject reservation',
            });
          },
        });
      }
    });
  }

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
              this.loadAdminReservations(this.currentPage);
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
            console.error('Error marking reservation as picked up:', error);
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
              this.loadAdminReservations(this.currentPage);
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
            console.error('Error marking reservation as completed:', error);
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

  deleteReservation(reservationId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar reserva',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationService.deleteReservation(reservationId).subscribe({
          next: (response) => {
            if (response.ok) {
              this.messageService.add({
                severity: 'success',
                summary: 'Reserva eliminada',
                detail: response.msg,
              });
              this.reservations = this.reservations.filter(
                (reservation) => reservation._id !== reservationId,
              );
              this.totalRecords;
              this.totalRecords--;
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.msg || 'Failed to delete reservation',
              });
            }
          },
          error: (error) => {
            console.error('Error deleting reservation:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete reservation',
            });
          },
        });
      }
    });
  }
}
