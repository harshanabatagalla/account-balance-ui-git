import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  private readonly msalService = inject(MsalService);

  async ngOnInit() {
    try {
      // Ensure MSAL is initialized when the app starts
      await this.msalService.instance.initialize();
      
      // Handle redirect flows
      await this.msalService.instance.handleRedirectPromise();
      
      // Set active account if available
      const accounts = this.msalService.instance.getAllAccounts();
      if (accounts.length > 0) {
        this.msalService.instance.setActiveAccount(accounts[0]);
      }
    } catch (error) {
      console.error('MSAL initialization error:', error);
    }
  }
}