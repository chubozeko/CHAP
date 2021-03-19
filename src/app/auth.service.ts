import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
const cors = require('cors');

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<any>;
  private authState = new BehaviorSubject(null);

  corsOptions;
  rootURL: string = 'http://localhost:80/chap_ums/';
  sessionToken: any;
  mode: string;
  isLoggedIn: boolean;

  constructor(private http: HttpClient) { }
  // private storage: Storage

  loadPHP(phpFile: string, data?: any) {
    // post these details to API server return user info if correct
    // return this.http.post('/api/auth.php', {
    //   username,
    //   password
    // }) 
    // 
    const allowedOrigins = [
      'capacitor://localhost',
      'ionic://localhost',
      'http://localhost',
      'http://localhost:80',
      'http://localhost:8080',
      'http://localhost:8100'
    ];
    // Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
    this.corsOptions = {
      origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
        } else {
          callback(new Error('Origin not allowed by CORS'));
        }
      }
    }

    this.http.options('*', cors(this.corsOptions));
    // 'http://localhost:80/chap_ums/index.php'
    let fileName = this.rootURL + phpFile;
    // { responseType: 'text' }
    return this.http.post(fileName, { data });
    // .subscribe((data: any) => {
    //   console.log(data.toString());
    //   // return data.toString();
    // },
    //   (error: any) => {
    //     console.dir(error);
    //   });
    // responseType: 'text' 
  }
}