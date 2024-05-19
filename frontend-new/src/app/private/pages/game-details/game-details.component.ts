import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/auth/interface/authInterface';
import { MessageService } from 'primeng/api';
import { ReservationService } from '../../services/reservation.service';
import Swal from 'sweetalert2';
import { Game } from '../../interfaces/interfaces.interface';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css'],
  providers: [MessageService],
})
export class GameDetailsComponent implements OnInit {
  gameId: string;
  user!: User | null;
  game!: Game;
  isLoading: boolean = true;
  error: string | null = null;
  isFavorite: boolean = false;
  isReserved: boolean = false;

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
    private gameService: GameService,
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private reservationService: ReservationService,
    private messageService: MessageService,
  ) {
    this.gameId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.user = this.authService.user;
    this.loadGameDetails();
    this.checkIfFavorite();
    this.checkIfReservation();
  }

  private loadGameDetails(): void {
    this.isLoading = true;
    this.gameService.getGameById(this.gameId).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.ok) {
          this.game = response.boardgame;
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
          this.isFavorite = response.ok;
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
            detail: response.msg,
          });
        }
      },
      error: (error) => {
        console.error('Error adding game to favorites:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            error || 'Hubo un problema al añadir el juego a tus favoritos.',
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

  createReservation(gameId: string): void {
    Swal.fire({
      title: '¿Quieres reservar este juego?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, reservar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationService.createReservation(gameId).subscribe({
          next: (response) => {
            if (response.ok) {
              this.messageService.add({
                severity: 'success',
                summary: '¡Juego reservado!',
                detail: response.msg,
              });
              setTimeout(() => {
                location.reload();
              }, 2000);
            } else {
              Swal.fire(
                'Error',
                response.msg || 'Hubo un problema al reservar el juego.',
                'error',
              );
            }
          },
          error: (error) => {
            console.error('Error creating reservation:', error);
            Swal.fire(
              'Error',
              error ||
                'Hubo un problema al reservar el juego. Inténtalo de nuevo más tarde.',
              'error',
            );
          },
        });
      }
    });
  }

  private checkIfReservation(): void {
    this.reservationService.hasUserReservationForGame(this.gameId).subscribe({
      next: (response) => {
        if (response.hasReservation) {
          this.isReserved = response.hasReservation;
        }
      },
      error: (error) => {
        console.error('Error checking if game is favorite:', error);
      },
    });
  }
}
