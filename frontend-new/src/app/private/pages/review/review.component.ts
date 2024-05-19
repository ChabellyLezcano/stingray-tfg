import { Component, Input, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { MessageService } from 'primeng/api';
import { Review } from '../../interfaces/interfaces.interface';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
  providers: [MessageService],
})
export class ReviewComponent implements OnInit {
  gameId!: string;
  @Input() user!: any;
  reviews: Review[] = [];
  isLoadingReviews: boolean = true;
  paginatedReviews: Review[] = [];
  pageSize: number = 3;
  averageRating: number = 0;

  constructor(
    private reviewService: ReviewService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
    this.gameId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.user = this.authService.user;
    this.loadReviews();
    this.loadAverageRating();
  }

  private loadReviews(): void {
    this.isLoadingReviews = true;
    this.reviewService.getReviews(this.gameId).subscribe({
      next: (response) => {
        this.isLoadingReviews = false;
        if (response.ok) {
          this.reviews = response.reviews.sort(
            (a, b) =>
              new Date(b.reviewDate).getTime() -
              new Date(a.reviewDate).getTime(),
          );
          this.paginatedReviews = this.reviews.slice(0, this.pageSize);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar reseñas',
          });
        }
      },
      error: (error) => {
        this.isLoadingReviews = false;
        console.error('Error fetching reviews:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load reviews',
        });
      },
    });
  }

  private loadAverageRating(): void {
    this.reviewService.getAverageRating(this.gameId).subscribe({
      next: (response) => {
        if (response.ok) {
          this.averageRating = response.averageRating;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar la calificación promedio',
          });
        }
      },
      error: (error) => {
        console.error('Error fetching average rating:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar la calificación promedio',
        });
      },
    });
  }

  showMoreReviews(): void {
    const nextIndex = this.paginatedReviews.length + this.pageSize;
    this.paginatedReviews = this.reviews.slice(0, nextIndex);
  }

  deleteReview(reviewId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reviewService.deleteReview(reviewId).subscribe({
          next: () => {
            this.reviews = this.reviews.filter((r) => r._id !== reviewId);
            this.paginatedReviews = this.reviews.slice(0, this.pageSize);
            this.messageService.add({
              severity: 'success',
              summary: 'Reseña eliminada',
              detail: 'La reseña ha sido eliminada con éxito',
            });
            this.loadAverageRating();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'Hubo un problema al eliminar la reseña. Inténtalo de nuevo más tarde.',
            });
            console.error('Error deleting review:', error);
          },
        });
      }
    });
  }

  getStarArray(rating: number): string[] {
    return Array.from({ length: 5 }, (_, i) =>
      i < rating ? 'text-yellow-500' : 'text-slate-600',
    );
  }
}
