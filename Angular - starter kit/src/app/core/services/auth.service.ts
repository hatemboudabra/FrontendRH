import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../../store/Authentication/auth.models';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private tokenKey = 'auth_token';
  
  private helper = new JwtHelperService();
  public loggedUser!:string;
public isloggedIn: Boolean = false;
private userRoleSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('currentUser');
    console.log("Utilisateur depuis le localStorage :", userStr); // Ajoutez ce log
    return userStr ? JSON.parse(userStr) : null;
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/login`, { username, password }).pipe(
      map(response => {
        if (response?.token) {
          localStorage.setItem(this.tokenKey, response.token);
          const user: User = {
            id: response.id,
            username: response.username,
            email: response.email,
            roles: response.roles,
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return response;
      })
    );
  }

  register(user: User): Observable<any> {
    return this.http.post(`${environment.apiUrl}/register`, user);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.currentUserValue;
  }
  getByRole() {
    return this.http.get<any[]>(`${environment.apiUrl}/users-by-roles`);
}
exportJasper(): Observable<Blob> {
  const url = `${environment.apiUrl}/users/jasper`;
  return this.http.get(url, { responseType: 'blob' });
}
getCurrentUser(): Observable<User | null> {
  const token = this.token;
  if (token) {
    const decodedToken = this.helper.decodeToken(token);
    console.log("Token décodé :", decodedToken); // Vérifie le token décodé
    if (decodedToken) {
      const user: User = {
        id: decodedToken.id,
        username: decodedToken.sub, // `sub` contient généralement le nom d'utilisateur dans un JWT
        email: decodedToken.email, 
        roles: decodedToken.roles || [] // Vérifie si les rôles existent
      };
      return new Observable(observer => {
        observer.next(user); // Retourne l'objet utilisateur complet
        observer.complete();
      });
    }
  }
  return new Observable(observer => {
    observer.next(null);
    observer.complete();
  });
}

getUserByUsername(username: string): Observable<any> {
const url = `${environment.apiUrl}/id/${username}`;

  return this.http.get<any>(url);
}
updateUserRole(newRole: string): void {
  this.userRoleSubject.next(newRole);
}
}
