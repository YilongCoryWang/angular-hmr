import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginForm, Token } from './login.type';
import { JWT_SERVER } from '../config';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private http: HttpClient) { }

  login(loginForm: LoginForm){
    return this.http.post<Token>(`${JWT_SERVER}/auth/login`, {
      email: loginForm.username,
      password: loginForm.password
    }, {
      headers: {"NO-AUTH": "TRUE"}
    });
  }
}
