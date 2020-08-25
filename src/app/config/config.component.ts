import { Subscription } from 'rxjs';
import { UserNameService } from './../../../Services/user-name.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  constructor(private ser : UserNameService ) { }

  ngOnInit() {
    this.ser.getIBMusername().subscribe(res=>{
      console.log(res)
      console.log(res._json.emailAddress)
    } )
  }

}
