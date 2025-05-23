import { CUSTOM_ELEMENTS_SCHEMA, Component, HostListener, Inject, Renderer2, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DrawerModule } from '../../Component/drawer';
import { LUCIDE_ICONS, LucideAngularModule, LucideIconProvider, Route, icons } from 'lucide-angular';
import { MnDropdownComponent } from '../../Component/dropdown';
import { LanguageService } from '../../core/services/language.service';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { getLayout, getLayoutmode, getSidebarcolor, getSidebarsize, getTopbarcolor } from '../../store/layout/layout-selector';
import { changeMode, changesidebarcolor, changesidebarsize, changetopbarcolor } from '../../store/layout/layout-action';
import { SimplebarAngularModule } from 'simplebar-angular';
//import { notification, cart } from '../../data';
import { CommonModule, DatePipe, DOCUMENT } from '@angular/common';
import { User } from '../../store/Authentication/auth.models';
import { AuthenticationService } from '../../core/services/auth.service';
import { Notifications } from '../../data/notif';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationApiService } from '../../core/services/apinotif.service';
import { interval, Subscription } from 'rxjs';
import { WebsocketService } from '../../core/services/websocket.service';


@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [DrawerModule, MnDropdownComponent, LucideAngularModule, SimplebarAngularModule, RouterModule, CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA,],
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }, LanguageService, DatePipe,],
})
export class TopbarComponent {
  notifyList: Notifications[] = [];
  private updateSubscription: Subscription;
  cookieValue: any;
  flagvalue: any;

 // notifyListt: any;
  type: any = 'all';
  mode: any;
  subtotal: any = 0;
  discount: any;
  discountRate = 0.12;
  shipping: any;
  shippingRate: any = this.subtotal != 0 ? '65.00' : '0';
  tax: any;
  taxRate = 0.18;
  totalprice: any;
  size: any;
  cartlist: any;

  private store = inject(Store);
  layout: any;
  currentUser: User | null = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public translate: TranslateService,
    public languageService: LanguageService,
    public _cookiesService: CookieService,
    private authService:AuthenticationService,
    private notificationService: NotificationService,
    private notifservice : NotificationApiService,
    private Web:WebsocketService,
      private renderer: Renderer2) {
    translate.setDefaultLang('en');
    this.updateSubscription = new Subscription();
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {

    var windowSize = document.documentElement.clientWidth;

    // Get Layout
    this.store.select(getLayout).subscribe((data) => {
      this.layout = data
    })

    if (this.layout == 'vertical') {
      if (windowSize > 768 && windowSize < 1024) {
        this.store.dispatch(changesidebarsize({ size: 'sm' }));
      } else {
        this.store.dispatch(changesidebarsize({ size: 'lg' }));
      }
    } else {
      this.store.dispatch(changesidebarsize({ size: 'lg' }));
    }
  }


  ngOnInit(): void {
  
  
    // Fetch Data
    /*this.cartlist = cart

    // Fetch Data
    this.notifyList = notification;

    this.cartlist.map((x: any) => {
      x['total'] = (x['quantity'] * x['price']).toFixed(2)
      this.subtotal += parseFloat(x['total'])
    })
    this.subtotal = this.subtotal.toFixed(2)
    this.discount = (this.subtotal * this.discountRate).toFixed(2)
    this.tax = (this.subtotal * this.taxRate).toFixed(2);
    this.totalprice = (parseFloat(this.subtotal) + parseFloat(this.tax) + parseFloat(this.shippingRate) - parseFloat(this.discount)).toFixed(2)

    // Cookies wise Language set

    this.cookieValue = this._cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.flagvalue = 'assets/images/flags/us.svg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }

*/

 this.loadCurrentUser();
 /* this.notificationService.notifications$.subscribe((notifications) => {
    this.notifyList = notifications;
  }); 
  this.updateSubscription = interval(1000).subscribe(() => {
    this.notifyList = [...this.notifyList];
  });*/

    /*if (this.userid) {
      this.loadAllNotifications(this.userid);
    }*/
      this.notificationService.notifications$.subscribe((notifications) => {
        if (notifications && notifications.length > 0) { 
          this.notifyList = notifications.map(notif => ({
            ...notif,
            createdAt: notif.createdAt ? new Date(notif.createdAt) : new Date()
          }));
        }
      });

      this.Web.connectionStatus$.subscribe(status => {
        console.log(`État de la connexion WebSocket: ${status}`);
      });
      
  }

  formatTimeFromNow(dateInput: Date | string): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return 'Date invalide';
    }
  
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    if (seconds < 60) {
      return `il y a ${seconds} s`; 
    }
  
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
  
    if (minutes < 60) {
      return `il y a ${minutes} min`;
    }
  
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
  
    if (hours < 24) {
      return `il y a ${hours} h ${remainingMinutes} min`;
    }
  
    const days = Math.floor(hours / 24);
    return `il y a ${days} jour(s)`;
  }
  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  loadAllNotifications(userId: number): void {
    if (userId) {
      this.notifservice.getActiveNotificationsForUser(userId).subscribe({
        next: (notifications) => {
          this.notifyList = notifications.map(notification => ({
            ...notification,
            createdAt: notification.createdAt ? new Date(notification.createdAt) : new Date(),
          }));
        },
        error: (error) => {
          console.error('Error loading notifications:', error);
        }
      });
    } else {
      console.error('User ID is not available.');
    }
  }
  loadCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        if (user && user.username) {
          this.currentUser = user;

          this.getUserIdByUsername(user.username);
      
        } else {
          console.error(' Utilisateur non connecté ou username manquant.');
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'utilisateur :', error);
      },
    });
  }

  getUserIdByUsername(username: string): void {
    this.authService.getUserByUsername(username).subscribe({
      next: (userDetails) => {
        if (userDetails && userDetails.id) {
          console.log(' ID utilisateur reçu :', userDetails.id);
          this.currentUser = { ...this.currentUser, id: userDetails.id }; 
          this.Web.setUserId(userDetails.id);
        
        
          this.Web.connect();
        } else {
          console.error(' Données utilisateur invalides ou ID manquant');
        }
      },
      error: (error) => {
        console.error(' Erreur lors de la récupération des données utilisateur :', error);
      },
    });
  }


  // scroll
  windowScroll() {
    var scrollUp = document.documentElement.scrollTop;
    if (scrollUp >= 50) {
      document.getElementById("page-topbar")?.classList.add('is-sticky');
    } else {
      document.getElementById("page-topbar")?.classList.remove('is-sticky');
    }
  }

  /***
  * Language Listing
  */
  listLang = [
    { text: 'English', flag: 'assets/images/flags/20/us.svg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/20/es.svg', lang: 'sp' },
    { text: 'German', flag: 'assets/images/flags/20/de.svg', lang: 'gr' },
    { text: 'French', flag: 'assets/images/flags/20/fr.svg', lang: 'fr' },
    { text: 'Japanese', flag: 'assets/images/flags/20/jp.svg', lang: 'jp' },
    { text: 'Chinese', flag: 'assets/images/flags/20/china.svg', lang: 'ch' },
    { text: 'Italian', flag: 'assets/images/flags/20/it.svg', lang: 'it' },
    { text: 'Russian', flag: 'assets/images/flags/20/ru.svg', lang: 'ru' },
    { text: 'Arabic', flag: 'assets/images/flags/20/ae.svg', lang: 'ar' }
  ];

  /***
* Language Value Set
*/
  setLanguage(text: string, lang: string, flag: string) {
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  // Mode Change
  changeLayoutMode() {
    this.store.select(getLayoutmode).subscribe((mode) => {
      this.mode = mode
    })
    if (this.mode == 'light') {
      this.store.dispatch(changeMode({ mode: 'dark' }));
      this.store.dispatch(changesidebarcolor({ sidebar: 'dark' }));
      this.store.dispatch(changetopbarcolor({ topbar: 'dark' }));
      this.store.select(getLayoutmode).subscribe((mode) => {
        document.documentElement.setAttribute('data-mode', mode)
      })
      this.store.select(getSidebarcolor).subscribe((color) => {
        document.documentElement.setAttribute('data-sidebar', color)
      })
      this.store.select(getTopbarcolor).subscribe((topbar) => {
        document.documentElement.setAttribute('data-topbar', topbar)
      })
    } else {
      this.store.dispatch(changeMode({ mode: 'light' }));
      this.store.dispatch(changesidebarcolor({ sidebar: 'light' }));
      this.store.dispatch(changetopbarcolor({ topbar: 'light' }));
      this.store.select(getLayoutmode).subscribe((mode) => {
        document.documentElement.setAttribute('data-mode', mode)
      })
      this.store.select(getSidebarcolor).subscribe((color) => {
        document.documentElement.setAttribute('data-sidebar', color)
      })
      this.store.select(getTopbarcolor).subscribe((topbar) => {
        document.documentElement.setAttribute('data-topbar', topbar)
      })
    }
  }


  changeSidebar() {


    var windowSize = document.documentElement.clientWidth;
    let sidebarOverlay = document.getElementById("sidebar-overlay") as any;

    if (windowSize < 768) {
      this.document.body.classList.add("overflow-hidden");
      // Check if the sidebar overlay is hidden
      if (sidebarOverlay.classList.contains("hidden")) {
        sidebarOverlay.classList.remove("hidden");
        this.document.documentElement.querySelector('.app-menu')?.classList.remove("hidden");
      } else {
        sidebarOverlay.classList.add("hidden");
        this.document.documentElement.querySelector('.app-menu')?.classList.add("hidden");
      }
      this.store.dispatch(changesidebarsize({ size: 'lg' }));
    } else {
      this.store.select(getSidebarsize).subscribe((size) => {
        this.size = size
      })
      this.store.dispatch(changesidebarsize({ size: this.size === "sm" ? "lg" : "sm" }));
    }
  }

  // Notification Filter
/*  NotifyFilter(type: any) {
    this.type = type
    if (type == 'all') {
      this.notifyList = notification
    } else {
      this.notifyList = notification.filter((item: any) => item.type == type)
    }
  }
*/


  // Increment Decrement Quantity
  quantity: number = 0;
  calculateQty(id: any, quantity: any, i: any) {
    this.subtotal = 0;
    if (id == '0' && quantity > 1) {
      quantity--;
      this.cartlist[i].quantity = quantity
      this.cartlist[i].total = (this.cartlist[i].quantity * this.cartlist[i].price).toFixed(2)
    }
    if (id == '1') {
      quantity++;
      this.cartlist[i].quantity = quantity
      this.cartlist[i].total = (this.cartlist[i].quantity * this.cartlist[i].price).toFixed(2)
    }
    this.cartlist.map((x: any) => {
      this.subtotal += parseFloat(x['total'])
    })
    this.subtotal = this.subtotal.toFixed(2)
    this.discount = (this.subtotal * this.discountRate).toFixed(2)
    this.tax = (this.subtotal * this.taxRate).toFixed(2);
    this.totalprice = (parseFloat(this.subtotal) + parseFloat(this.tax) + parseFloat(this.shippingRate) - parseFloat(this.discount)).toFixed(2)
  }

}
