  import { Component, OnInit,NgModule } from '@angular/core';
  import { EqualValidator } from './../../../Directives/validation.directive';
  import { GlobalService } from './../../../GlobalService';
  import { DataTableModule} from 'primeng/primeng';
  import * as moment from 'moment';
  import { Router, ActivatedRoute } from '@angular/router';
  import { AlertService, AuthenticationService ,SetupService,UserService} from '../../../Services/index';
  import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
  import { Http, Headers, RequestOptions, Response  } from '@angular/http';
  import { Message} from 'primeng/components/common/api';
  import { MessageService } from 'primeng/components/common/messageservice';

  @Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.css']
  })

  export class MyProfileComponent implements OnInit {
  public user:any;
  public profileDetail:any;
  updateDetails: SignupDetail;
  updateForm: FormGroup;
  constructor(
                private http: Http,
                private route: ActivatedRoute,
                private router: Router,
                private fb: FormBuilder,
                private _setupService: SetupService,
                private alertService: AlertService,
                private messageService: MessageService,
                private userService: UserService ,
                 private global_service:GlobalService
      ) {     
    var status = this.global_service.isLogedIn();
         if(status==false){
           this.router.navigateByUrl('/login');
         }
          this.user=JSON.parse(localStorage.getItem('currentUser')); 
          if(this.user!=null||this.user!=undefined){
            this.userInfo();
          }         

          this.updateDetails = { 
            firstName: '',
            lastName: '' ,
            email:''         
           }

        }

   userInfo(){
       let postData ={
          userId : this.user._id,  
       };
          const url = this.global_service.basePath + 'api/GetProfileByUserId/';
            this.global_service.PostRequest(url,postData).subscribe(response=>{  
                       
            if(response[0].json.status==200){
              this.updateDetails=response[0].json.json().data;              
            }else{
             console.log("data = = "+response.data)
             
            }
          })
    }
   
    updateUserInfo(){
      let postData ={
          userId : this.user._id,
          firstName:this.updateDetails.firstName,
          lastName: this.updateDetails.lastName,
          email:this.updateDetails.email
       };
       const url = this.global_service.basePath + 'api/UpdateUserProfileById/';
       this.global_service.PostRequest(url,postData).subscribe(response=>{ 
            console.log("response"+JSON.stringify(response[0].json.status));
                
            if(response[0].json.status==200){
              this.messageService.add({severity:'success', summary:response[0].json.json().message});
              
            }else{
              this.messageService.add({severity:'error', summary:response[0].json.json().message});
            }
          })
    }

   ngOnInit() {  
        this.loginFormInit();
    }

    loginFormInit(){
      this.updateForm = this.fb.group({
            'firstName': new FormControl('',Validators.compose([Validators.required,Validators.minLength(3),Validators.pattern(/^[a-zA-Z][a-zA-Z\\s]+$/)])),
            'lastName': new FormControl('',Validators.compose([Validators.required,Validators.minLength(3),Validators.pattern(/^[a-zA-Z][a-zA-Z\\s]+$/)])),
            'email': new FormControl('', Validators.required)
        });
    }
   
  }
