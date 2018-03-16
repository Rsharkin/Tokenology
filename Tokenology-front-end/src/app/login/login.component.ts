import { Component, OnInit ,NgModule} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService } from '../Services/index';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Http, Headers, RequestOptions, Response  } from '@angular/http';
import { Message} from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { GlobalService } from '../GlobalService';
//import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService  } from 'ng4-loading-spinner';
@Component({
    selector : 'login',
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    msgs: Message[] = [];
    loading = false;
    isClick=false;
    returnUrl: string;
    submitted: boolean;
    loginDetail:LoginDetail;
    loginForm: FormGroup;
    tokens:any;
    constructor(
        private http: Http,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private authenticationService: AuthenticationService,
        private global_service : GlobalService,
        private alertService: AlertService,
        private messageService: MessageService,
        //private ng4LoadingSpinnerService: Ng4LoadingSpinnerService
        ) 
        { 
           this.http = http;

           this.loginDetail = {           
            // email:'javedkhan19950@gmail.com',
            // password: '123456'
            email:'',
            password: ''
               
           } }

    ngOnInit() {       
        this.loginFormInit();
        this.authenticationService.logout1();       
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    loginFormInit(){
      this.loginForm = this.fb.group({
            'email': new FormControl('', Validators.required),
            'password': new FormControl('', Validators.required)
            
        });
    }



    login(){   
       this.loading=true;
     const url = this.global_service.basePath + 'api/login';
          this.global_service.PostRequestUnautorized(url , this.loginDetail)
        .subscribe((response) => {     
          if(response[0].json.status==200){
           // this.loading=false;
            //this.ng4LoadingSpinnerService.hide();                       
              localStorage.setItem('currentUser', JSON.stringify(response[0].json.data));
               localStorage.setItem('token', response[0].json.token);
              var user=JSON.parse(localStorage.getItem('currentUser')); 
              console.log("user"+JSON.stringify(user));
                this.router.navigateByUrl('/dashboard/view-user');

              if(this.tokens == null || this.tokens == undefined){
                this.router.navigateByUrl('/dashboard/view-user');
                this.messageService.add({severity:'success', summary:'Login successfully'});
              }else{
                  //window.open("https://www.google.co.in", "_blank");
                 // http://localhost:3000/crowdsale?addr=0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0

                 // "http://192.168.0.165:3000/crowdsale?addr="+user._id+"="+this.TOKEN, "_blank"
              }                     
     
          }else{                 
              this.isClick=false; 
              this.loading=false;      
              this.messageService.add({severity:'error', summary:response[0].json.message});
          }
       
        })
    }
}
