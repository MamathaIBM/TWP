import {HostListener} from "@angular/core";
import { NavtntService } from '../navtnt.service';

export abstract class ComponentCanDeactivate {
 
  abstract  canDeactivate(): boolean;



    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (!this.canDeactivate()) {
            $event.returnValue =true;        
        }
    }
}