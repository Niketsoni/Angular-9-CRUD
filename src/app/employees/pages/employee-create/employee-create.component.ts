import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
  EmailValidator,
  FormArray,
} from '@angular/forms';
import { CustomValidators } from '../../../shared/custom.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { IEmployee } from '../../models/IEmployee';
import { ISkill } from '../../models/ISkill';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styles: [],
})
export class EmployeeCreateComponent implements OnInit {
  employeeForm: FormGroup;
  count = 0;
  pageTitle = '';

  // This object contains all the validation messages for this form
  validationMessages = {
    fullName: {
      required: 'Full Name is required.',
      minlength: 'Full Name must be greater than 2 characters.',
      maxlength: 'Full Name must be less than 10 characters.',
    },
    email: {
      required: 'Email is required.',
      emailDomain: 'Email domian should be dell.com',
    },
    confirmEmail: {
      required: 'Confirm Email is required.',
    },
    emailGroup: {
      emailMismatch: 'Email and Confirm Email do not match.',
    },
    phone: {
      required: 'Phone No is required.',
      minlength: 'Phone No must be equal to 10 characters.',
      maxlength: 'Phone No must be equal to 10 characters.',
    },
  };

  formErrors = {
    fullName: '',
    email: '',
    confirmEmail: '',
    emailGroup: '',
    phone: '',
  };

  employee: IEmployee;
  skills: ISkill;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(10),
        ],
      ],
      contactPreference: ['email'],
      emailGroup: this.fb.group(
        {
          email: [
            '',
            [Validators.required, CustomValidators.emailDomain('dell.com')],
          ],
          confirmEmail: [
            '',
            [Validators.required, CustomValidators.emailDomain('dell.com')],
          ],
        },
        { validator: matchEmails }
      ),
      phone: [''],
      skills: this.fb.array([this.addSkillFormGroup()]),
    });

    // detecting valueChanges of formControl
    // this.employeeForm
    //   .get('fullName')
    //   .valueChanges.subscribe((value: string) => {
    //     this.count = value.length;
    //     console.log(value);
    //   });

    // detecting valueChanges of form group
    this.employeeForm.valueChanges.subscribe((value) => {
      // console.log(JSON.stringify(value));
      this.logValidationErrors(this.employeeForm);
    });

    // detecting valuechanges of contactPreference fromcontrol
    this.employeeForm
      .get('contactPreference')
      .valueChanges.subscribe((data: string) => {
        this.onContactPrefernceChange(data);
      });

    // detecting valueChanges of nested form group
    this.employeeForm.get('skills').valueChanges.subscribe((value) => {
      // console.log(JSON.stringify(value));
    });

    this.route.paramMap.subscribe((params) => {
      const empId = +params.get('id');
      if (empId) {
        this.pageTitle = 'Edit Employee Details';
        this.getEmployeDetails(empId);
      } else {
        this.pageTitle = 'Create Employee';
        this.employee = {
          id: null,
          fullName: '',
          email: '',
          phone: null,
          contactPreference: '',
          skills: [],
        };
      }
    });
  }

  getEmployeDetails(id: number) {
    this.employeeService.getEmployee(id).subscribe(
      (employee: IEmployee) => {
        // Store the employee object returned by the
        // REST API in the employee property
        this.employee = employee;
        this.editEmployee(employee);
      },
      (err: any) => console.log(err)
    );
  }

  editEmployee(employee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email,
      },
      phone: employee.phone,
    });

    this.employeeForm.setControl(
      'skills',
      this.setExistingSkills(employee.skills)
    );
  }

  setExistingSkills(skills: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skills.forEach((s) => {
      formArray.push(
        this.fb.group({
          skillName: s.skillName,
          experience: s.experience,
          proficiency: s.proficiency,
        })
      );
    });
    return formArray;
  }

  // looping through ket value pairs of all formcontrols and nested formcontrols
  logKeyValuePairs(group: FormGroup): void {
    // Loop through each control key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      // Get the control. The control can be a nested form group
      const abstractFormControl = group.get(key);
      // If the control is nested form group, recursively call this same method
      if (abstractFormControl instanceof FormGroup) {
        this.logKeyValuePairs(abstractFormControl);
        abstractFormControl.disable();
      } else {
        // logging all key value pairs of formcontrols
        console.log('Key ' + key + ' Value ' + abstractFormControl.value);
        abstractFormControl.markAsDirty();
        abstractFormControl.markAsTouched();
      }
    });
  }

  get skillsForms() {
    return this.employeeForm.get('skills') as FormArray;
  }

  addSkillButtonClick() {
    const skill = this.fb.group({
      skillName: ['', Validators.required],
      experience: ['', Validators.required],
      proficiency: ['', Validators.required],
    });

    this.skillsForms.push(skill);
  }

  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experience: ['', Validators.required],
      proficiency: ['', Validators.required],
    });
  }

  removeSkillButtonClick(i: number): void {
    this.skillsForms.removeAt(i);
    this.skillsForms.markAsDirty();
    this.skillsForms.markAsTouched();
  }

  onLoadData(): void {
    this.logKeyValuePairs(this.employeeForm);
  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    // Loop through each control key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      // Get the control. The control can be a nested form group
      const abstractControl = group.get(key);

      // Clear the existing validation errors
      this.formErrors[key] = '';
      if (
        abstractControl &&
        !abstractControl.valid &&
        (abstractControl.touched ||
          abstractControl.dirty ||
          abstractControl.value !== '')
      ) {
        // Get all the validation messages of the form control
        // that has failed the validation
        const messages = this.validationMessages[key];
        console.log(messages);
        // Find which validation has failed. For example required,
        // minlength or maxlength. Store that error message in the
        // formErrors object. The UI will bind to this object to
        // display the validation errors
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      // If the control is nested form group, recursively call
      // this same method
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
        // If the control is a FormControl
      }

      // If the control is nested form array, recursively call
      // this same method
      if (abstractControl instanceof FormArray) {
        for (const control of abstractControl.controls) {
          if (control instanceof FormGroup) {
            this.logValidationErrors(control);
            // If the control is a FormControl
          }
        }
      }
    });
  }

  onLoadValidate(): void {
    this.logValidationErrors(this.employeeForm);
    console.log(this.formErrors);
  }

  onSubmit(): void {
    // console.log(this.employeeForm.value);
    this.mapFormValuesToEmployeeModel();
    if (this.employee.id) {
      this.employeeService.updateEmployee(this.employee).subscribe(
        () => this.router.navigate(['employees/list']),
        (err: any) => console.log(err)
      );
    } else {
      this.employeeService.addEmployee(this.employee).subscribe(
        () => this.router.navigate(['employees/list']),
        (err) => console.log(err)
      );
    }
  }

  mapFormValuesToEmployeeModel() {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.skills = this.employeeForm.value.skills;
  }

  // If the Selected Radio Button value is "phone", then add the
  // required validator function otherwise remove it
  onContactPrefernceChange(selectedValue: string) {
    const phoneFormControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneFormControl.setValidators([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]);
    } else {
      phoneFormControl.clearValidators();
    }
    phoneFormControl.updateValueAndValidity();
  }
}

// Nested form group (emailGroup) is passed as a parameter. Retrieve email and
// confirmEmail form controls. If the values are equal return null to indicate
// validation passed otherwise an object with emailMismatch key. Please note we
// used this same key in the validationMessages object against emailGroup
// property to store the corresponding validation error message
function matchEmails(group: AbstractControl): { [key: string]: any } | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');
  if (
    emailControl.value === confirmEmailControl.value ||
    (confirmEmailControl.pristine && confirmEmailControl.value === '')
  ) {
    return null;
  } else {
    return { emailMismatch: true };
  }
}
