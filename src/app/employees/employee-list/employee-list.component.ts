import { Component, OnInit } from '@angular/core';
import { EmployeesService } from '../employees.service';
import { Employee } from '../employee.type';
import { HttpResponse } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormGroup, Validators, UntypedFormBuilder, FormControl, UntypedFormControl, ValidationErrors } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employeeist',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})

export class EmployeeListComponent implements OnInit {

  constructor(private employee: EmployeesService, private msg: NzMessageService,
    private fb: UntypedFormBuilder, private employeesService: EmployeesService,
    private router: Router) { }
  
  ngOnInit(): void {
    this.getEmployeeList();
    this.employeeEditForm = this.fb.group({
      name: ['', [Validators.required], [this.userNameAsyncValidator]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', [Validators.pattern(/^0\d{9}$/)]],
      startdate: ['', [this.startDateValidator]],
    });
  }

  listOfEmployee: Employee[] = [];
  curPage = 1;
  pageSize = 5;
  totalPage = 0;
  isLoading: boolean = false;
  isVisible = false;
  employeeEditForm!: UntypedFormGroup;
  edittingEmployeeId!: string;

  getEmployeeList(){
    this.isLoading = true;
    this.employee.getEmployees(this.curPage, this.pageSize).subscribe((res: HttpResponse<Employee[]>) => {
      if(!!res.body){
        this.listOfEmployee = res.body;
      };
      const count = res.headers.get("X-Total-Count");
      if(!!count){
        this.totalPage = +count;
      }
      this.isLoading = false;
    })
  }

  delete(id:string){
    this.employee.delete(id).subscribe(res => {
      this.msg.success("Deleted", {nzDuration: 1000});
      this.getEmployeeList();
    })
  }

  trackById(index: number, emp: Employee) {
    return emp.id;
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

  showEditEmployeeModal(id: string): void {
    this.employeesService.getEmployeeById(id).subscribe((employee: Employee) => {
      console.log(employee)
      const { startdate } = employee;
      this.employeeEditForm.patchValue({...employee, startdate: new Date(startdate)});
    });
    this.edittingEmployeeId = id;
    this.isVisible = true;
  }

  handleOk(): void {
    this.submitEmployeeEditForm();
    this.isVisible = false;
  }

  handleCancel(): void {
    this.resetFormInfo();
    this.isVisible = false;
  }

  submitEmployeeEditForm(): void {
    let startDate = this.employeeEditForm.value.startdate;
    if(!startDate){
      startDate = new Date();
    }
    const params = {...this.employeeEditForm.value, startdate: startDate?.getTime()};
    this.employeesService
      .updateEmployeeById(this.edittingEmployeeId, params)
      .subscribe((employee: Employee) => {
        this.resetFormInfo();
        this.msg.success("Employee updated!");

        this.listOfEmployee = this.listOfEmployee.map(e => {
          if(e.id === employee.id){
            return employee
          } else {
            return e
          }
        })
    })
  }

  resetFormInfo(){
    this.employeeEditForm.reset({gender: "0"});
    for (const key in this.employeeEditForm.controls) {
      if (this.employeeEditForm.controls.hasOwnProperty(key)) {
        this.employeeEditForm.controls[key].markAsPristine();
        this.employeeEditForm.controls[key].updateValueAndValidity();
      }
    }
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.resetFormInfo();
  }
}
