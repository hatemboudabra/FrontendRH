import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notifications } from '../../data/notif';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
   private notificationsSubject = new BehaviorSubject<Notifications[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  
  constructor() {
    console.log('[NotificationService] Initialisé');
  }

  addNotification(notification: Notifications) {
    console.log('[NotificationService] Ajout d\'une notification:', notification);
    
    if (!notification) {
      console.error('[NotificationService] Tentative d\'ajout d\'une notification nulle');
      return;
    }
    
    try {
      const currentNotifications = this.notificationsSubject.value;
      
      // Vérifier si la notification existe déjà (éviter les doublons)
      const exists = notification.id && 
                    currentNotifications.some(n => n.id === notification.id);
      
      if (exists) {
        console.log('[NotificationService] Notification déjà présente, ignorée');
        return;
      }
      
      // Normaliser les dates
      const normalizedNotification = {
        ...notification,
        createdAt: notification.createdAt instanceof Date ? 
                  notification.createdAt : 
                  new Date(notification.createdAt || Date.now())
      };
      
      // Ajouter la notification et trier par date (plus récentes en premier)
      const updatedNotifications = [...currentNotifications, normalizedNotification]
        .sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt || 0);
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
      
      console.log('[NotificationService] Nombre total de notifications:', updatedNotifications.length);
      this.notificationsSubject.next(updatedNotifications);
    } catch (error) {
      console.error('[NotificationService] Erreur lors de l\'ajout de la notification:', error);
    }
  }

  getNotificationsForUser(userId: number): Notifications[] {
    console.log(`[NotificationService] Récupération des notifications pour l'utilisateur ${userId}`);
    return this.notificationsSubject.value.filter(
      (notification) => notification.userId === userId
    );
  }

  clearNotifications() {
    console.log('[NotificationService] Effacement de toutes les notifications');
    this.notificationsSubject.next([]);
  }

  setNotifications(notifications: Notifications[]) {
    console.log('[NotificationService] Définition de toutes les notifications:', notifications?.length || 0);
    
    const normalizedNotifications = notifications.map(notification => ({
      ...notification,
      createdAt: notification.createdAt instanceof Date ? 
                notification.createdAt : 
                new Date(notification.createdAt || Date.now())
    })).sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt || 0);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });
    
    this.notificationsSubject.next(normalizedNotifications);
  }

  markAsRead(notificationId: number) {
    console.log(`[NotificationService] Marquer notification ${notificationId} comme lue`);
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    );
    this.notificationsSubject.next(updatedNotifications);
  }
  

 
}