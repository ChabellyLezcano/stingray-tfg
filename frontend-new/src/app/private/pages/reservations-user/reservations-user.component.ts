import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { MessageService } from 'primeng/api';
import {
  ReservationResponse,
  Reservation,
} from '../../interfaces/interfaces.interface';
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
  filteredReservations: Reservation[] = []; // Añadido para almacenar las reservas filtradas

  constructor(
    private reservationService: ReservationService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.isLoading = true;
    this.reservationService.getUserReservationHistory().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.ok) {
          this.reservations = response.reservations.sort(
            (a, b) =>
              new Date(b.reservationDate).getTime() -
              new Date(a.reservationDate).getTime(),
          );
          this.filteredReservations = this.reservations; // Inicializa las reservas filtradas
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

  paginate(event: any): void {
    const start = event.first;
    const end = event.first + event.rows;
    this.paginatedReservations = this.filteredReservations.slice(start, end); // Cambiado para usar reservas filtradas
  }

  applyFilter(filter: string): void {
    if (filter === 'all') {
      this.filteredReservations = this.reservations;
    } else {
      this.filteredReservations = this.reservations.filter(
        (reservation) => reservation.status === filter,
      );
    }
    this.totalRecords = this.filteredReservations.length;
    this.paginate({ first: 0, rows: this.pageSize }); // Reinicia la paginación al principio
  }

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
}
