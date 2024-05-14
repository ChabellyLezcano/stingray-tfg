import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  boardgames: any[] = [];
  filteredBoardgames: any[] = [];
  paginatedBoardgames: any[] = [];
  isLoading: boolean = true;
  noResults: boolean = false;
  error: string | null = null;
  pageSize: number = 20;
  totalRecords: number = 0;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.loadGames();
  }

  private loadGames(): void {
    this.isLoading = true;
    this.gameService.getGames().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.ok) {
          this.boardgames = response.boardgames;
          this.filteredBoardgames = [...this.boardgames];
          this.totalRecords = this.filteredBoardgames.length;
          this.paginate({ first: 0, rows: this.pageSize });
          console.info(this.boardgames);
        } else {
          this.error = response.msg || 'Failed to load games';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching games:', error);
        this.error = 'Failed to load games';
      },
    });
  }

  handleSearch(searchText: string): void {
    if (!searchText) {
      this.filteredBoardgames = this.boardgames;
      this.noResults = false;
    } else {
      const searchTextLower = searchText.toLowerCase();
      this.filteredBoardgames = this.boardgames.filter(
        (bg) =>
          bg.title.toLowerCase().includes(searchTextLower) ||
          (bg.tags &&
            bg.tags.some((tag: string) =>
              tag.toLowerCase().includes(searchTextLower),
            )),
      );
      this.noResults = this.filteredBoardgames.length === 0;
    }
    this.totalRecords = this.filteredBoardgames.length;
    this.paginate({ first: 0, rows: this.pageSize });
  }

  paginate(event: any) {
    this.paginatedBoardgames = this.filteredBoardgames.slice(
      event.first,
      event.first + event.rows,
    );
  }
}
