import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardgameService } from '../../services/boardgame.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/auth/interface/authInterface';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css'],
})
export class GameDetailsComponent implements OnInit {
  gameId: string;
  user!: User | null;
  boardgame: any;
  isLoading: boolean = true;
  error: string | null = null;

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
    private authService: AuthService,
  ) {
    this.gameId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.user = this.authService.user;
    this.loadGameDetails();
  }

  private loadGameDetails(): void {
    this.isLoading = true;
    this.boardgameService.getGameById(this.gameId).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.ok) {
          // La respuesta contiene un array de boardgames, pero para detalles solo necesitamos el primero
          this.boardgame = response.boardgame;
          console.log(this.boardgame);
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
}
