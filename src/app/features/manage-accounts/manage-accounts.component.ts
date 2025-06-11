import { Component } from '@angular/core';
import { UploadComponent } from "../upload/upload.component";
import { ReportsComponent } from '../reports/reports.component';

@Component({
  selector: 'app-manage-accounts',
  imports: [
    UploadComponent,
    ReportsComponent
],
  templateUrl: './manage-accounts.component.html',
  styleUrl: './manage-accounts.component.scss'
})
export class ManageAccountsComponent {

}
