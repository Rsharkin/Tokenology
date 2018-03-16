import { Component, OnInit ,NgModule,Input,Output,ViewChild,EventEmitter,ChangeDetectionStrategy,VERSION} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
  import * as moment from 'moment';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Http, Headers, RequestOptions, Response  } from '@angular/http';
import { Message} from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { GlobalService } from '../../../GlobalService';
// for filter


import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';


  @Component({
    selector: 'app-investIco',
    templateUrl: './investIco.component.html',
    styleUrls: ['./investIco.component.css']
  })
  export class InvestIcoComponent implements OnInit {
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
  public tokenImage:string;
  public filterInput = new FormControl();
  //private _subscription: Subscription;
  @Input() items: Observable<any[]>;
  content:any[]=new Array();
 

    constructor(public global_service: GlobalService,public router: Router, public fb:FormBuilder) {
      var status = this.global_service.isLogedIn();
         if(status==false){
           this.router.navigateByUrl('/login');
         }
      this.tokenImage="assets/images/No-preview.png";
     this.counter=0;
     this.user=JSON.parse(localStorage.getItem('currentUser')); 
     this.getToken();
      this.name = `Angular! v${VERSION.full}`
    }

      getToken(){
       const url = this.global_service.basePath + 'api/getAllTokens';
             this.global_service.GetRequest(url).subscribe(response=>{ 
               debugger
     console.log("response = = "+JSON.stringify(response));     
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
                     objData.tokenImage="./assets/images/No-preview.png";                  
                   }else{                    
                     objData.tokenImage=this.tokenData[i].tokenImage;                     
                   }
                     
                   this.tokensList.push(objData);
                    if(i%10==0) break;
                 }
                  this.counter+=10;
            }else{
              console.log("No Data Found");
              this.isDataFound = false;
            }
          })     
  }
  invest_ICO(value:any){
       window.open(this.global_service.basePathforReact+"invest?addr="+value);
  }


    ngOnInit() {
      
    }
 
   
  }
