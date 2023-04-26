import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ApiService} from "../service/api.service";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent implements OnInit{
  public packages: string[] = ["Monthly", "Quarterly", "Yearly"];
  public genders: string[] = ["Female", "Male", "Others", "Prefer not to say"];
  public trainerOpt: string[] = ["Yes", "No"];
  public focusList: string[] = [
    "Toxic fat reduction",
    "Energy and endurance",
    "Building lean muscle",
    "Healthier digestive system",
    "Sugar craving body",
    "Fitness"
  ];

  public registerForm!: FormGroup;
  constructor(private fb: FormBuilder, private api: ApiService, private toastService: NgToastService) {
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requireTrainer: [''],
      package: [''],
      focus: [''],
      haveGymBefore: [''],
      enquiryDate: ['']
    });
    this.registerForm.controls['height'].valueChanges.subscribe(res=>{
      this.calculateBMI(res, this.registerForm.value.weight);
    })
  }
  submit(){
    this.api.postRegistration(this.registerForm.value).subscribe(res=>{
      this.toastService.success({detail:"SUCCESS!", summary:"Enquiry Added", duration:3000});
      this.registerForm.reset();
    })
  }

  calculateBMI(heightValue: number, weightValue: number){
    const bmi = weightValue/((heightValue/100)^2);
    const bmiResult = this.evaluateBMI(bmi);

    this.registerForm.controls['bmi'].patchValue(bmi);
    this.registerForm.controls['bmiResult'].patchValue(bmiResult);

    this.registerForm.value.bmi = bmi;
    this.registerForm.value.bmiResult = bmiResult;
  }

  evaluateBMI(BMIValue: number){
    if(BMIValue < 18.4)
      return "Underweight";
    if(BMIValue < 24.9)
      return "Normal";
    if(BMIValue < 29.9)
      return "Overweight";
    if(BMIValue < 34.9)
      return "Obese";

    return "Severely obese";
  }
}
