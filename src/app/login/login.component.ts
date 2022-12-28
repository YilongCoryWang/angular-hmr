import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators, ValidatorFn } from '@angular/forms';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { LoginForm, Token } from './login.type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  loginForm!: UntypedFormGroup;

  submitForm(): void {
    if (this.loginForm.valid) {
      const {userName, password} = this.loginForm.value;
      const loginParams: LoginForm = {
        username: userName,
        password: password
      }
      this.loginService.login(loginParams).subscribe((res: Token) => {
        localStorage.setItem("jwt-token", res.access_token);
        this.router.navigateByUrl("/home");
      });
    } else {
      Object.values(this.loginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  constructor(private fb: UntypedFormBuilder, private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    const { maxLength, minLength } = MyValidators;

    this.loginForm = this.fb.group({
      userName: ["nilson@email.com", [Validators.required, minLength(3), maxLength(16)]],
      password: ["nilson", [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{3,6}$/)]],
      remember: [true]
    });
  }
}

// current locale is key of the MyErrorsOptions
export type MyErrorsOptions = { 'zh-cn': string; en: string } & Record<string, NzSafeAny>;
export type MyValidationErrors = Record<string, MyErrorsOptions>;

export class MyValidators extends Validators {
  static override minLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.minLength(minLength)(control) === null) {
        return null;
      }
      return { minlength: { 'zh-cn': `最小长度为 ${minLength}`, en: `MinLength is ${minLength}` } };
    };
  }

  static override maxLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.maxLength(maxLength)(control) === null) {
        return null;
      }
      return { maxlength: { 'zh-cn': `最大长度为 ${maxLength}`, en: `MaxLength is ${maxLength}` } };
    };
  }
}