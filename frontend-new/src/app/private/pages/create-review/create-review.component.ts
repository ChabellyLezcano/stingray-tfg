import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from '../../services/review.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-review',
  templateUrl: './create-review.component.html',
  styleUrls: ['./create-review.component.css'],
  providers: [MessageService],
})
export class CreateReviewComponent implements OnInit {
  reviewForm: FormGroup;
  gameId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    private messageService: MessageService,
  ) {
    this.reviewForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id')!;
  }

  // Method to create review
  createReview(): void {
    if (this.reviewForm.valid) {
      const formData = this.reviewForm.value;

      this.reviewService.createReview(formData, this.gameId).subscribe({
        next: (response) => {
          if (response.ok) {
            this.messageService.add({
              severity: 'success',
              summary: '¡Reseña creada!',
              detail: response.msg,
            });
            this.reviewForm.reset();
            setTimeout(() => {
              this.router.navigate(['/game', this.gameId]);
            }, 1000);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.msg || 'Error al crear la reseña',
            });
          }
        },
        error: (error) => {
          console.error('Error creating review:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear la reseña. Inténtalo de nuevo más tarde.',
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor completa todos los campos requeridos.',
      });
    }
  }
}
