import { Component, OnInit , inject} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServicesService } from '../../../core/services/services.service';
import { error } from 'console';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';



@Component({
  selector: 'app-add-service',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    ToastModule],
  providers: [MessageService],
  templateUrl: './add-service.component.html',
  styleUrl: './add-service.component.scss'
})
export class AddServiceComponent implements OnInit {

  constructor(private services: ServicesService, private router: Router){}

  private formBuilder = inject(FormBuilder);

  messageService = inject(MessageService);
  
  add_service = this.formBuilder.group({
    Name: '',
    Description: '',
  });
  Name: any = '';
  Description: any = '';
  select: File[] = [];

  onfileselected(event:any){
    this.Name = this.add_service.value.Name;
    this.Description = this.add_service.value.Description;
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.select = Array.from(input.files);
    }    
  }

  onSubmit(): void{
    const formData = new FormData();
    formData.append('Name', this.Name);
    formData.append('Description', this.Description);
    this.select.forEach((file) => {
      formData.append('Image', file);
    });

    console.log(formData);

    this.services.addServices(formData).subscribe({
      next: (res) =>{
      console.log(res);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'New Servive added successfully!',
      });
      setTimeout(() => {
        this.router.navigate(['/dashboard/services']);
      }, 1000);
      },
      error: (err) =>{
        console.log("there are error",err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error. Please try again.',
        });   
      }

    }
      
    );
    
  }
  ngOnInit(): void {

  }

}
