import { CUSTOM_ELEMENTS_SCHEMA, Component, HostListener, NgZone, inject, ChangeDetectorRef } from '@angular/core';
import { File, LUCIDE_ICONS, LucideAngularModule, LucideIconProvider, icons } from 'lucide-angular';
import { MENU } from './menu';
import { SimplebarAngularModule } from 'simplebar-angular';
import { MenuItem } from './menu.model';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { CutomDropdownComponent } from '../../Component/customdropdown';
import { Store } from '@ngrx/store';
import { getLayout, getSidebarsize } from '../../store/layout/layout-selector';
import { CommonModule } from '@angular/common';
import { changesidebarsize } from '../../store/layout/layout-action';
import { AuthenticationService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SimplebarAngularModule, CutomDropdownComponent, TranslateModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }, LanguageService]
})
export class SidebarComponent {
  menuItems: any;
  user: any;
  isMoreMenu: boolean = false;
  navData: any;
  navbarMenuItems: any = [];
  layout: any;
  size: any;
  userRole: any;
  filteredMenuItems: MenuItem[] = [];

  private store = inject(Store);
  private zone = inject(NgZone); // Injection de NgZone
  private cdr = inject(ChangeDetectorRef); // Injection de ChangeDetectorRef

  constructor(public translate: TranslateService, private auth: AuthenticationService) {
    translate.setDefaultLang('sp');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (document.documentElement.getAttribute('data-layout') == 'horizontal') {
      if (document.documentElement.clientWidth >= 1025) {
        setTimeout(() => {
          this.updateMenu();
        }, 500);
      }
    }
  }

  filterMenuByRole(menuItems: MenuItem[], userRole: string): MenuItem[] {
    return menuItems.filter(item => {
      if (item.subItems) {
        item.subItems = this.filterMenuByRole(item.subItems, userRole);
      }
      return !item.roles || item.roles.includes(userRole);
    });
  }

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe(
      user => {
        if (user) {
          console.log("✅ Utilisateur récupéré :", user);
          this.userRole = user.roles?.[0] || null;
          console.log("🎭 Rôle utilisateur :", this.userRole);
          this.filteredMenuItems = this.filterMenuByRole(MENU, this.userRole);

          this.zone.run(() => { // 🔥 Force la détection des changements
            this.menuItems = this.filteredMenuItems;
            this.cdr.detectChanges(); // 🔥 Force la détection des changements
          });

          if (!user.username) {
            console.error("⚠️ Username est undefined !");
          } else {
            this.user = user;
            this.loadUserData(user.username);
          }
        } else {
          console.log("❌ Aucun utilisateur connecté.");
        }
      },
      error => {
        console.error("❌ Erreur lors de la récupération de l'utilisateur :", error);
      }
    );

    // Récupérer la mise en page et la taille du sidebar
    this.store.select(getLayout).subscribe((data) => {
      this.layout = data;
      if (this.layout === 'horizontal') {
        setTimeout(() => {
          this.updateMenu();
        }, 1500);
      } else {
        this.menuItems = MENU;
      }
    });

    this.store.select(getSidebarsize).subscribe((data) => {
      this.size = data;
    });

    this.navData = MENU;
    this.menuItems = this.navData;
  }

  loadUserData(username: string): void {
    console.log("🔍 Récupération des données utilisateur pour :", username);

    if (!username) {
      console.error("⛔ Username est vide !");
      return;
    }

    this.auth.getUserByUsername(username).subscribe(
      data => {
        if (data && data.id) {
          console.log('✅ ID utilisateur reçu :', data.id);

          this.zone.run(() => { // 🔥 Force la détection après mise à jour
            this.user = { ...this.user, id: data.id };
            this.cdr.detectChanges(); // 🔥 Force la détection des changements
          });
        } else {
          console.error('❌ Données utilisateur invalides ou ID manquant');
        }
      },
      error => {
        console.error('❌ Erreur lors de la récupération des données utilisateur', error);
      }
    );
  }

  ngAfterViewInit() {
    if (this.layout == 'horizontal') {
      setTimeout(() => {
        this.updateMenu();
      }, 1500);
    } else {
      this.menuItems = MENU;
    }
  }

  updateMenu() {
    const isMoreMenu = false;
    const navbarHeader = document.querySelector(".navbar-header");
    const navbarNav = document.getElementById("navbar-nav") as any;

    const fullWidthOfMenu = navbarHeader!.clientWidth - 150;
    const menuWidth = fullWidthOfMenu || 0;
    let totalItemsWidth = 0;
    let visibleItems: any = [];
    let hiddenItems: any = [];

    const moreMenuItem = {
      id: 'more',
      label: 'more',
      icon: 'network',
      subItems: null,
      link: 'sidebarMore',
      stateVariables: isMoreMenu,
      click: (e: any) => {
        e.preventDefault();
        this.isMoreMenu = !this.isMoreMenu;
      },
    };

    for (let i = 0; i < this.navData.length; i++) {
      const itemWidth = navbarNav?.children[i]?.offsetWidth;
      totalItemsWidth += itemWidth;

      if (totalItemsWidth <= menuWidth - 50 || window.innerWidth < 768) {
        visibleItems.push(this.navData[i]);
      } else {
        if (!this.navData[i].isTitle) {
          hiddenItems.push(this.navData[i]);
        }
      }
      if (i + 1 === this.navData.length) {
        moreMenuItem.subItems = hiddenItems;
      }
    }

    this.zone.run(() => { // 🔥 Mettre à jour le menu avec NgZone
      this.menuItems = hiddenItems.length > 0 ? [...visibleItems, moreMenuItem] : visibleItems;
      this.cdr.detectChanges(); // 🔥 Force la détection des changements
    });
  }

  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  hideSidebar() {
    let sidebarOverlay = document.getElementById("sidebar-overlay") as any;
    sidebarOverlay.classList.add("hidden");
    document.documentElement.querySelector('.app-menu')?.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }
}