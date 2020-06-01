import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { IEmployee } from '../../models/IEmployee';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styles: [],
})
export class EmployeeListComponent implements OnInit {
  employees: IEmployee[];
  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe(
      (res) => (this.employees = res),
      (err) => console.log(err)
    );
  }

  editEmployee(id: number) {
    this.router.navigate(['employees/edit/', id]);
  }
}
