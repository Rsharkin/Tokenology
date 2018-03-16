import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { GlobalService } from './../GlobalService';
import { MessageService } from 'primeng/components/common/messageservice';
declare var $:any;
export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    other_related_path:any[];
}

export const ROUTES: RouteInfo[] = [

    { path: 'view-user', title: 'Dashboard',  icon: 'fa fa-user-circle-o', class: '' ,other_related_path:['view-user']},
    { path: 'my-profile', title: 'My Profile',  icon: 'ti-user', class: 'active' ,other_related_path:['my-profile']},
    { path: 'setting', title: 'Settings',  icon: 'ti-settings', class: '' ,other_related_path:[]},
    { path: 'help', title: 'Help',  icon: 'fa fa-handshake-o', class: '' ,other_related_path:[]}
    
   
   
   ];

@Component({
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[]=[];
    loader:boolean = false;
    addState:string='';
      public user:any;
      accountType:boolean;
       ethBalance: any;
      TOKEN:any;
    constructor(public router:Router, public global_service:GlobalService,private messageService: MessageService,){      
         this.user=JSON.parse(localStorage.getItem('currentUser')); 
           this.TOKEN=localStorage.getItem('token'); 
       
   
       
         if(this.user!=null||this.user!=undefined){
          if(this.user.accountType!="Investor"){ 
            this.accountType=true;
         }else{
            this.accountType=false;
         }
       }
    }

    ngAfterViewInit() {
       let urlPath=window.location.href;
        console.log(urlPath.split('dashboard')[1].replace('/','').startsWith('view'));
        let curState = urlPath.split('dashboard')[1].replace('/','');
    }

    ngOnInit() {
        let currentState = '';
        this.setActiveClassNavbar(this.router.url);
        
        this.router.events.subscribe((url:any) => {
            this.setActiveClassNavbar(url.url);
        });
    }

    setActiveClassNavbar(url) {
        if(url){
            for(let i = 0 ; i < ROUTES.length ; i++) {
                if(url.includes(ROUTES[i].other_related_path[0]) || url.includes(ROUTES[i].other_related_path[1]) || url.includes(ROUTES[i].other_related_path[2])){
                  ROUTES[i].class = "active";
                }
                else{
                  ROUTES[i].class="";
                }
            }
        }
        else{
            this.router.navigateByUrl('/dashboard/404');
        }
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }    

    isNotMobileMenu(){
        if($(window).width() > 991){
            return false;
        }
        return true;
    }

    logout(){
        this.loader = true;
        const url = this.global_service.basePath + "admin/logout";        
         let obj = {token:this.global_service.userInfo.token};
         this.global_service.PostRequest(url,obj)
         .subscribe(res => {
          this.loader = false;
          this.global_service.consoleFun(res[0].json.json());
          localStorage.clear();
          this.router.navigateByUrl('/login');
        }, err => {
        this.loader = false;
        this.global_service.consoleFun(err);
    })
  }

  genrateIco(){ 
    window.open(this.global_service.basePathforReact+"1"+"?userId="+this.user._id+"="+this.TOKEN +"="+ this.user.EthAddress, "_blank");      
    // this.getBalance();
    //   if(this.ethBalance){
    //       window.open(this.global_service.basePathforReact+"1"+"?userId="+this.user._id+"="+this.TOKEN +"="+ this.user.EthAddress, "_blank");      
    //   }
    //   else{
    //       this.messageService.add({severity:'error', summary:"you don't have sufficient balance to generate ICO"});
    //   }
    }
   
InvestIco(){ 
          
    this.router.navigateByUrl('/dashboard/investIco');
    }


  //   getBalance(){ 
      
  //              let postData ={
  //                userId : this.user._id,
  //                address:this.user.EthAddress         
  //              };
  //             const url = this.global_service.basePath + 'ETH/getBalanceByAddress';
  //        this.global_service.PostRequest(url , postData).subscribe(response=>{   
            
  //           if(response[0].json.status==200){
  //             console.log("data = = "+response[0].json.json().data)
  //            this.ethBalance=response[0].json.json().data;
             
  //           }else{
             
  //           }
  //         })
  // }
}
