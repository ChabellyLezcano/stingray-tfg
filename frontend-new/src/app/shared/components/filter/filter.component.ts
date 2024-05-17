import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent {
  @Output() filter = new EventEmitter<string>();

  filterOptions = [
    {
      label: 'Orden alfabético',
      value: 'alphabetical',
      icon: 'pi pi-sort-alpha-down',
    },
    { label: 'Últimos agregados', value: 'latest', icon: 'pi pi-clock' },
    { label: 'Disponibles', value: 'available', icon: 'pi pi-check' },
  ];

  selectedFilter: string = 'alphabetical';

  applyFilter(): void {
    this.filter.emit(this.selectedFilter);
  }
}
