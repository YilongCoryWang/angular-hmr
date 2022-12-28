import { Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EmployeesService } from '../employees.service';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css']
})
export class EmployeeAddComponent implements OnInit{

  constructor(private fb: UntypedFormBuilder, private employeesService: EmployeesService,
    private message: NzMessageService, private router: Router) {}

  employeeAddForm!: UntypedFormGroup;
  date = null;

  ngOnInit(): void {
    this.employeeAddForm = this.fb.group({
      name: ['', [Validators.required], [this.userNameAsyncValidator]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', [Validators.pattern(/^0\d{9}$/)]],
      startdate: ['', [this.startDateValidator]],
    });
  }

  submitForm(): void {
    const startDate = this.employeeAddForm.value.startdate;
    const params = {...this.employeeAddForm.value, startdate: startDate?.getTime()};
    this.employeesService.addEmployee(params).subscribe(res => {
      console.log(res)
      this.resetFormInfo();
      this.message.success("New employee created!");
      this.router.navigateByUrl("/home/employee");
    })
  }

  resetFormInfo(){
    this.employeeAddForm.reset({gender: "0"});
    for (const key in this.employeeAddForm.controls) {
      if (this.employeeAddForm.controls.hasOwnProperty(key)) {
        this.employeeAddForm.controls[key].markAsPristine();
        this.employeeAddForm.controls[key].updateValueAndValidity();
      }
    }
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.resetFormInfo();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  userNameAsyncValidator = (control: UntypedFormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value.length > 20 || control.value.length < 3) {
          // you have to return `{error: true}` to mark it as an error event
          observer.next({ error: true, length: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });

  startDateValidator(control: FormControl){
    const pickedDate = +control.value;
    const currDate = +new Date();
    if(pickedDate > currDate){
      return { date: true };
    }
    return null;
  }
}
