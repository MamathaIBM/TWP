import { CustomValidators } from './../../Services/custom_validators';
// import { FormService } from './../../Services/form';
import { TransitionProfileComponent } from './transition-profile/transition-profile.component';
import { ActiveTransitionsService } from './manage-active-transitions/active-transitions.service';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { NewExecutionService } from './new-execution/service/new-execution.service';
import { ConfigComponent } from './config/config.component';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common'; 
import { MatCheckboxModule, MatProgressSpinnerModule, MatDialogModule} from '@angular/material';
import { MatRadioModule } from '@angular/material';
import { MatOptionModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material';
import { MatListModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material';
import { MatNativeDateModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { TransitionMainMenuComponent } from './transition-main-menu/transition-main-menu.component';
import { CommonModule } from '@angular/common';
import { MatMenuModule} from '@angular/material/menu';
import { TopNavigationComponent } from './top-navigation/top-navigation.component';
import { ControllerTntComponent } from './controller-tnt/controller-tnt.component';
import { HomePageComponent } from './home-page/home-page.component';
//import { ViewConsentformComponent } from './view-consentform/view-consentform.component';
import { ConsentFormComponent } from './consent-form/consent-form.component';
// import { TransitionClosureComponent } from './transition-closure/transition-closure.component';
import { ManageActiveTransitionsComponent } from './manage-active-transitions/manage-active-transitions.component';
import { AllTransitionAccountsComponent } from './all-transition-accounts/all-transition-accounts.component';
import { NewExecutionComponent } from './new-execution/new-execution.component';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransitionMainComponent } from './transition-main/transition-main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatTabsModule} from '@angular/material/tabs';
import { AllTransitionAccountsService } from 'src/app/all-transition-accounts/service/all-transition-accounts.service';
import { MatSelectModule, MatTooltipModule, MatPaginatorModule, MatFormFieldModule, MatTableModule } from '@angular/material';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { MenuAdminHorizontalComponent } from './menu-admin-horizontal/menu-admin-horizontal.component';
import { MenuTopComponent } from './menu-top/menu-top.component';
import { MenuLeftComponent } from './menu-left/menu-left.component';
import { ConfigLoaderComponent } from './config-loader/config-loader.component';
import { StorageServiceModule } from 'angular-webstorage-service';
// import { LoginScreenComponent } from './login-screen/login-screen.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { TransitionListComponent } from './transition-list/transition-list.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ServiceForm } from 'Services/form'; 
import { CanDeactivateGuard } from './can-deactivate/can-deactivate.guard';
import { OTPStreamDialog } from './transition-main-menu/transition-main-menu.component';
import { ReportMenuComponent, OrgWSRDialog } from './report-menu/report-menu.component';
import {MatCardModule} from '@angular/material/card';


//import { FunctionalityListComponent } from './functionality-list/functionality-list.component';


const routes: Routes = [
  { path: 'NewExecutionComponent', component: NewExecutionComponent  },
  { path: 'AllTransitionAccountsComponent', component: AllTransitionAccountsComponent },
  { path: 'ManageActiveTransitionsComponent', component: ManageActiveTransitionsComponent },    
  { path: 'Reports', component: ReportMenuComponent  },
  { path: 'ConsentFormComponent', component: ConsentFormComponent }, 
  { path: 'menu-top', component: MenuTopComponent }, 
  { path: 'menu-left', component: MenuLeftComponent }, 
  // { path: 'login-screen', component: LoginScreenComponent }, 
  { path: 'access-denied', component: AccessDeniedComponent }, 
  
  { path:  'transition-Main', component : TransitionMainComponent,
    
    children: [
      {
        path : '',
        component : TransitionProfileComponent,
        canDeactivate: [CanDeactivateGuard]
      },
  
      {
        path : 'stakeholder', 
        loadChildren : './Master/transition-stakeholder/transition-stakeholder-module/transition-stakeholder.module#TransitionStakeholderModule' 
      },
      {
        path : 'trainee-info',
        loadChildren : './Master/trainee/trainee/trainee.module#TraineeModule'
      }, 
      {
        path : 'application-info', 
        loadChildren : './Master/application-information/application-information/application-information.module#ApplicationInformationModule' 
                       
      },    
      {
        path : 'application-server',       
           loadChildren : './Master/application-servers/application-servers/application-servers.module#ApplicationServersModule'
      },
      {
        path : 'master-stInfo',       
           loadChildren : './Master/service-transition-info/module/service-transition-info.module#ServiceTransitionInfoModule'
      },
      {
        //isha
        path : 'seven-key',       
        loadChildren : './Manage-Sprint/seven-key/seven-key-module/seven-key-module.module#SevenKeyModuleModule'
           
      },
      {
        path : 'raid-add-update', 
        loadChildren : './Manage-Sprint/raid-add-update/raid-add-update-module/raid-add-update.module#RaidAddUpdateModule' 
      },
      {
        path : 'raid', 
        loadChildren : './Manage-Sprint/raid/raid-module/raid.module#RaidModule' 
      }, 
      {
        path : 'ContractualDeliverables',        
        loadChildren : './Master/contractual-deliverables/contractual-deliverables/contractual-deliverables.module#ContractualDeliverablesModule'
     },
	  {
      path : 'ExecutionTeam',      
      loadChildren : './Master/execution-team/execution-team/execution-team.module#ExecutionTeamModule'
     },
     {
      path : 'TransitionTeam',
      loadChildren : './Master/transition-team/transition-team/transition-team.module#TransitionTeamModule'
     },
	   {
      path : 'TWBS',      
      loadChildren : './account_sprint-plan/tailored-wbs/Tailored-WBS/tailored-wbs.module#TailoredWBSModule'
     },
	   {
      path : 'TEC',      
      loadChildren : './account_sprint-plan/tailored-exitcriteria/tailored-exitcriteria/tailored-exitcriteria.module#TailoredExitcriteriaModule'
     },
     {
      path : 'ECAccount',      
      loadChildren : './account_sprint-plan/exitcriteriaaccounts/exitcriteriaaccounts/exitcriteriaaccounts.module#ExitcriteriaaccountsModule'
     },
     {
      path : 'SB',      
      loadChildren : './account_sprint-plan/tailored-service-backlog/tailored-service-backlog/tailored-service-backlog.module#TailoredServiceBacklogModule'
     },
     {
       path : 'SPB',
       loadChildren : './account_sprint-plan/tailored-sprint-backlog/tailored-sprint-backlog/tailored-sprint-backlog.module#TailoredSprintBacklogModule'
     },
     {
       path : 'epic',
       loadChildren : './account_sprint-plan/define-epic/define-epic/define-epic.module#DefineEpicModule'
     },
     {
      path : 'sprint',
      loadChildren : './account_sprint-plan/epic-sprint-plan/epic-sprint-plan/epic-sprint-plan.module#EpicSprintPlanModule'
    },
     
     { 
       path : 'SprintScope',     
       loadChildren : './account_sprint-plan/sprint-scope/sprint-scope/sprint-scope.module#SprintScopeModule'
     },     
     { 
       path : 'SprintLevelPlan',     
       loadChildren : './account_sprint-plan/Transition-Sprint-Plan/sprint-level-plan/sprint-level-plan.module#SprintLevelPlanModule'
     },  
     { 
      path : 'SprintApplnLevelPlan',     
      loadChildren : './account_sprint-plan/sprint-plan-appln-level/sprint-plan-appln-level/sprint-plan-appln-level.module#SprintPlanApplnLevelModule'
    },
     { 
      path : 'DeliverCompletion',     
      loadChildren : './deliverable-completion/deliverable-completion/deliverable-completion.module#DeliverableCompletionModule'
     },
     { 
      path : 'TranstionClosure',     
      loadChildren : './transition-closure/transition-closure/transition-closure.module#TransitionClosureModule'
     }, 
        // Health & Readiness ############################################     
     {
       path : 'parameter-custom-list', 
       loadChildren : './health-readiness-factors-and-adhoc-trackers/parameter-custom-list/parameter-custom-list.module#ParameterCustomListModule' 
     },   
     {
      path : 'parameter-custom-edit', 
      loadChildren : './health-readiness-factors-and-adhoc-trackers/parameter-custom-edit/parameter-custom-edit.module#ParameterCustomEditModule' 
     },    
     {
      path : 'parameter-custom-add', 
      loadChildren : './health-readiness-factors-and-adhoc-trackers/parameter-custom-add/parameter-custom-add.module#ParameterCustomAddModule' 
     },        
     {
      path : 'readiness-question-tracking-list', 
      loadChildren : './health-readiness-factors-and-adhoc-trackers/readiness-question-tracking-list/readiness-question-tracking-list.module#ReadinessQuestionTrackingListModule' 
    },
    {
      path : 'readiness-question-tracking-save', 
      loadChildren : './health-readiness-factors-and-adhoc-trackers/readiness-question-tracking-save/readiness-question-tracking-save.module#ReadinessQuestionTrackingSaveModule' 
    },   
    {
      path : 'readiness-question-design-list', 
      loadChildren : './health-readiness-factors-and-adhoc-trackers/readiness-question-design-list/readiness-question-design-list.module#ReadinessQuestionDesignListModule' 
    }, 
    {
      path : 'readiness-question-design-save', 
      loadChildren : './health-readiness-factors-and-adhoc-trackers/readiness-question-design-save/readiness-question-design-save.module#ReadinessQuestionDesignSaveModule' 
    },      
    {
      path : 'readiness-question-adopt', 
      loadChildren : './health-readiness-factors-and-adhoc-trackers/readiness-question-adopt/readiness-question-adopt.module#ReadinessQuestionAdoptModule' 
    },     
    {
      path : 'readiness-question-design-add', 
      loadChildren : './health-readiness-factors-and-adhoc-trackers/readiness-question-design-add/readiness-question-design-add.module#ReadinessQuestionDesignAddModule' 
    },   
    {
      path : 'readiness-question-design-edit', 
      loadChildren : './health-readiness-factors-and-adhoc-trackers/readiness-question-design-edit/readiness-question-design-edit.module#ReadinessQuestionDesignEditModule' 
    },       
    {
      path : 'parameter-custom-tracking-list', 
      loadChildren : './health-readiness-factors-and-adhoc-trackers/parameter-custom-tracking-list/parameter-custom-tracking-list.module#ParameterCustomTrackingListModule' 
     },
     {
      path : 'parameter-custom-adopt', 
      loadChildren : './health-readiness-factors-and-adhoc-trackers/parameter-custom-adopt/parameter-custom-adopt.module#ParameterCustomAdoptModule' 
     },     

     {
      path : 'readiness-question-tracking-landscape-list', 
      loadChildren : './health-readiness-factors-and-adhoc-trackers/readiness-question-tracking-landscape-list/readiness-question-tracking-landscape-list.module#ReadinessQuestionTrackingLandscapeListModule' 
    },
    {
      path : 'readiness-question-tracking-delete', 
      loadChildren : './health-readiness-factors-and-adhoc-trackers/readiness-question-tracking-delete/readiness-question-tracking-delete.module#ReadinessQuestionTrackingDeleteModule' 
    },
    {
      path : 'app-filter-simple', 
      loadChildren : './health-readiness-factors-and-adhoc-trackers/app-filter-simple/app-filter-simple.module#AppFilterSimpleModule' 
    },
     {
      path : 'app-trainee-mapping',
      loadChildren : './Master/app-trainee-mapping/app-trainee-mapping.module#AppTraineeMappingModule'
     },
     {
      path : 'app-trainee-map-upload',
      loadChildren : './Master/app-trainee-map-upload/app-trainee-map-upload.module#AppTraineeMapUploadModule'
     },   
     {
      path : 'app-trainee-map-delete',
      loadChildren : './Master/app-trainee-map-delete/app-trainee-map-delete.module#AppTraineeMapDeleteModule'
     }, 
     {
      path : 'app-trainee-map-edit',
      loadChildren : './Master/app-trainee-map-edit/app-trainee-map-edit.module#AppTraineeMapEditModule'
     },
     {
       path : 'transition_R_A_Account',
       loadChildren : './transition-risk-analyzer-account/transition-risk-analyzer-account/transition-risk-analyzer-account.module#TransitionRiskAnalyzerAccountModule'
     },
         // ############################################# Adhoc Report ##############################################
     {
      path : 'custom-report-list', 
      loadChildren : './adhoc-report/custom-report-list/custom-report-list.module#CustomReportListModule' 
    },
    {
      path : 'custom-report-add', 
      loadChildren : './adhoc-report/custom-report-add/custom-report-add.module#CustomReportAddModule' 
    }, 
    {
      path : 'section-text-add', 
      loadChildren : './adhoc-report/section-text-add/section-text-add.module#SectionTextAddModule' 
    },
    {
      path : 'section-table-add', 
      loadChildren : './adhoc-report/section-table-add/section-table-add.module#SectionTableAddModule' 
    },
    {
      path : 'section-image-add', 
      loadChildren : './adhoc-report/section-image-add/section-image-add.module#SectionImageAddModule' 
    },     
    {
      path : 'custom-report-list-adopt', 
      loadChildren : './adhoc-report/custom-report-list-adopt/custom-report-list-adopt.module#CustomReportListAdoptModule' 
    },
    {
      path : 'custom-report-add-adopt', 
      loadChildren : './adhoc-report/custom-report-add-adopt/custom-report-add-adopt.module#CustomReportAddAdoptModule' 
    }           
      
    ],
    
  },

  { path:  'admin-home', component : AdminHomeComponent,

  children: [    
    {
      path : 'phase-activity-create', 
      loadChildren : './standard-activity/phase-activity-create/phase-activity-create.module#PhaseActivityCreateModule' 
    },    
    {
      path : 'exit-criteria-create', 
      loadChildren : './standard-exit-criteria/exit-criteria-create/exit-criteria-create.module#ExitCriteriaCreateModule'
    },
    {
      path : 'functionality-list', 
      loadChildren : './user-access-and-security/functionality-list/functionality-list.module#FunctionalityListModule' 
    },

    {
      path : 'functionality-edit', 
      loadChildren : './user-access-and-security/functionality-edit/functionality-edit.module#FunctionalityEditModule' 
    },      
    {
      path : 'functionality-add', 
      loadChildren : './user-access-and-security/functionality-add/functionality-add.module#FunctionalityAddModule' 
    }, 
    {
      path : 'functionality-upload', 
      loadChildren : './user-access-and-security/functionality-upload/functionality-upload.module#FunctionalityUploadModule' 
    }, 
    {
      path : 'role-list', 
      loadChildren : './user-access-and-security/role-list/role-list.module#RoleListModule' 
    },   
    {
      path : 'role-add', 
      loadChildren : './user-access-and-security/role-add/role-add.module#RoleAddModule' 
    },      
    {
      path : 'role-edit', 
      loadChildren : './user-access-and-security/role-edit/role-edit.module#RoleEditModule' 
    },  
    {
      path : 'role-functionality', 
      loadChildren : './user-access-and-security/role-functionality/role-functionality.module#RoleFunctionalityModule' 
    },   
    {
      path : 'role-functionality-add', 
      loadChildren : './user-access-and-security/role-functionality-add/role-functionality-add.module#RoleFunctionalityAddModule' 
    },      
    {
      path : 'user-list', 
      loadChildren : './user-access-and-security/user-list/user-list.module#UserListModule' 
    },
    {
      path : 'user-add', 
      loadChildren : './user-access-and-security/user-add/user-add.module#UserAddModule' 
    },
    {
      path : 'user-edit', 
      loadChildren : './user-access-and-security/user-edit/user-edit.module#UserEditModule' 
    },
    
    {
      path : 'user-role-list', 
      loadChildren : './user-access-and-security/user-role-list/user-role-list.module#UserRoleListModule' 
    },    
    
    {
      path : 'user-role-add', 
      loadChildren : './user-access-and-security/user-role-add/user-role-add.module#UserRoleAddModule' 
    },
    
    {
      path : 'phase-activity-add', 
      loadChildren : './standard-activity/phase-activity-add/phase-activity-add.module#PhaseActivityAddModule' 
    },
    
    {
      path : 'phase-activity-list', 
      loadChildren : './standard-activity/phase-activity-list/phase-activity-list.module#PhaseActivityListModule' 
    },
    {
      path : 'service-backlog-activity-list', 
      loadChildren : './standard-activity/service-backlog-activity-list/service-backlog-activity-list.module#ServiceBacklogActivityListModule' 
    },              
    {
      path : 'sprint-backlog-activity-list', 
      loadChildren : './standard-activity/sprint-backlog-activity-list/sprint-backlog-activity-list.module#SprintBacklogActivityListModule' 
    } ,
    {
      path : 'plan-phase-activity-list', 
      loadChildren : './standard-activity/plan-phase-activity-list/plan-phase-activity-list.module#PlanPhaseActivityListModule' 
    },
    
    {
      path : 'learn-phase-activity-list', 
      loadChildren : './standard-activity/learn-phase-activity-list/learn-phase-activity-list.module#LearnPhaseActivityListModule' 
    },                  
    {
      path : 'perform-phase-activity-list', 
      loadChildren : './standard-activity/perform-phase-activity-list/perform-phase-activity-list.module#PerformPhaseActivityListModule' 
    },
    // {
    //   path : 'st-phase-activity-list', 
    //   loadChildren : './standard-activity/st-standard-activity-list/st-standard-activity-list.module#StStandardActivityListModule'
    // },
    {
      path : 'st-plan-phase-activity-list', 
      loadChildren : './standard-activity/st-admin-plan-phase-activity-list/st-admin-plan-phase-activity-list.module#StAdminPlanPhaseActivityListModule'
    },
    {
      path : 'st-define-phase-activity-list', 
      loadChildren : './standard-activity/st-admin-define-phase-activity-list/st-admin-define-phase-activity-list.module#StAdminDefinePhaseActivityListModule'
    },
    {
      path : 'st-implement-phase-activity-list', 
      loadChildren : './standard-activity/st-admin-implement-phase-activity-list/st-admin-implement-phase-activity-list.module#StAdminImplementPhaseActivityListModule'
    },
    {
      path : 'st-handover-phase-activity-list', 
      loadChildren : './standard-activity/st-admin-handover-phase-activity-list/st-admin-handover-phase-activity-list.module#StAdminHandoverPhaseActivityListModule'
    },
    {
      path : 'st-plan-phase-exit-activity-list', 
      loadChildren : './standard-exit-criteria/st-admin-plan-phase-exit-activity-list/st-admin-plan-phase-exit-activity-list.module#StAdminPlanPhaseExitActivityListModule'
    },
    {
      path : 'st-define-phase-exit-activity-list', 
      loadChildren : './standard-exit-criteria/st-admin-define-phase-exit-activity-list/st-admin-define-phase-exit-activity-list.module#StAdminDefinePhaseExitActivityListModule'
    },
    {
      path : 'st-implement-phase-exit-activity-list', 
      loadChildren : './standard-exit-criteria/st-admin-implement-phase-exit-activity-list/st-admin-implement-phase-exit-activity-list.module#StAdminImplementPhaseExitActivityListModule'
    },
    {
      path : 'st-handover-phase-exit-activity-list', 
      loadChildren : './standard-exit-criteria/st-admin-handover-phase-exit-activity-list/st-admin-handover-phase-exit-activity-list.module#StAdminHandoverPhaseExitActivityListModule'
    },
    
    // {
    //   path : 'st-standard-exit-acitivity-list', 
    //   loadChildren : './standard-exit-criteria/st-standard-exit-acitivity-list/st-standard-exit-acitivity-list.module#StStandardExitAcitivityListModule'
    // },
    {
      path : 'exit-criteria-list', 
      loadChildren : './standard-exit-criteria/exit-criteria-list/exit-criteria-list.module#ExitCriteriaListModule'
    },
    {
      path : 'exit-criteria-add', 
      loadChildren : './standard-exit-criteria/exit-criteria-add/exit-criteria-add.module#ExitCriteriaAddModule'
    },      
    {
      path : 'service-backlog-exit-criteria-list', 
      loadChildren : './standard-exit-criteria/service-backlog-exit-criteria-list/service-backlog-exit-criteria-list.module#ServiceBacklogExitCriteriaListModule' 
    },
        
    {
      path : 'sprint-backlog-exit-criteria-list', 
      loadChildren : './standard-exit-criteria/sprint-backlog-exit-criteria-list/sprint-backlog-exit-criteria-list.module#SprintBacklogExitCriteriaListModule' 
    } ,
    {
      path : 'plan-phase-exit-criteria-list', 
      loadChildren : './standard-exit-criteria/plan-phase-exit-criteria-list/plan-phase-exit-criteria-list.module#PlanPhaseExitCriteriaListModule' 
    },
    
    {
      path : 'learn-phase-exit-criteria-list', 
      loadChildren : './standard-exit-criteria/learn-phase-exit-criteria-list/learn-phase-exit-criteria-list.module#LearnPhaseExitCriteriaListModule' 
    },                  
    {
      path : 'perform-phase-exit-criteria-list', 
      loadChildren : './standard-exit-criteria/perform-phase-exit-criteria-list/perform-phase-exit-criteria-list.module#PerformPhaseExitCriteriaListModule' 
    }, 
    {
      path : 'closure-phase-activity-list', 
      loadChildren : './standard-activity/closure-phase-activity-list/closure-phase-activity-list.module#ClosurePhaseActivityListModule' 
    },                  
    {
      path : 'closure-phase-exit-criteria-list', 
      loadChildren : './standard-exit-criteria/closure-phase-exit-criteria-list/closure-phase-exit-criteria-list.module#ClosurePhaseExitCriteriaListModule' 
    },    
    {
      path : 'readiness-question-list', 
      loadChildren : './health-readiness-factors-and-adhoc-trackers/readiness-question-list/readiness-question-list.module#ReadinessQuestionListModule' 
    },
    {
      path : 'readiness-question-add', 
      loadChildren : './health-readiness-factors-and-adhoc-trackers/readiness-question-add/readiness-question-add.module#ReadinessQuestionAddModule' 
    },  
    {
      path : 'readiness-question-edit', 
      loadChildren : './health-readiness-factors-and-adhoc-trackers/readiness-question-edit/readiness-question-edit.module#ReadinessQuestionEditModule' 
    },                                 
    {
      path : 'parameter-list', 
      loadChildren : './health-readiness-factors-and-adhoc-trackers/parameter-list/parameter-list.module#ParameterListModule' 
    },                                            
    {
      path : 'parameter-add', 
      loadChildren : './health-readiness-factors-and-adhoc-trackers/parameter-add/parameter-add.module#ParameterAddModule' 
    },
    {
      path : 'parameter-edit', 
      loadChildren : './health-readiness-factors-and-adhoc-trackers/parameter-edit/parameter-edit.module#ParameterEditModule' 
    }   ,{
      path : 'phase-activity-edit', 
      loadChildren : './standard-activity/phase-activity-edit/phase-activity-edit.module#PhaseActivityEditModule' 
    },
    {
      path : 'exit-criteria-edit', 
      loadChildren : './standard-exit-criteria/exit-criteria-edit/exit-criteria-edit.module#ExitCriteriaEditModule' 
    },
    {
      path : 'config-parameter-list', 
      loadChildren : './global-config-parameters/config-parameter-list/config-parameter-list.module#ConfigParameterListModule' 
    },  
    {
      path : 'config-parameter-delete', 
      loadChildren : './global-config-parameters/config-parameter-delete/config-parameter-delete.module#ConfigParameterDeleteModule' 
    },      
    {
      path : 'config-parameter-values', 
      loadChildren : './global-config-parameters/config-parameter-values/config-parameter-values.module#ConfigParameterValuesModule' 
    },
    {
      path : 'config-parameter-values-add', 
      loadChildren : './global-config-parameters/config-parameter-values-add/config-parameter-values-add.module#ConfigParameterValuesAddModule' 
    },
    {
      path : 'config-parameter-values-edit', 
      loadChildren : './global-config-parameters/config-parameter-values-edit/config-parameter-values-edit.module#ConfigParameterValuesEditModule' 
    },
    {
      path : 'config-parameter-values-delete', 
      loadChildren : './global-config-parameters/config-parameter-values-delete/config-parameter-values-delete.module#ConfigParameterValuesDeleteModule' 
    },     

    {
      path : 'Riskanalyzer-Admin',
      loadChildren : './transition-risk-analyzer-admin/transition-risk-analyzer-admin/transition-risk-analyzer-admin.module#TransitionRiskAnalyzerAdminModule'
    },
    {
      path : 'content-type-list', 
      loadChildren : './adhoc-report/content-type-list/content-type-list.module#ContentTypeListModule' 
    },
    {
      path : 'content-type-add', 
      loadChildren : './adhoc-report/content-type-add/content-type-add.module#ContentTypeAddModule' 
    },       
    {
      path : 'content-type-edit', 
      loadChildren : './adhoc-report/content-type-edit/content-type-edit.module#ContentTypeEditModule' 
    },
    {
      path : 'custom-report-list-admin', 
      loadChildren : './adhoc-report/custom-report-list-admin/custom-report-list-admin.module#CustomReportListAdminModule' 
    },
    {
      path : 'custom-report-add-admin', 
      loadChildren : './adhoc-report/custom-report-add-admin/custom-report-add-admin.module#CustomReportAddAdminModule' 
    },
    {
      path : 'custom-report-list', 
      loadChildren : './adhoc-report/custom-report-list/custom-report-list.module#CustomReportListModule' 
    }, 
    {
      path : 'custom-report-add', 
      loadChildren : './adhoc-report/custom-report-add/custom-report-add.module#CustomReportAddModule' 
    }, 
    {
      path : 'section-text-add', 
      loadChildren : './adhoc-report/section-text-add/section-text-add.module#SectionTextAddModule' 
    },
    {
      path : 'section-table-add', 
      loadChildren : './adhoc-report/section-table-add/section-table-add.module#SectionTableAddModule' 
    },
    {
      path : 'section-image-add', 
      loadChildren : './adhoc-report/section-image-add/section-image-add.module#SectionImageAddModule' 
    },
    {
      path : 'custom-report-list-org', 
      loadChildren : './adhoc-report/custom-report-list-org/custom-report-list-org.module#CustomReportListOrgModule' 
    },
    {
      path : 'custom-report-list-global', 
      loadChildren : './adhoc-report/custom-report-list-global/custom-report-list-global.module#CustomReportListGlobalModule' 
    },
    {
      path : 'custom-report-add-global', 
      loadChildren : './adhoc-report/custom-report-add-global/custom-report-add-global.module#CustomReportAddGlobalModule' 
    },    
    {
      path : 'custom-report-add-org', 
      loadChildren : './adhoc-report/custom-report-add-org/custom-report-add-org.module#CustomReportAddOrgModule' 
    },           
  ],

    
  },

  {
     path : 'ViewConsentformComponent',
     loadChildren : './view-consentform/view-consentform/view-consentform.module#ViewConsentformModule'
  },
     
  {
    path : 'ToolGuideComponent',
    loadChildren : './tool-guide/tool-guide/tool-guide.module#ToolGuideModule'
  },
  { path: 'HomePageComponent', component: HomePageComponent },
    { path: '', component:ConfigLoaderComponent  },
  { path: 'controller-tnt', component: ControllerTntComponent },
  { path: 'transition-list', component: TransitionListComponent },
    
];



@NgModule({
  declarations : [  

    TransitionMainComponent,
    NewExecutionComponent,
    AllTransitionAccountsComponent,
    ManageActiveTransitionsComponent,
    ReportMenuComponent,
    // TransitionClosureComponent,
    ConsentFormComponent,
    TransitionMainMenuComponent,
    TopNavigationComponent,
//    ViewConsentformComponent,
 //   ToolGuideComponent,
    HomePageComponent,
    ControllerTntComponent,
    ConfigComponent,
    TransitionProfileComponent,
    AdminHomeComponent,
    MenuAdminHorizontalComponent,
    MenuLeftComponent,
    // MenuPocComponent,
    MenuTopComponent,
    ConfigLoaderComponent,
    // LoginScreenComponent,
    AccessDeniedComponent,
    TransitionListComponent,
    OTPStreamDialog,
    OrgWSRDialog
    
  ],
  imports: [RouterModule.forRoot(routes),
    CommonModule,
    MatMenuModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatTabsModule,
    MatSelectModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    StorageServiceModule, 
    MatRadioModule,
    MatDialogModule,   
    MatCardModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-full-width',
      maxOpened: 1,
      autoDismiss: true,
  })
],
providers:[CanDeactivateGuard,
  AllTransitionAccountsService ,
  NewExecutionService,
  ActiveTransitionsService,
  ToastrService,
  DatePipe,
  CustomValidators,
  
//   FormService,
  ServiceForm
  
  ],
  entryComponents: [OTPStreamDialog,OrgWSRDialog],
  exports: [RouterModule,TopNavigationComponent,ConfigLoaderComponent]
})
export class AppRoutingModule { }
