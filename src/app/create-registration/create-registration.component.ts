import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ApiService} from "../service/api.service";
import {NgToastService} from "ng-angular-popup";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../models/user.model";

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
  public userIdToUpdate!: number;
  public isUpdateActive: boolean = false;
  constructor(private fb: FormBuilder,
              private api: ApiService,
              private toastService: NgToastService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
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
    });

    this.activatedRoute.params.subscribe(val =>{
      this.userIdToUpdate = val['id'];
      this.api.getRegisteredUserId(this.userIdToUpdate)
        .subscribe(res => {
          this.isUpdateActive = true;
          this.fillFormToUpdate(res);
      })
    });
  }
  submit(){
    this.api.postRegistration(this.registerForm.value).subscribe(()=>{
      this.toastService.success({detail:"SUCCESS!", summary:"Enquiry Added", duration:3000});
      this.registerForm.reset();
    })
  }
  update(){
    this.api.updateRegisterUser(this.registerForm.value, this.userIdToUpdate).subscribe(()=>{
      this.toastService.success({detail:"SUCCESS!", summary:"Enquiry Updated", duration:3000});
      this.registerForm.reset();
      this.router.navigate(['list']);
    });
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

  fillFormToUpdate(user: User){
    this.registerForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      focus: user.focus,
      haveGymBefore: user.haveGymBefore,
      enquiryDate: user.enquiryDate
    })
  }
}
