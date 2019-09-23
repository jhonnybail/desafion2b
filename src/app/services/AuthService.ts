import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

    constructor(public afAuth: AngularFireAuth, private http: HttpClient) {}

    public doGoogleLogin() {
        return new Promise<any>(async (resolve, reject) => {
            const { GoogleAuthProvider } = auth;
            const provider = new GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');
            try{
                let user        = (await this.afAuth.auth
                                    .signInWithPopup(provider));
                let credential  = user.credential;
                this.http.post(`${environment.apiURL}auth`, {
                    method: 'google',
                    id_token: credential['oauthIdToken'] ? credential['oauthIdToken'] : credential['idToken'],
                    access_token: credential['oauthAccessToken'] ? credential['oauthAccessToken'] : credential['accessToken']
                })
                    .subscribe(data => {
                        if(!data['success']){
                            throw new Error('Problema ao realizar autenticação.');
                        }
                        window.localStorage.setItem('user', JSON.stringify(data['data']));
                        resolve(data['data']);
                    });
            }catch(error){
                reject(error);
            }
        });
    }

    public logout() {
        window.localStorage.removeItem('user');
        return true;
    }
    
    public getUser() {
        let user = window.localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
    
}
