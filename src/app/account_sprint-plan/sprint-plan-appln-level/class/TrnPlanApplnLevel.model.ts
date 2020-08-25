export class TrnPlanApplnLevel {    
    Integration_ID : string = '' ;
    STANDARD_ACTIVITY_ID : string = '' ;
    STANDARD_ACTIVITY_NAME : string  = '' ;
    MILESTONE_OR_TASK : string = '' ;
    PHASE_NAME:string ='';
    AppName :string = '';
    STANDARD_ACTIVITY_CREATED_BY : string = '' ;
    STANDARD_ACTIVITY_LAST_UPDATED_BY : string = '' ;         
    STANDARD_ACTIVITY_CREATED_AT : string ='' ;
    STANDARD_ACTIVITY_LAST_UPDATED_AT : string = '';
    CheckedValue : number ;
    Plan_Start_Date : string='';
    Plan_End_Date : string='';
    RePlan_Start_Date : string='';
    RePlan_End_Date : string='';
    Actual_Start_Date: string ='';
    Actual_End_Date: string ='';
    Baselined : number;
    save :string;
    insert :string;
    Owner_Name : string;
    Comments : string;
}