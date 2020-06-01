import { NgModule } from '@angular/core';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { EmployeeCreateComponent } from './pages/employee-create/employee-create.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [EmployeeListComponent, EmployeeCreateComponent],
  imports: [SharedModule, EmployeesRoutingModule],
})
export class EmployeesModule {}
