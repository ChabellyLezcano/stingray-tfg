import { Component, OnInit } from '@angular/core';
import { BoardgameService } from '../../services/boardgame.service';
import { Boardgame } from '../../interfaces/games.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  boardgames: Boardgame[] = [];
  filteredBoardgames: any[] = [];
  paginatedBoardgames: any[] = [];
  isLoading: boolean = true;
  noResults: boolean = false;
  error: string | null = null;
  pageSize: number = 20;
  totalRecords: number = 0;

  constructor(
    private gameService: BoardgameService,
    private router: Router,
  ) {}

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

  handleFilter(criteria: string): void {
    if (criteria === 'latest') {
      this.filteredBoardgames.sort((a, b) => (a._id > b._id ? -1 : 1)); // Assuming _id is in order of creation
    } else if (criteria === 'alphabetical') {
      this.filteredBoardgames.sort((a, b) => a.title.localeCompare(b.title));
    }
    this.paginate({ first: 0, rows: this.pageSize });
  }

  paginate(event: any) {
    this.paginatedBoardgames = this.filteredBoardgames.slice(
      event.first,
      event.first + event.rows,
    );
  }

  navigateToGameDetails(gameId: string): void {
    console.log(`Navigating to game details with ID: ${gameId}`);
    this.router.navigate(['/game', gameId]);
  }
}
