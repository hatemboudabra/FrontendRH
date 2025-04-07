import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Demande } from "../../data/demande";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class DemandeService {
    private baseUrl = 'http://localhost:8082/';
    constructor(private http:HttpClient){}

 addDemande(demande: Demande): Observable<Demande> {
    return this.http.post<Demande>(`${this.baseUrl}`, demande);
  }
      getDemandeChef(): Observable<Demande[]> {
        return this.http.get<Demande[]>(`${this.baseUrl}document-training-leave`);
      }
      getDemandeHR(): Observable<Demande[]> {
        return this.http.get<Demande[]>(`${this.baseUrl}loan-advance`);
      }
      updateStatus(id: number, newStatus: string): Observable<Demande> {
        return this.http.patch<Demande>(`${this.baseUrl}${id}/status/prêt-ou-avance`, null, {
            params: {
                newStatus: newStatus
            }
        });
    }
    updateStatusChef(id: number, newStatus: string): Observable<Demande> {
        return this.http.patch<Demande>(`${this.baseUrl}${id}/status/document-ou-formation-ou-congé`, null, {
            params: {
                newStatus: newStatus
            }
        });
    }


    getDemandesByUserId(userId: number): Observable<Demande[]> {
        return this.http.get<Demande[]>(`${this.baseUrl}user/${userId}`);
      }

      getDemandesCountByStatusForDocumentTrainingOrLeave(): Observable<Map<string, number>> {
        return this.http.get<Map<string, number>>(`${this.baseUrl}countchef`);
    }
    getDemandecountsbystatusavancepret(): Observable<Map<string, number>> {
      return this.http.get<Map<string, number>>(`${this.baseUrl}countRh`);
    }

    getDemandesCountByMonth(): Observable<Map<string, number>> {
      return this.http.get<Map<string, number>>(`${this.baseUrl}stats/mois`);
  }
}