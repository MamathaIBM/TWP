
export interface RiskAnalyzer_Account {
    TRA_UNID : number ;
    TRA_EX_UNID : number;
    Risk_ID: string ;
    Risk_Category :  string ;
    Risk_Attribute : string ;
    Planned_Mitigation_Action : string ;
    CREATED_AT : Date ;
    LAST_UPDATED_AT : Date ;
    CREATED_BY : string ;
    LAST_UPDATED_BY : string ;
    save : string;
    insert : string;
    fetch : string;
    Delete:string;
    flag: number;
    acFlag : number;
    Risk_Impact:string;
    Risk_Probability : string;
    Risk_Type : string;
    RiskLog_Flag : number;
}

