import { Component , inject, OnInit, Optional} from '@angular/core';
import { 
  FormsModule, 
  FormBuilder,  
  ReactiveFormsModule, 
  Validators, 
  FormGroup, 
  FormControl } from '@angular/forms';
import { log } from 'console';
import { filter } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth.service';
import { UsersService } from '../../../../core/services/users.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CommonModule,
    InputTextModule,
    ToastModule,],
    providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  constructor(
    private auth: AuthService,
    private router: Router,
    private usersService: UsersService,
    @Optional() public activeModal: NgbActiveModal){}

    private modalService = inject(NgbModal);

  errorMassage:string = '';
  passwordVisibility: boolean = false;
  messageService = inject(MessageService);

  private formBuilder = inject(FormBuilder);

  registerForm = this.formBuilder.group({
    userName: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => {
        if (this.activeModal) {
          this.activeModal.close();
        }
      });
  }

  onSubmit(): void{
    console.log(this.registerForm.value);
    
    if (this.registerForm.valid) {
      // send user name and password to Api
      this.auth.register(this.registerForm.value).subscribe({
        next: (res)=>{
          // if success is true 
          this.usersService.GetUSer();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Register successfully!',
          });
          setTimeout(() => {
            this.activeModal.close();
            this.registerForm.reset();  // reset the form
          }, 1000);
        },
        error: (err) => {
          console.log('error',err);
          this.registerForm.reset();  // reset the form
          this.messageService.add({
            severity: 'error',
            summary: 'error',
            detail: 'Please try later',
          });
        },
      });
    }else{
      this.validateAllFormFileds(this.registerForm);
    }
  }

  private validateAllFormFileds(formGroup: FormGroup){
    Object.keys(formGroup.controls).forEach(filed =>{
      const control = formGroup.get(filed);
      if(control instanceof FormControl){
        control.markAsDirty({ onlySelf: true });
      } else if(control instanceof FormGroup){
        this.validateAllFormFileds(control);
      }
    })
  }

  colsePopup(): void {
    this.activeModal.close();
  }
  
  togglePasswordVisibility(passwordInput: string): void {
    
    if (passwordInput === 'Password') {
      this.passwordVisibility = !this.passwordVisibility;
    }
  }

}
