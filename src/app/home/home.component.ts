import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { HomeService } from './home.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private homeService: HomeService, private router: Router, private message: NzMessageService) { }

  ngOnInit(): void {
  }

  openMap: { [name: string]: boolean } = {
    sub1: true,
    sub2: false,
    sub3: false
  };

  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }

  confirm(e: Event){
    e.preventDefault();

    this.homeService.logout().subscribe((res:any) => {
      this.message.create('success', "Logout succeed")
      localStorage.removeItem('jwt-token');
      this.router.navigateByUrl('/login');
    }, (err:any) => {
      this.message.create('warning', "Logout Failed")
    })
  }

  logout(){
    this.homeService.logout().subscribe((res:any) => {
      this.message.create('success', "Logout succeed")
      localStorage.removeItem('jwt-token');
      this.router.navigateByUrl('/login');
    }, (err:any) => {
      this.message.create('warning', "Logout Failed")
    })
  }
}
