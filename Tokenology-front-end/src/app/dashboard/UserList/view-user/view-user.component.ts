  import { Component, OnInit,NgModule,Injectable } from '@angular/core';
  import { EqualValidator } from './../../../Directives/validation.directive';
  import { GlobalService } from './../../../GlobalService';
  import { DataTableModule} from 'primeng/primeng';
  import * as moment from 'moment';
  import { Router, ActivatedRoute } from '@angular/router';
  import { AlertService, AuthenticationService ,SetupService} from '../../../Services/index';
  import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
  import { Http, Headers, RequestOptions, Response  } from '@angular/http';
  import { MessageService } from 'primeng/components/common/messageservice';

  @Component({
    selector: 'app-view-user',
    templateUrl: './view-user.component.html',
    styleUrls: ['./view-user.component.css']
  })

export class ViewUserComponent implements OnInit {
   depositDialog: boolean = false;
   withdrawDialog: boolean = false;
   user: any;
   tokenList:any;
   tokenDetail:any;
   transactionData:any[]=[];
   tokenBalanceList:any[]=[];
   transData: Transdata;
   ethBalance:any;
   submitted: boolean; 
   withdrawDetails: WithdrawDetail;
   withDrawForm: FormGroup;
   accountType:boolean;
   currentToken:any[]=[];
   completedToken:any[]=[];
   currentDate:any;
   ethAddress:any;
   complete:boolean=true;
   enddate:any;
   banner:boolean=false;
   constructor(
        private http: Http,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private _setupService: SetupService,
        private alertService: AlertService,
        private messageService: MessageService,
        private global_service:GlobalService
       )
        { 
         var status = this.global_service.isLogedIn();
         if(status==false){
           this.router.navigateByUrl('/login');
         }
          this.user=JSON.parse(localStorage.getItem('currentUser')); 
          this.currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm"); 
          if(this.user!=null||this.user!=undefined){
            if(this.user.accountType == "Investor"){          
               this.accountType=false;           
           }else{                 
               this.accountType=true;
           }
           this.ethAddress=this.user.EthAddress;
           this.getBalance();
           this.getTransactionsByAccount();
           this.getTokenByUserId();
           this.getTokenBalanceByAddress();
         
         }          
        }

       withdrawDetail(){
          this.withdrawDetails = { 
               fromAddress:"",
               amount:"",
               toAddress: "" ,
               userId:""
           }
       }

       transDataDetail(){
         this.transData ={
              sn:"",
              hash:"",
              value:""
         }
       }

       ngOnInit() {      
         
                this.withdrawFormInit();        
       }

    withdrawFormInit(){
      this.withDrawForm = this.fb.group({
            'amount': new FormControl('', Validators.required),
            'toAddress': new FormControl('', Validators.required)            
        });
    }

    // get ETH Balance

  getBalance(){ 
               let postData ={
                 userId : this.user._id,
                 address:this.user.EthAddress         
               };
              const url = this.global_service.basePath + 'ETH/getBalanceByAddress';
         this.global_service.PostRequest(url , postData).subscribe(response=>{   
            if(response[0].json.status==200){
             this.ethBalance=response[0].json.json().data;
            }else{
             
            }
          })
  }

// get token by userid

  getTokenByUserId(){
   
                let postData ={
                 userId : this.user._id,                      
               };
         const url = this.global_service.basePath + 'ETH/getTokenByUserId';
         this.global_service.PostRequest(url , postData).subscribe(response=>{  
           
            if(response[0].json.status == 200){   
             if(response[0].json.json().data.length!=0){
                   for(var data of response[0].json.json().data){
                   this.enddate=moment(data.endTime).format("YYYY-MM-DD HH:mm");
                    if(this.enddate<this.currentDate){
                      this.completedToken.push(data);                   
                    }else{
                     this.currentToken.push(data);                    
                    }
                  }  
             }else{
                if(this.user.accountType == "Investor"){          
                    this.banner=false;          
                 }else{                 
                  this.banner=true;
               }
             }
             
            }else{
                  console.log("no datafound");
            }
          })
  }

 

getTokenBalanceByAddress(){
  let postData ={      
                 ETHaddress:this.user.EthAddress,
                 userId:this.user._id                                   
                 };

          const url = this.global_service.basePath + 'ETH/getTokenBalanceByAddress';
         this.global_service.PostRequest(url , postData).subscribe(response=>{   
            if(response[0].json.status==200){
               this.tokenBalanceList = [];
               var result=response[0].json.json().data;                  
               for(var i=0;i<result.length;i++){
                  let objData ={      
                     sn :'',
                     tokenAddress:'',
                     result:''                
                  };
                  var j = i+1;
                  objData.sn =j.toString();
                  objData.tokenAddress=(result[i].tokenAddress);
                  objData.result=result[i].result; 
                  this.tokenBalanceList.push(objData); 
               }
               
          }else{     
    }        

      })
}

getTransactionsByAccount(){

  let postData ={
                 address:this.user.EthAddress,
                 userId:this.user._id,
                 startBlock:'',
                 endBlock: ''                     
                 };

          const url = this.global_service.basePath + 'ETH/getTransactionFromRopston';                   //getTransactionsByAccount';
         this.global_service.PostRequest(url , postData).subscribe(response=>{ 
               if(response[0].json.status==200){
               this.transactionData = [];
               var result=response[0].json.json().data;                 
               for(var i=0;i<result.length;i++){
                  let objData ={      
                     sn :'',
                     hash:'',
                     value:''                
                  };

                  var j = i+1;
                  objData.sn =j.toString();
                  objData.hash=(result[i].hash);
                  objData.value=result[i].value; 
                  this.transactionData.push(objData); 
               }
               
          }else{     
    }        
       
      })
 
}



onCancel(){
   this.withdrawDialog = false;
}


 

      deposite() {  
        this.depositDialog = true;
    }
       withdraw() {          
             this.withdrawDialog = true;
    }
    
    Ongoing(){
    this.complete=true;
    }

    Completed(){    
    this.complete=false;
    }
    viewIco(value :any){  
    
      //window.open(this.global_service.basePathforReact+"invest?addr=0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0");
      window.open(this.global_service.basePathforReact+"invest?addr="+value);
    }


}

interface Transdata{
  sn:any;
  hash:any;
  value:any;
}