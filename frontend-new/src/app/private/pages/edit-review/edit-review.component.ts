import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../../services/review.service';
import { MessageService } from 'primeng/api';
import { Review } from '../../interfaces/interfaces.interface';

@Component({
  selector: 'app-edit-review',
  templateUrl: './edit-review.component.html',
  styleUrls: ['./edit-review.component.css'],
  providers: [MessageService],
})
export class EditReviewComponent implements OnInit {
  reviewForm: FormGroup;
  reviewId: string;
  isLoading: boolean = true;
  review: any | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private messageService: MessageService,
    private router: Router,
  ) {
    this.reviewId = this.route.snapshot.paramMap.get('id') || '';
    this.reviewForm = this.fb.group({
      title: [''],
      description: [''],
      rating: [null, [Validators.min(1), Validators.max(5)]],
    });
  }

  ngOnInit(): void {
    this.loadReview();
  }

  private loadReview(): void {
    this.isLoading = true;
    this.reviewService.getReviewById(this.reviewId).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.ok) {
          this.review = response.review;
          this.reviewForm.patchValue(this.review);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar la reseña',
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching review:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load review',
        });
      },
    });
  }

  updateReview(): void {
    if (this.reviewForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, completa todos los campos requeridos',
      });
      return;
    }

    this.reviewService
      .updateReview(this.reviewId, this.reviewForm.value)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Reseña actualizada!',
            detail: 'La reseña ha sido actualizada con éxito.',
          });
          setTimeout(() => {
            this.router.navigate(['/game', this.review?.boardGameId]);
          }, 1000);
        },
        error: (error) => {
          console.error('Error updating review:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Hubo un problema al actualizar la reseña. Inténtalo de nuevo más tarde.',
          });
        },
      });
  }
}
