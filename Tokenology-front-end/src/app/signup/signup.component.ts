import { Component, OnInit ,NgModule} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService ,UserService } from '../Services/index';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Http, Headers, RequestOptions, Response  } from '@angular/http';
import { EqualValidator } from '../Directives/validation.directive';
import { MessageService } from 'primeng/components/common/messageservice';
import { GlobalService } from '../GlobalService';
//import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService  } from 'ng4-loading-spinner';
@Component({
    selector : 'signup',
    templateUrl: 'signup.component.html'
})

export class SignupComponent implements OnInit {
    loading = false;
    returnUrl: string;
    submitted: boolean;
    account: string;
    isClick=false;
    passwordRegex: any = '/^(?=.[A-Za-z])(?=.\d)[A-Za-z\d]{4,20}/' ;
    registerForm: FormGroup;
    signUpDetails: SignupDetail;
    constructor(
        private http: Http,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private activatedRoute: ActivatedRoute,
        private messageService: MessageService,
        private global_service : GlobalService,
      //  private ng4LoadingSpinnerService: Ng4LoadingSpinnerService
        ) 
    { 
        //debugger;
        this.http = http          
         this.signUpDetails = { 
            firstName: '',
            lastName: '',
            email:'',
            password:'',
            confirmPassword: '',
            accountType:''
           }

    }

    ngOnInit() {
         this.activatedRoute.params.subscribe(params => {
            this.account = params["paramKey"];
              //this.selectRoute(this.selectedRoute);
        })
        this.loginFormInit();
       

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
// /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    loginFormInit(){
      this.registerForm = this.fb.group({
            'firstName': new FormControl('',Validators.compose([Validators.required,Validators.minLength(3),Validators.pattern(/^[a-zA-Z][a-zA-Z\\s]+$/)])),
            'lastName': new FormControl('',Validators.compose([Validators.required,Validators.minLength(3),Validators.pattern(/^[a-zA-Z][a-zA-Z\\s]+$/)])),
            'email': new FormControl('',Validators.compose([Validators.required,Validators.pattern(/^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,8}|[0-9]{1,3})(\]?)$/)])),
            'password': new FormControl('',Validators.compose([Validators.required,Validators.minLength(6), Validators.maxLength(100),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,100})/)])),
           'confirmPassword':new FormControl('', Validators.required),
        }, { validator: this.matchingPasswords('password', 'confirmPassword') });
    }
    matchingPasswords(passwordKey: string, confirmPasswordKey: string) {       
        return (group: FormGroup): { [key: string]: any } => {
            let password = group.controls[passwordKey];
            let confirmPassword = group.controls[confirmPasswordKey];
            if (password.value !== confirmPassword.value) {
                return {
                    mismatchedPasswords: true
                };
            }
        }
    }

     
     register(){
         const url = this.global_service.basePath + 'api/register';
         this.signUpDetails.accountType=this.account;  
          this.global_service.PostRequestUnautorized(url , this.signUpDetails)
        .subscribe((response) => {  
            
            console.log("response = = = ="+JSON.stringify(response))
          if(response[0].json.status==200){
           // this.ng4LoadingSpinnerService.hide();                       
               this.messageService.add({severity:'success', summary:response[0].json.message+""+"please verify"});
               this.router.navigate(['/login']);
          }else{                 
          //   this.ng4LoadingSpinnerService.hide();  
              this.messageService.add({severity:'error', summary:response[0].json.err});
          }
       
        })
     }
}