import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, LocationStrategy, HashLocationStrategy, DatePipe } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; 
import { FileUploadModule } from 'ng2-file-upload';
import { ToasterModule, ToasterContainerComponent, ToasterService, ToasterConfig} from 'angular2-toaster';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { PaginatorModule, CalendarModule, ListboxModule, TabViewModule, AccordionModule, MenuItem, MultiSelectModule, SliderModule, DialogModule, ConfirmDialogModule, DataTableModule,ConfirmationService } from 'primeng/primeng';
import { NavbarModule } from './../shared/navbar/navbar.module';
import { EqualValidator } from './../Directives/validation.directive';
import { SidebarComponent } from './sidebar.component';
import { DashboardComponent } from './../dashboard/dashboard.component';
import { ViewUserComponent } from './../dashboard/UserList/view-user/view-user.component';
 import { MyProfileComponent } from './../dashboard/UserList/my-profile/my-profile.component';
 import { SettingComponent } from './../dashboard/UserList/setting/setting.component';
 import { HelpComponent } from './../dashboard/UserList/help/help.component';
 import { InvestIcoComponent } from './../dashboard/UserList/investIco/investIco.component';
import { childComponent } from './../dashboard/error404/error404.component';
import { routing } from './sidebar.routing';
import { AuthGuard } from './../auth-guard.service';
import { FilterPipe } from './../Pipes/pipe';

import { SelectModule } from 'ng2-select';


@NgModule({
    imports: [ 
        RouterModule, 
        CommonModule, 
        routing,
        HttpModule,
        NavbarModule,
        NoopAnimationsModule,
        MultiSelectModule, 
        TabViewModule,
        FormsModule,
        ReactiveFormsModule,
        PaginatorModule, 
        DataTableModule,
        CalendarModule,
        AccordionModule, 
        ListboxModule,
        SliderModule,
        FileUploadModule,
        DialogModule,
        ConfirmDialogModule,
        SelectModule,
        ToasterModule,
        ],

    providers: [AuthGuard, { provide: LocationStrategy, useClass: HashLocationStrategy }, DatePipe, ToasterService, ConfirmationService],
    
    declarations: [ 
       // FilterPipe,
        EqualValidator,
        SidebarComponent,
        DashboardComponent,
        ViewUserComponent, 
        MyProfileComponent,
        SettingComponent,
        HelpComponent,
        InvestIcoComponent,
        childComponent,
     ],

    exports: [ SidebarComponent ]
})

export class SidebarModule {}
