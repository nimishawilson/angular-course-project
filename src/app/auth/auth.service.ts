import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError, Subject } from "rxjs";
import { User } from "./user.model";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService{
    user = new Subject<User>();

    constructor(private http: HttpClient){ }

    signup(email: string, password: string){
       return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAA-EK1_6xPgCJpjR0x5dCastnZIsv0tPs',  
       {
            email: email,
            password: password,
            returnSecureToken: true
        }
        ).pipe(catchError(this.handleError), tap(resData => {
           this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }));
       
    }

    login(email:string, password:string){
       return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAA-EK1_6xPgCJpjR0x5dCastnZIsv0tPs',
        {
            email: email,
            password: password,
            returnSecureToken: true
        }
        ).pipe(catchError(this.handleError), tap(resData => {
           this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }) );
    }

    private handleAuthentication(email:string, userId:string, token:string, expiresIn: number){
         const expirationDate = new Date(new Date().getTime() +  resData.expiresIn * 1000);
            const user = new User(email, userId, token, expirationDate);
            this.user.next(user);
    }

    private handleError(errorRes: HttpErrorResponse){
         let errorMessage = '';
            if(!errorRes.error || !errorRes.error.error){
                return throwError(errorMessage);
            }
            switch (errorRes.error.error.message) {
                case 'EMAIL_EXISTS':
                  errorMessage = 'this email id already exists';
                break;
                 case 'OPERATION_NOT_ALLOWED':
                  errorMessage = 'Password sign-in is disabled for this project';
                break;
                 case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                  errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
                break;

                 case 'EMAIL_NOT_FOUND':
                  errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
                break;
                 case 'INVALID_PASSWORD':
                  errorMessage = 'The password is invalid or the user does not have a password.';
                break;
                case 'USER_DISABLED':
                  errorMessage = 'The user account has been disabled by an administrator.';
                break;
            
                default:
                errorMessage = ' An error occured';
                    break;
            }

             return throwError(errorMessage);
    }

}