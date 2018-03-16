import { Component, OnInit, Renderer,Output,Input,ViewChild, ElementRef, NgModule, EventEmitter } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AlertService, AuthenticationService, UserService, SetupService } from '../../Services/index';
import { DialogModule, ConfirmationService } from 'primeng/primeng';
import { GlobalService } from './../../GlobalService';
import { MessageService } from 'primeng/components/common/messageservice';
import { FormsModule, FormControl, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {
    
    depositDialog: boolean = false;
    withdrawDialog: boolean = false;
    withDrawForm: FormGroup;
    private listTitles: any[];
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;
    loader: boolean = false;
    public user: any;
    userName: any;
    accType: any;
    ethAddress: any;
    submitted: boolean;
    withdrawDetails: WithdrawDetail;
    ethBalance: any;
    @ViewChild("navbar-cmp") button;
    @Output() userUpdated = new EventEmitter();
    constructor(
        location: Location,
        private renderer: Renderer,
        private element: ElementRef,
        private _setupService: SetupService,
        private authenticationService: AuthenticationService,
        private messageService: MessageService,
        public global_service: GlobalService,
        public router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService
    ) {        
        this.user = JSON.parse(localStorage.getItem('currentUser'));
         if (this.user != null || this.user != undefined) {
            if (this.user.accountType != "Investor") {
                this.userName = this.user.firstName;
                this.accType = this.user.accountType;
                this.ethBalance = this.user.ETHbalance;
            } else {
                this.userName = this.user.firstName;
                this.accType = this.user.accountType;
                this.ethBalance = this.user.ETHbalance;
            }
            this.ethAddress = this.user.EthAddress;
            this.getBalance();
        }
        this.withdrawDetail();
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    withdrawDetail() {
        this.withdrawDetails = {
            fromAddress: "",
            amount: "",
            toAddress: "",
            userId: "",
            password:''
        }
    }

    ngOnInit() {
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        var navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        this.withdrawFormInit();
    }
    withdrawFormInit() {
        this.withDrawForm = this.fb.group({
            'amount': new FormControl('',Validators.compose([Validators.required,Validators.pattern(/^.?(0|[0-9]\d*)(\.\d+)?$/)])),
            'toAddress': new FormControl('', Validators.required),
            'password':  new FormControl('', Validators.required)
        });
    }

    getTitle() {
        var titlee = window.location.pathname;
        titlee = titlee.substring(1);
        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === titlee) {
                return this.listTitles[item].title;
            }
        }
        return 'Dashboard';
    }

    sidebarToggle() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible == false) {
            setTimeout(function () {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }

    deposite() {
        this.withdrawDialog = false;
        this.depositDialog = true;
    }
    withdraw() {
         this.withDrawForm.reset();
        this.depositDialog=false;
        this.withdrawDialog = true;
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
              console.log("data = = "+response[0].json.json().data)
             this.ethBalance=response[0].json.json().data;
            // this.outgoingData.emit(this.ethBalance);
            }else{
             
            }
          })
  }
    onCancel() {
        this.withdrawDialog = false;
        this.withdrawFormInit();
    }
   cancelDeposite(){
       this.depositDialog=false;
   }


    sendTransaction() {
        this.withdrawDialog = false;
        let postData = {
            userId : this.user._id,
            fromAddress: this.user.EthAddress,
            toAddress:this.withdrawDetails.toAddress,
            amount: this.withdrawDetails.amount,
            password:this.withdrawDetails.password
        };

        const url = this.global_service.basePath + 'ETH/withdrawEth';
        this.global_service.PostRequest(url, postData).subscribe(response => {          
            if (response[0].json.status == 200) {
                this.withDrawForm.reset();
                this.getBalance();
                this.withdrawDialog = false;
                this.messageService.add({ severity: 'success', summary: response[0].json.json().message
              });
             } else
              {                  
                 this.messageService.add({ severity: 'error', summary: response[0].json.json().message
              });
                this.withDrawForm.reset();
                this.withdrawDialog = false;
            }
        })
    }



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

}
