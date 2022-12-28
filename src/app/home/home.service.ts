import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JWT_SERVER } from '../config';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  logout(){
    const token = localStorage.getItem("jwt-token");
    return this.http.delete(`${JWT_SERVER}/auth/logout`);
  }
}
