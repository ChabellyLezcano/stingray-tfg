import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css'],
  providers: [MessageService],
})
export class CreateGameComponent implements OnInit {
  gameForm: FormGroup;
  statusOptions: any[] = [
    { label: 'Disponible', value: 'Available' },
    { label: 'No Disponible', value: 'Unavailable' },
  ];
  mainPhotoFile: File | null = null;
  photoGalleryFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private gameService: GameService,
    private messageService: MessageService,
    private router: Router,
  ) {
    this.gameForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      mainPhoto: ['', Validators.required],
      status: ['Available', Validators.required],
      tags: ['', Validators.required],
      photoGallery: [''],
    });
  }

  // Method to handle the selection of main photo
  onSelectMainPhoto(event: any): void {
    this.mainPhotoFile = event.currentFiles[0];
    this.gameForm.patchValue({ mainPhoto: this.mainPhotoFile!.name });
  }

  // Method to handle the selection of photo gallery
  onSelectPhotoGallery(event: any): void {
    this.photoGalleryFiles = event.currentFiles;
    const fileNames = this.photoGalleryFiles.map((file) => file.name).join(',');
    this.gameForm.patchValue({ photoGallery: fileNames });
  }

  // Method to create game
  createGame(): void {
    if (this.gameForm.valid) {
      const newGame = this.gameForm.value;

      const formData = new FormData();
      formData.append('title', newGame.title);
      formData.append('description', newGame.description);
      formData.append('mainPhoto', this.mainPhotoFile!);
      formData.append('status', newGame.status);
      formData.append('tags', newGame.tags);
      for (let i = 0; i < this.photoGalleryFiles.length; i++) {
        formData.append(
          'photoGallery',
          this.photoGalleryFiles[i],
          this.photoGalleryFiles[i].name,
        );
      }

      this.gameService.createGame(formData).subscribe({
        next: (response) => {
          if (response.ok) {
            this.messageService.add({
              severity: 'success',
              summary: '¡Juego creado!',
              detail: response.msg,
            });
            this.gameForm.reset();
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 1000);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.msg || 'Error al crear el juego',
            });
          }
        },
        error: (error) => {
          console.error('Error creating game:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              error ||
              'Hubo un problema al crear el juego. Inténtalo de nuevo más tarde.',
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
