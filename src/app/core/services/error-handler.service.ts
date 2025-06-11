import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private readonly snackBar = inject(MatSnackBar);

  handleError(error: HttpErrorResponse) {
    let message = 'An unexpected error occurred';
    
    if (error.error?.message) {
      message = error.error.message;
    } else if (error.status === 401) {
      message = 'You are not authorized to perform this action';
    } else if (error.status === 403) {
      message = 'Access forbidden';
    } else if (error.status === 404) {
      message = 'Resource not found';
    } else if (error.status >= 500) {
      message = 'Server error. Please try again later';
    }

    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}