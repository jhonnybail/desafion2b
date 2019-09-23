import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Injectable} from "@angular/core";
import {AuthService} from '../services/AuthService';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService){}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        let user = this.authService.getUser();
        if(user && request.url.indexOf('cloudinary') < 0){
            let {id, googleAccessToken} = user;
            if (id) {
                request = request.clone({
                    setHeaders: {
                        Authorization: 'Basic ' + btoa(`${id}:${googleAccessToken}`)
                    }
                });
            }
        }
        return next.handle(request);
    }
}