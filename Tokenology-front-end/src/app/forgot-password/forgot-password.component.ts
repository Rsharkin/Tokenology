import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from  '@angular/router';

import { GlobalService } from '../GlobalService';
import { MessageService } from 'primeng/components/common/messageservice';
declare var $:any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

    forgotPsswordForm: FormGroup;
    loader: boolean= false;
    is_login_email: boolean;
    public user;
    sub: any;
    subscription:boolean=true;
     forgotPasswordDetail:ForgotPasswordDetail;
    constructor(public fb: FormBuilder, public global_service: GlobalService, public router: Router ,private messageService: MessageService) {
      localStorage.clear();

       this.forgotPasswordDetail = { 
             email:''
             
           } 
     }

    ngOnInit() {
     this.formInitialization();
    }

    formInitialization(){
     this.forgotPsswordForm = this. fb.group({
      email: ['',[Validators.required]]
     })
    }

    forgotPassword(){
           const url = this.global_service.basePath + 'api/forgot_password';
     console.log("login detail "+JSON.stringify(this.forgotPasswordDetail))
      this.global_service.PostRequestUnautorized(url , this.forgotPasswordDetail)
        .subscribe((response) => {
          debugger
                  if(response[0].json.status==200){            
                this.messageService.add({severity:'success', summary:response[0].json.msg});
              
              }else{
                this.messageService.add({severity:'error', summary:response[0].json.msg});
              }                     
     
          });
    
       
     
    }

    gotoForgotPassword(){
      this.router.navigateByUrl('forgot-password');
    }

}
