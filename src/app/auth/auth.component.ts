import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoginMode = true;
    isLoading = false;
    error:string = null;

    constructor(private authService: AuthService){}

    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode;
    }
    onSubmit(form:NgForm){
        if(!form.valid){
            return;
        }
        const email = form.value.email;
        const password = form.value.password;

        this.isLoading = true;
        if(this.isLoginMode){

        } else {

         this.authService.signup(email,password).subscribe(resData => {
            console.log(resData);
            this.isLoading = false;
        }, errorRes => {
            console.log(errorRes);
            switch (errorRes.error.error.message) {
                case 'EMAIL_EXISTS':
                  this.error = 'this email id already exists';
                break;
                 case 'OPERATION_NOT_ALLOWED':
                  this.error = 'Password sign-in is disabled for this project';
                break;
                 case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                  this.error = 'We have blocked all requests from this device due to unusual activity. Try again later.';
                break;
            
                default:
                this.error = ' An error occured';
                    break;
            }
            
            this.isLoading = false;
        });

        }
       
        form.reset();
    }
}