import { Component, OnInit ,NgModule} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService ,UserService } from '../Services/index';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Http, Headers, RequestOptions, Response  } from '@angular/http';
import { GlobalService } from '../GlobalService';
import { MessageService } from 'primeng/components/common/messageservice';
@Component({
    selector : 'updatePassword',
    templateUrl: 'updatePassword.component.html'
})

export class UpdatePasswordComponent implements OnInit {
  public user:any;
   public profileDetail:any;
  updatePassword: UpdatePassword;
  updatePasswordForm: FormGroup;
    constructor(
                private http: Http,
                private route: ActivatedRoute,
                private router: Router,
                private fb: FormBuilder,
                private alertService: AlertService,
                private messageService: MessageService,
                private userService: UserService ,
                 private global_service:GlobalService
      ) {     
          this.user=JSON.parse(localStorage.getItem('currentUser')); 
  

          this.updatePassword = { 
            //currentPassword: '',
            newPassword: '',
            confirmNewPassword:''            
           }

        }

   
    updateUserPassword(){
      debugger
      let postData ={
          // userId : this.user._id,   
          // currentPassword:this.updatePassword.currentPassword,
          newPassword: this.updatePassword.newPassword,
          confirmNewPassword: this.updatePassword.confirmNewPassword,

       };
         const url = this.global_service.basePath + 'api/ResetPasswordByUserid';
         this.global_service.PostRequest(url , postData).subscribe(response=>{ 
           debugger
           this.updatePasswordForm.reset();
            if(response[0].json.status == 200){   
              this.messageService.add({severity:'success', summary:response[0].json.json().message});
            }else{
               this.updatePasswordForm.reset();
             this.messageService.add({severity:'error', summary:response[0].json.json().message});  
            }
          })
    }
  ngOnInit() {
  
        this.loginFormInit();


       
    }

    loginFormInit(){
      this.updatePasswordForm = this.fb.group({
            // 'currentPassword': new FormControl('', Validators.required),
            'newPassword':  new FormControl('',Validators.compose([Validators.required,Validators.minLength(6), Validators.maxLength(100),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,100})/)])),
            'confirmNewPassword': new FormControl('', Validators.required)            
           }, { validator: this.matchingPasswords('newPassword', 'confirmNewPassword') });
    }
    matchingPasswords(passwordKey: string, confirmPasswordKey: string) {       
        return (group: FormGroup): { [key: string]: any } => {
            let newPassword = group.controls[passwordKey];
            let confirmNewPassword = group.controls[confirmPasswordKey];
            if (newPassword.value !== confirmNewPassword.value) {
                return {
                    mismatchedPasswords: true
                };
            }
        }
    }
  }