import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/auth/interface/authInterface';
import { Game } from '../../interfaces/interfaces.interface';
import Swal from 'sweetalert2';
import { response } from 'express';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent implements OnInit {
  user!: User | null;
  favorites: Game[] = [];
  paginatedFavorites: Game[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  pageSize: number = 20;
  totalRecords: number = 0;

  constructor(
    private favoriteService: FavoriteService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.user;
    this.loadFavorites();
  }

  private loadFavorites(): void {
    this.isLoading = true;
    this.favoriteService.listFavorites().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.ok) {
          this.favorites = response.favorites;
          this.totalRecords = this.favorites.length;
          this.paginate({ first: 0, rows: this.pageSize });
        } else {
          this.error = response.msg || 'Failed to load favorites';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching favorites:', error);
        this.error = 'Failed to load favorites';
      },
    });
  }

  paginate(event: any): void {
    const start = event.first;
    const end = event.first + event.rows;
    this.paginatedFavorites = this.favorites.slice(start, end);
  }

  removeFromFavorites(gameId: string, event: Event): void {
    event.stopPropagation();

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
        this.favoriteService.removeGameFromFavorites(gameId).subscribe({
          next: (response) => {
            if (response.ok) {
              this.favorites = this.favorites.filter(
                (game) => game._id !== gameId,
              );
              this.totalRecords = this.favorites.length;
              this.paginate({ first: 0, rows: this.pageSize });
              Swal.fire('¡Eliminado!', response.msg, 'success');
            }
          },
          error: (error) => {
            console.error('Error removing game from favorites:', error);
            Swal.fire('Error', error, 'error');
          },
        });
      }
    });
  }
}
