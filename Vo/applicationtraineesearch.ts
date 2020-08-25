export class ApplicationTraineeSearch {
    applicationId:string;
    applicationName:string;  
    epicId:string;
    epicName:string;
    sprintId:string;
    sprintName:string;  
    newEpic:boolean;
    newSprint:boolean;  
    sprintList:string[];
    appList:string[];
    overallAppList:string[];
    epicControlCounter:number;
    sprintControlCounter:number;
    appControlCounter:number;
    fte:number;   // Number of FTEes supporting this application
    traineeCount:number; //Number of trainees supporting the application
    trainees:string // associated trainee Ids comma seperated string 
    traineeIds:string // associated trainee Ids comma seperated string 

}



