import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../employee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {

  employee: Employee = {
    id: 0,
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    position: ''
  };

  isEditing: boolean = false;

  errorMessage: string = "";

  constructor(
    private employeeService: EmployeeService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        console.log(params);
        const id = params.get('id');

        if (id) {
          this.isEditing = true;
          this.employeeService.getEmployeeById(Number(id)).subscribe({
            next: (employee) => {
              this.employee = employee;
            },
            error: (err) => {
              console.error(err);
              this.errorMessage = `Error: ${err.status} - ${err.message}`;
            }
          });
        }
      }
    });    
  }

  onSubmit() {

    if (this.isEditing) {
      this.employeeService.editEmployee(this.employee).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = `Error: ${err.status} - ${err.message}`;
        }
      });
    } else {
      this.employeeService.createEmployee(this.employee).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = `Error: ${err.status} - ${err.message}`;
        }
      });
    }

    
  }

}
