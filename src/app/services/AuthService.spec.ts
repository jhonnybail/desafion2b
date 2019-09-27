import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AuthService } from './AuthService';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
    let service: AuthService;
    let store = {};
    let data = {
        id: 'as1fsx',
        nome: 'Jonathan',
        email: 'jhonnybail@gmail.com',
        googleAccessToken: 'a'
    };

    const fASpy = {
        auth: {
            signInWithPopup: async () => ({
                credential: {
                    idToken: '1',
                    accessToken: 'a'
                }
            })
        }
    };

    beforeEach(() => { 
        TestBed.configureTestingModule({ 
            imports: [
                AngularFireModule.initializeApp(environment.firebaseConfig),
                AngularFireAuthModule,
                HttpClientTestingModule
            ],
            providers: [
                AuthService,
                { provide: AngularFireAuth, useValue: fASpy }
            ]
        });
        const mockLocalStorage = {
          getItem: (key: string): string => {
            return key in store ? store[key] : null;
          },
          setItem: (key: string, value: string) => {
            store[key] = value;
          },
          removeItem: (key: string) => {
            delete store[key];
          },
          clear: () => {
            store = {};
          }
        };
        spyOn(window.localStorage, 'getItem')
          .and.callFake(mockLocalStorage.getItem);
        spyOn(window.localStorage, 'setItem')
          .and.callFake(mockLocalStorage.setItem);
        spyOn(window.localStorage, 'removeItem')
          .and.callFake(mockLocalStorage.removeItem);
        spyOn(window.localStorage, 'clear')
          .and.callFake(mockLocalStorage.clear);

        service = TestBed.get(AuthService);
    });

    it('Do login with Google',  
        fakeAsync(
            inject(
                [HttpTestingController],
                (backend: HttpTestingController) => {

                    const responseObject = {
                        success: true,
                        data: data
                    };
                    let response = null;

                    service.doGoogleLogin().then(
                        (receivedResponse: any) => {
                            response = receivedResponse;
                        },
                        (error: any) => {}
                    );

                    tick();

                    const requestWrapper = backend.expectOne({url: `${environment.apiURL}auth`});
                    requestWrapper.flush(responseObject);

                    tick();

                    expect(requestWrapper.request.method).toEqual('POST');
                    expect(response).toEqual(responseObject.data);

                }
            )
        )
    );

});