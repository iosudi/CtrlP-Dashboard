import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { Services } from '../../../core/interface/services';
import { ServicesService } from '../../../core/services/services.service';

@Component({
  selector: 'app-serv-ices',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    FormsModule,
    RouterLink,
    RouterModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './serv-ices.component.html',
  styleUrl: './serv-ices.component.scss',
})
export class ServIcesComponent implements OnInit {
  services_list: Services[] = [];
  messageService = inject(MessageService);

  constructor(private services: ServicesService) {}

  ngOnInit(): void {
    // call API data
    this.getservices();
  }

  getservices() {
    this.services.getServices().subscribe((data: any) => {
      this.services_list = data;
    });
  }

  deleteService(id: number) {
    this.services.deldteService(id).subscribe({
      next: (res) => {
        this.getservices();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully deleted service',
        });
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete service, please try again',
        });
      },
    });
  }
}
