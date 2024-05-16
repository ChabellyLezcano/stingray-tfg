import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardgameService } from '../../services/boardgame.service';
import { MessageService } from 'primeng/api';
import { Boardgame } from '../../interfaces/games.interface';

@Component({
  selector: 'app-edit-game',
  templateUrl: './edit-game.component.html',
  styleUrls: ['./edit-game.component.css'],
  providers: [MessageService],
})
export class EditGameComponent implements OnInit {
  gameForm: FormGroup;
  statusOptions: any[] = [
    { label: 'Disponible', value: 'Available' },
    { label: 'No Disponible', value: 'Unavailable' },
  ];
  mainPhotoFile: File | null = null;
  mainPhotoPreview: string | null = null;
  photoGalleryFiles: File[] = [];
  photoGalleryPreviews: { url: string; name: string }[] = [];
  gameId: string;
  boardgame!: any;

  constructor(
    private fb: FormBuilder,
    private gameService: BoardgameService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.gameId = this.route.snapshot.paramMap.get('id')!;
    this.gameForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      mainPhoto: ['', Validators.required],
      status: ['Available', Validators.required],
      tags: [''],
      photoGallery: [''],
    });
  }

  ngOnInit(): void {
    this.loadGameDetails();
  }

  loadGameDetails(): void {
    this.gameService.getGameById(this.gameId).subscribe({
      next: (response) => {
        if (response.ok) {
          const game: any = response.boardgame;
          this.gameForm.patchValue(game);
          this.mainPhotoPreview = game.mainPhoto;
          this.photoGalleryPreviews = game.photoGallery.map((url: string) => ({
            url,
            name: url.split('/').pop()!,
          }));
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.msg || 'Error al cargar los detalles del juego',
          });
        }
      },
      error: (error) => {
        console.error('Error fetching game details:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Hubo un problema al cargar los detalles del juego. Inténtalo de nuevo más tarde.',
        });
      },
    });
  }

  onSelectMainPhoto(event: any): void {
    this.mainPhotoFile = event.files[0];
    if (this.mainPhotoFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.mainPhotoPreview = reader.result as string;
        this.gameForm.patchValue({ mainPhoto: this.mainPhotoPreview });
      };
      reader.readAsDataURL(this.mainPhotoFile);
    }
  }

  onSelectPhotoGallery(event: any): void {
    this.photoGalleryFiles = event.files;
    this.photoGalleryPreviews = [];
    for (let file of event.files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoGalleryPreviews.push({
          url: e.target.result,
          name: file.name,
        });
        this.gameForm.patchValue({
          photoGallery: this.photoGalleryPreviews
            .map((photo) => photo.url)
            .join(','),
        });
      };
      reader.readAsDataURL(file);
    }
  }

  updateGame(): void {
    if (this.gameForm.valid) {
      const updatedGame = this.gameForm.value;

      const formData = new FormData();
      formData.append('title', updatedGame.title);
      formData.append('description', updatedGame.description);
      if (this.mainPhotoFile) {
        formData.append('mainPhoto', this.mainPhotoFile);
      } else {
        formData.append('mainPhoto', this.boardgame.mainPhoto);
      }
      formData.append('status', updatedGame.status);
      formData.append('tags', updatedGame.tags);
      for (let i = 0; i < this.photoGalleryFiles.length; i++) {
        formData.append('photoGallery', this.photoGalleryFiles[i]);
      }

      this.gameService.updateGame(this.gameId, formData).subscribe({
        next: (response) => {
          if (response.ok) {
            this.messageService.add({
              severity: 'success',
              summary: '¡Juego actualizado!',
              detail: 'El juego ha sido actualizado con éxito.',
            });
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 2000);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.msg || 'Error al actualizar el juego',
            });
          }
        },
        error: (error) => {
          console.error('Error updating game:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Hubo un problema al actualizar el juego. Inténtalo de nuevo más tarde.',
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
