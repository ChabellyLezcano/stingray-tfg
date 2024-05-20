import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
})
export class PaginatorComponent {
  @Input() totalRecords: number = 0;
  @Input() pageSize: number = 20;
  @Input() currentPage: number = 1;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  get pages(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }
}
