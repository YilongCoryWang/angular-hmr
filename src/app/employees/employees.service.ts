import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPLOYEE_SERVER } from '../config';
import { Employee } from './employee.type';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  constructor(private http: HttpClient) { }

  getEmployees(currentPage: number, pageSize: number){
    return this.http.get<Employee[]>(`${EMPLOYEE_SERVER}/employees?_page=${currentPage}&_limit=${pageSize}`, {
      observe: 'response'
    })
  }

  delete(id: string){
    return this.http.delete(`${EMPLOYEE_SERVER}/employees/${id}`)
  }

  addEmployee(employee: Employee){
    return this.http.post(`${EMPLOYEE_SERVER}/employees`, employee)
  }

  updateEmployeeById(id: string, employee: Employee){
    return this.http.patch<Employee>(`${EMPLOYEE_SERVER}/employees/${id}`, employee)
  }

  getEmployeeById(id: string){
    return this.http.get<Employee>(`${EMPLOYEE_SERVER}/employees/${id}`)
  }
}
