import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardgameService } from '../../services/boardgame.service';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/auth/interface/authInterface';
import { MessageService } from 'primeng/api'; // Importa el servicio de mensajes

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css'],
  providers: [MessageService], // Añade el servicio de mensajes a los proveedores
})
export class GameDetailsComponent implements OnInit {
  gameId: string;
  user!: User | null;
  boardgame: any;
  isLoading: boolean = true;
  error: string | null = null;
  isFavorite: boolean = false;

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private boardgameService: BoardgameService,
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private messageService: MessageService, // Inyecta el servicio de mensajes
  ) {
    this.gameId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.user = this.authService.user;
    this.loadGameDetails();
    this.checkIfFavorite();
  }

  private loadGameDetails(): void {
    this.isLoading = true;
    this.boardgameService.getGameById(this.gameId).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.ok) {
          this.boardgame = response.boardgame;
        } else {
          this.error = response.msg || 'Failed to load game details';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching game details:', error);
        this.error = 'Failed to load game details';
      },
    });
  }

  private checkIfFavorite(): void {
    this.favoriteService.isGameFavorite(this.gameId).subscribe({
      next: (response) => {
        if (response.ok) {
          this.isFavorite = response.isFavorite;
        }
      },
      error: (error) => {
        console.error('Error checking if game is favorite:', error);
      },
    });
  }

  addToFavorites(): void {
    this.favoriteService.addGameToFavorites(this.gameId).subscribe({
      next: (response) => {
        if (response.ok) {
          this.isFavorite = true;
          this.messageService.add({
            severity: 'success',
            summary: '¡Juego añadido a favoritos!',
            detail: 'El juego ha sido añadido a favoritos exitosamente',
          });
        }
      },
      error: (error) => {
        console.error('Error adding game to favorites:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un problema al añadir el juego a tus favoritos.',
        });
      },
    });
  }

  removeFromFavorites(): void {
    this.favoriteService.removeGameFromFavorites(this.gameId).subscribe({
      next: (response) => {
        if (response.ok) {
          this.isFavorite = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado de Favoritos',
            detail: 'El juego ha sido eliminado de tus favoritos.',
          });
        }
      },
      error: (error) => {
        console.error('Error removing game from favorites:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un problema al eliminar el juego de tus favoritos.',
        });
      },
    });
  }
}