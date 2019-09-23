import { Component } from '@angular/core';
import { AuthService } from './services/AuthService';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    
    title = 'desafion2b';
    
    constructor(private authService: AuthService, private toastrService: ToastrService, private router: Router) { }
    
    async doLogin() {
        try{
            await this.authService.doGoogleLogin();
        }catch(error){
            this.toastrService.success(error.message);
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }
    
    getUser() {
        return this.authService.getUser();
    }
}
