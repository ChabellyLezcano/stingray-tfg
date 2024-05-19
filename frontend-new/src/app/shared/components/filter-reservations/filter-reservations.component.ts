import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filter-reservations',
  templateUrl: './filter-reservations.component.html',
  styleUrls: ['./filter-reservations.component.css'],
})
export class FilterReservationsComponent {
  @Output() filter = new EventEmitter<string>();

  filterOptions = [
    { label: 'Todos', value: 'all' },
    { label: 'Aceptadas', value: 'Accepted' },
    { label: 'Pendientes', value: 'Pending' },
    { label: 'Rechazadas', value: 'Rejected' },
    { label: 'Recogidas', value: 'Picked Up' },
    { label: 'Completadas', value: 'Completed' },
    { label: 'Canceladas', value: 'Cancelled' },
    { label: 'Expiradas', value: 'Expired' },
  ];

  selectedFilter: string = 'all';

  applyFilter(): void {
    this.filter.emit(this.selectedFilter);
  }
}
