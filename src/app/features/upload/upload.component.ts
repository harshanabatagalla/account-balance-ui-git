import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BalanceService } from '../../core/services/balance.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule
],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  private readonly balanceService = inject(BalanceService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly errorHandler = inject(ErrorHandlerService);
  
  selectedFile = signal<File | null>(null);
  uploading = signal(false);
  isDragOver = signal(false);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile.set(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  clearFile() {
    this.selectedFile.set(null);
  }

  uploadFile() {
    const file = this.selectedFile();
    if (!file) return;

    this.uploading.set(true);
    
    this.balanceService.uploadFile(file).subscribe({
      next: (response) => {
        this.uploading.set(false);
        this.selectedFile.set(null);
        this.snackBar.open(response.message, 'Close', { duration: 5000 });
      },
      error: (error) => {
        this.uploading.set(false);
        this.errorHandler.handleError(error);
      }
    });
  }
}