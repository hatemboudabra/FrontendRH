import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Offers } from "../../data/Offers";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class OffersService {
    private baseUrl = 'http://localhost:8082/';

  constructor(private http: HttpClient) {}
   addOffer(offer: Offers): Observable<Offers> {
    return this.http.post<Offers>(`${this.baseUrl}addOffers`, offer);
  }

  getAllOffers(): Observable<Offers[]> {
    return this.http.get<Offers[]>(`${this.baseUrl}alloffers`);
  }

  getOfferById(id: number): Observable<Offers> {
    return this.http.get<Offers>(`${this.baseUrl}Offers/${id}`);
  }
  deleteOffer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}DeleteOffers/${id}`);
  }
}