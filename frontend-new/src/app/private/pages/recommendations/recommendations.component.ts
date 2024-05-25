import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import {
  Recommendation,
  RecommendationResponse,
} from '../../interfaces/interfaces.interface';
import { RecommendationService } from '../../services/recommendation.service';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css'],
})
export class RecommendationsComponent implements OnInit {
  recommendations: Recommendation[] | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private recommendationService: RecommendationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations(): void {
    this.isLoading = true;
    this.recommendationService.getRecommendations().subscribe({
      next: (response: RecommendationResponse) => {
        this.isLoading = false;
        this.recommendations = response.recommendations;
        this.messageService.add({
          severity: 'success',
          summary: 'Recomendaciones generadas',
          detail: 'Las recomendaciones han sido generadas con éxito',
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.error = 'Error al generar recomendaciones';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Hubo un problema al generar recomendaciones. Inténtalo de nuevo más tarde.',
        });
        console.error('Error generating recommendations:', error);
      },
    });
  }
}
