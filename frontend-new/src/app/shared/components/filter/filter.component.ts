import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent {
  @Output() filter = new EventEmitter<string>();

  filterOptions = [
    { label: 'Orden alfabético', value: 'alphabetical' },
    { label: 'Últimos agregados', value: 'latest' },
  ];

  selectedFilter: string = 'alphabetical';

  applyFilter(): void {
    this.filter.emit(this.selectedFilter);
  }
}
