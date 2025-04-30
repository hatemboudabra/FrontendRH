import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ChatMessageDTO } from "../../data/chat";
import { catchError, map, Observable, of, tap, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class MessagChatService {
  showError(arg0: string) {
    throw new Error('Method not implemented.');
  }
    private baseUrl = 'http://localhost:9092';
    
    constructor(private http: HttpClient) {}

    getTeamMessages(teamId: number): Observable<ChatMessageDTO[]> {
        return this.http.get<ChatMessageDTO[]>(`${this.baseUrl}/team/${teamId}`).pipe(
            catchError(error => {
                console.error('Failed to fetch team messages:', error);
                return of([]);
            })
        );
    }
    getPrivateMessages(userId: number, recipientId: number): Observable<ChatMessageDTO[]> {
        console.log(`[MessagChatService] Fetching private messages between ${userId} and ${recipientId}`);
        return this.http.get<ChatMessageDTO[]>(`${this.baseUrl}/private/${userId}/${recipientId}`).pipe(
          catchError(error => {
            console.error('[MessagChatService] Failed to fetch private messages:', error);
            return of([]);
          })
        );
      }
      uploadTeamFile(
        teamId: number,
        file: File,
        sender: string
      ): Observable<ChatMessageDTO> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sender', sender);
    
        return this.http
          .post<ChatMessageDTO>(
            `${this.baseUrl}/upload/team/${teamId}`,
            formData
          )
          .pipe(
            catchError((error) => {
              console.error('Échec upload fichier équipe:', error);
              return of(null as any);
            })
          );
      }
      uploadPrivateFile(
        recipientId: number,
        file: File,
        sender: string
      ): Observable<ChatMessageDTO> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sender', sender);
    
        return this.http
          .post<ChatMessageDTO>(
            `${this.baseUrl}/upload/private/${recipientId}`,
            formData
          )
          .pipe(
            catchError((error) => {
              console.error('Échec upload fichier privé:', error);
              return of(null as any);
            })
          );
      } 

      downloadFile(fileName: string): Observable<Blob> {
        const cleanName = fileName.replace(/^File:\s*/i, '');
        console.log('Attempting to download:', cleanName);
        
       
        const timestamp = new Date().getTime();
        
        return this.http.get(`${this.baseUrl}/download/${encodeURIComponent(cleanName)}?t=${timestamp}`, {
            responseType: 'blob',
            withCredentials: true,
            observe: 'response'
        }).pipe(
            tap(response => {
                console.log('Download response headers:', response.headers);
                console.log('Content type:', response.headers.get('Content-Type'));
                console.log('Content disposition:', response.headers.get('Content-Disposition'));
            }),
            map(response => {
                if (!response.body) {
                    throw new Error('Empty response body');
                }
                return response.body;
            }),
            catchError(error => {
                console.error('Full error response:', {
                    status: error.status,
                    statusText: error.statusText,
                    message: error.message,
                    url: error.url,
                    name: error.name,
                    error: error.error instanceof Blob ? 'Blob data' : error.error
                });
                
                if (error.error instanceof Blob) {
                    return new Observable<never>(observer => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const errorMsg = reader.result as string;
                            console.error('Server error message:', errorMsg);
                            observer.error(new Error(
                                error.status === 404 ? 'File not found on server' : 
                                errorMsg || `Download failed. Status: ${error.status}`
                            ));
                        };
                        reader.onerror = () => {
                            observer.error(new Error(
                                error.status === 404 ? 'File not found on server' : 
                                `Download failed. Status: ${error.status}`
                            ));
                        };
                        reader.readAsText(error.error);
                    });
                }
                
                return throwError(() => new Error(
                    error.status === 404 ? 'File not found on server' :
                    error.status ? `Download failed. Status: ${error.status}` : 
                    'Network error or CORS issue'
                ));
            })
        );
    }
      
}