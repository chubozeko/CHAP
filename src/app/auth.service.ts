import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
const cors = require('cors');

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  corsOptions;

  constructor(private http: HttpClient) { }

  loadPHP() {
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
    // { responseType: 'text' }
    return this.http.get('http://localhost:80/chap_ums/index.php', { responseType: 'text' });
    // .subscribe((data: any) => {
    //   console.log(data.toString());
    //   // return data.toString();
    // },
    //   (error: any) => {
    //     console.dir(error);
    //   });
  }
}