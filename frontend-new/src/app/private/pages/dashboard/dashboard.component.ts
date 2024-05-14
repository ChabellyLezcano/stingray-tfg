import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  boardgames: any[] = [];
  filteredBoardgames: any[] = [];
  isLoading: boolean = true; // Controla el estado de carga
  noResults: boolean = false; // Indica si no hay resultados
  error: string | null = null;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.loadGames();
  }

  private loadGames(): void {
    this.isLoading = true; // Comienza la carga
    this.gameService.getGames().subscribe({
      next: (response) => {
        this.isLoading = false; // Carga completada
        if (response.ok) {
          this.boardgames = response.boardgames;
          this.filteredBoardgames = [...this.boardgames];
        } else {
          this.error = response.msg || 'Failed to load games';
        }
      },
      error: (error) => {
        this.isLoading = false; // Carga completada
        console.error('Error fetching games:', error);
        this.error = 'Failed to load games';
      },
    });
  }

  handleSearch(searchText: string): void {
    if (!searchText) {
      this.filteredBoardgames = this.boardgames;
      this.noResults = false; // No se muestra "No results" cuando no hay texto de búsqueda
    } else {
      this.filteredBoardgames = this.boardgames.filter((bg) =>
        bg.title.toLowerCase().includes(searchText.toLowerCase()),
      );
      this.noResults = this.filteredBoardgames.length === 0; // Verificar si hay resultados
    }
  }
}
