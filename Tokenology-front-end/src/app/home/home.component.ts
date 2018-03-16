import { Component, OnInit ,NgModule,Input,Output,ViewChild,EventEmitter,ChangeDetectionStrategy,VERSION} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
  import * as moment from 'moment';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Http, Headers, RequestOptions, Response  } from '@angular/http';
import { Message} from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { GlobalService } from '../GlobalService';
import { DialogModule, ConfirmationService } from 'primeng/primeng';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    // user: any;
   public counter:number;
   public name:string;
   public tokenData:any;
   public user:any;
   tokensList:any[]=[];
   value = 1;
   isDataFound : boolean = false;
   tokenLink:any;
   
   // for filter
  public _items: Array<any>;
  public enableFilter: boolean;
  public filterText: string;
  public filterPlaceholder: string;
  public filterInput = new FormControl();
  //private _subscription: Subscription;
  @Input() items: Observable<any[]>;
  content:any[]=new Array();
  userName:any;
  active:boolean=true;
  contactForm: FormGroup;
  subscribeForm: FormGroup;
  public contactDetail:ContactDetail;
   public subscribeDetail:ContactDetail;
   public status:any;
  constructor(
        private global_service : GlobalService,
        private http: Http,
        private route: ActivatedRoute,
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private fb: FormBuilder,
  	) { 

    debugger
    this.status = this.global_service.isLogedIn();
         if(this.status==false){
            this.active=false;
         }
         else{  
           this.active=true;
           this.user=JSON.parse(localStorage.getItem('currentUser')); 
           this.userName=this.user.firstName + " "+this.user.lastName;
         }
    this.counter=0;
     
     this.getToken();
     
      this.user=JSON.parse(localStorage.getItem('currentUser')); 

      this.contactDetail = {           
            email:'',
            name: '',
            subject:'',
            message: ''
               
           } 
           this.subscribeDetail = {           
            email:''  
           } 
  }


  getToken(){
       const url = this.global_service.basePath + 'api/getAllTokens';
             this.global_service.GetRequest(url).subscribe(response=>{ 
                    
             if(response[0].json.status==200){ 
              
               this.tokensList = []; 
                this.tokenData=response[0].json.data;
                var tokenLength=response[0].json.data.length;               
                 for(var i=this.counter+1;i<this.tokenData.length;i++){
                   let objData ={      
                     tokenName :'',
                     tokenTicker:'',                    
                     tokenAddress:'',
                     tokenSupply :'',
                     endTime:'',
                     tokenImage:''

                  };
                  objData.tokenName=this.tokenData[i].tokenName;
                     objData.tokenTicker=this.tokenData[i].tokenTicker;
                     objData.tokenAddress=this.tokenData[i].tokenAddress;
                     objData.tokenSupply=this.tokenData[i].tokenSupply;
                     objData.endTime=this.tokenData[i].endTime;                     
                   if(this.tokenData[i].tokenImage==null||this.tokenData[i].tokenImage==undefined||this.tokenData[i].tokenImage==""){                     
                     objData.tokenImage="assets/images/No-preview.png";                  
                   }else{                    
                     objData.tokenImage=this.tokenData[i].tokenImage;                     
                   }
                     
                   this.tokensList.push(objData);
                    if(i%9==0) break;
                 }
                  this.counter+=9;
            }else{
              this.isDataFound = false;
              // this.active=true;
              // this.notActive=false;
            }
          })     
  }

  
  
  invest_ICO(value:any){    
    if(this.user==null||this.user==undefined){
        this.tokenLink=1
         localStorage.setItem('token_link', this.tokenLink);
         this.router.navigate(['/login'])
    }
    else{
      window.open(this.global_service.basePathforReact+"invest?addr="+value);
     
    }
  }

  // next(){
  //   this.value=this.value;
  //   this.value ++;
  //     this.getTokens(this.value);
  // }
  // previous(){
  //  this.value=this.value;
  //   this.value --;
   
  //     this.getTokens(this.value);
  // }


     logout() {     
        this.confirmationService.confirm({
            message: 'Are you sure that you want to Logout?',
            header: 'Confirmation',
            icon: 'fa fa-question-circle',
            accept: () => {
                let postData = {
                    ETHaddress: this.user.EthAddress,
                    userId: this.user._id
                };

                const url = this.global_service.basePath + 'api/logout';
                this.global_service.PostRequest(url, postData).subscribe(response => {
                    debugger
                    if (response[0].json.status == 200) {
                        console.log("response = = =" + response[0].json.json().message)
                        localStorage.clear();
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('token');
                        localStorage.removeItem('token_link');
                        this.router.navigateByUrl('/login');
                        this.messageService.add({ severity: 'success', summary: response[0].json.json().message });

                    } else {

                        this.messageService.add({ severity: 'success', summary: 'cancel logout' });
                    }

                })
            },
            reject: () => {
                this.messageService.add({ severity: 'success', summary: 'cancel logout' });
            }
        });
    }

  ngOnInit() {
    this.contactFormInit();
    this.subscribeFormInit();
  }
   contactFormInit(){
      this.contactForm = this.fb.group({            
            'name': new FormControl('', Validators.required),
            'email': new FormControl('',Validators.compose([Validators.required,Validators.pattern(/^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,8}|[0-9]{1,3})(\]?)$/)])),
            'message': new FormControl('', Validators.required),
            'subject': new FormControl('', Validators.required)
            
        });
    }
    subscribeFormInit(){
      this.subscribeForm = this.fb.group({  
            'email': new  FormControl('',Validators.compose([Validators.required,Validators.pattern(/^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,8}|[0-9]{1,3})(\]?)$/)])),
        });
    }
   

  sendMessage(){
         const url = this.global_service.basePath + 'api/contactUs';
         this.global_service.PostRequestUnautorized(url , this.contactDetail)
         .subscribe((response) => {         
          if(response[0].json.status==200){ 
               this.subscribeForm.reset();                    
               this.messageService.add({severity:'success', summary:response[0].json.message+""+"please verify"});
             }else{ 
                this.subscribeForm.reset();    
              this.messageService.add({severity:'error', summary:response[0].json.err});
          }
        })
     }
     subscribe(){
       const url = this.global_service.basePath + 'api/subscribeUs';
         this.global_service.PostRequestUnautorized(url , this.subscribeDetail)
         .subscribe((response) => {         
          if(response[0].json.status==200){ 
               this.contactForm.reset();                    
               this.messageService.add({severity:'success', summary:response[0].json.message});
             }else{ 
                this.contactForm.reset();    
              this.messageService.add({severity:'error', summary:response[0].json.message});
          }
        })
     }
     getStarted(){
       if(this.status==false){
       this.router.navigateByUrl('/signupHome');
       }else{
       this.router.navigateByUrl('//dashboard/view-user');
       }
     }
}
