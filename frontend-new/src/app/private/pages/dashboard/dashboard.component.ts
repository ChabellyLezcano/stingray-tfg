import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Game } from '../../interfaces/interfaces.interface';
import { User } from 'src/app/auth/interface/authInterface';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  games: Game[] = [];
  filteredGames: Game[] = [];
  paginatedGames: Game[] = [];
  isLoading: boolean = true;
  noResults: boolean = false;
  error: string | null = null;
  pageSize: number = 20;
  totalRecords: number = 0;
  user!: User | null;

  constructor(
    private gameService: GameService,
    private authService: AuthService,
  ) {
    this.user = this.authService.user;
  }

  ngOnInit(): void {
    this.loadGames();
  }

  private loadGames(): void {
    this.isLoading = true;
    this.gameService.getGames().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.ok) {
          this.games = response.boardgames.sort((a, b) =>
            a.title.localeCompare(b.title),
          );
          this.filteredGames = [...this.games];
          this.totalRecords = this.filteredGames.length;
          this.paginate({ first: 0, rows: this.pageSize });
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
      this.filteredGames = this.games;
      this.noResults = false;
    } else {
      const searchTextLower = searchText.toLowerCase();
      this.filteredGames = this.games.filter(
        (bg) =>
          bg.title.toLowerCase().includes(searchTextLower) ||
          (bg.tags &&
            bg.tags.some((tag: string) =>
              tag.toLowerCase().includes(searchTextLower),
            )),
      );
      this.noResults = this.filteredGames.length === 0;
    }
    this.totalRecords = this.filteredGames.length;
    this.paginate({ first: 0, rows: this.pageSize });
  }

  handleFilter(criteria: string): void {
    if (criteria === 'latest') {
      this.filteredGames.sort((a, b) => (a._id > b._id ? -1 : 1)); // Assuming _id is in order of creation
    } else if (criteria === 'alphabetical') {
      this.filteredGames.sort((a, b) => a.title.localeCompare(b.title));
    } else if (criteria === 'available') {
      this.filteredGames = this.games.filter(
        (game) => game.status === 'Available',
      );
    }
    this.totalRecords = this.filteredGames.length;
    this.paginate({ first: 0, rows: this.pageSize });
  }

  paginate(event: any): void {
    const start = event.first;
    const end = event.first + event.rows;
    this.paginatedGames = this.filteredGames.slice(start, end);
  }

  deleteBoardgame(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
    }).then((result) => {
      if (result.isConfirmed) {
        this.gameService.deleteGame(id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El juego ha sido eliminado.', 'success');
            this.loadGames();
          },
          error: (error) => {
            console.error('Error deleting game:', error);
            Swal.fire(
              'Error',
              error ||
                'Hubo un problema al eliminar el juego. Inténtalo de nuevo más tarde.',
              'error',
            );
          },
        });
      }
    });
  }
}
