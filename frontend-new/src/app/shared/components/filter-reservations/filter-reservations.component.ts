import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-filter-reservations',
  templateUrl: './filter-reservations.component.html',
  styleUrls: ['./filter-reservations.component.css'],
})
export class FilterReservationsComponent {
  @Output() filter = new EventEmitter<string>();
  @Input() selectedFilter: string = 'all';

  filterOptions = [
    { label: 'Todas', value: 'all' },
    { label: 'Aceptadas', value: 'Accepted' },
    { label: 'Canceladas', value: 'Cancelled' },
    { label: 'Completadas', value: 'Completed' },
    { label: 'Expiradas', value: 'Expired' },
    { label: 'Pendientes', value: 'Pending' },
    { label: 'Rechazadas', value: 'Rejected' },
    { label: 'Recogidas', value: 'Picked Up' },
  ];

  applyFilter(): void {
    this.filter.emit(this.selectedFilter);
  }
}
