import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.headers.get("NO-AUTH") === "TRUE"){
      const noAuthReq = req.clone({
        headers: req.headers.delete("NO-AUTH")
      })
      return next.handle(noAuthReq);
    }

    const token = localStorage.getItem("jwt-token");

    const authReq = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${token}`)
    })
    console.log("Http interceptor: ", authReq);
    return next.handle(authReq).pipe(
      tap(
        res => {},
        err => {
          if(err.status == 401){
            localStorage.removeItem("jwt-token");
            this.router.navigateByUrl("/login");
          }
        }
      )
    );
  }
}
