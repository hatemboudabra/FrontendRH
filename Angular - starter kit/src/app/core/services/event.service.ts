import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Events } from "../../data/event";

@Injectable({ providedIn: 'root' })
export class EventService{
      private baseUrl = 'http://localhost:8082/';
      constructor(private http:HttpClient){}
      addEvent(event:Events):Observable<Events>{
        return this.http.post<Events>(`${this.baseUrl}addEvent`, event);
      }
      getAllEvent():Observable<Events[]>{
        return this.http.get<Events[]>(`${this.baseUrl}allevent`);

      }
      getEventsByUser(userId: number): Observable<Events[]> {
        return this.http.get<Events[]>(`${this.baseUrl}Event/${userId}`);
    }
    updateEvent(id: number, event: Events): Observable<Events> {
        return this.http.put<Events>(`${this.baseUrl}updateEvent/${id}`, event);
      }
    
      deleteEvent(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}deleteEvent/${id}`);
      }
    }


