import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
    {
        id: 0,
        label: 'menu',
        isTitle: true,
    },
    {
        id: 1,
        label: 'dashboards',
        icon: 'monitor-dot',
        subItems: [
            {
                id: 1.4,
                label: 'hr',
                link: '/',
                parentId: 1
            },
         
        ]
    },
    {
        id: 2,
        label: 'apps',
        isTitle: true,
    },
    {
        id: 2.1,
        label: 'chat',
        icon: 'messages-square',
        link: '/',
        parentId: 2
    },
    {
        id: 2.2,
        label: 'email',
        icon: 'mail',
        link: '/',
        parentId: 2
    },
    {
        id: 2.3,
        label: 'calendar',
        icon: 'calendar-days',
        parentId: 2,
        subItems: [
            {
                id: 2.4,
                label: 'default',
                link: '/',
                parentId: 2.3
            },
            
        
        ]
    },
    {
        id: 2.18,
        label: 'hr-management',
        icon: 'circuit-board',
        parentId: 2,
        subItems: [
            {
                id: 2.19,
                label: 'employees-list',
                link: '/',
                parentId: 2.18
            },
            {
                id: 2.20,
                label: 'holidays',
                link: '/',
                parentId: 2.18
            },
            {
                id: 2.21,
                label: 'leaves-manage',
                parentId: 2.18,
                subItems: [
                    {
                        id: 2.22,
                        label: 'by-employee',
                        link: '/',
                        parentId: 2.21
                    },
                    {
                        id: 2.23,
                        label: 'add-leave-employee',
                        link: '/',
                        parentId: 2.21
                    },
                    {
                        id: 2.24,
                        label: 'by-hr',
                        link: '/',
                        parentId: 2.21
                    },
                    {
                        id: 2.25,
                        label: 'add-leave-hr',
                        link: '/',
                        parentId: 2.21
                    },
                ]
            },
            {
                id: 2.26,
                label: 'attendance',
                parentId: 2,
                subItems: [
                    {
                        id: 2.27,
                        label: 'attendance-hr',
                        link: '/',
                        parentId: 2.26
                    },
                    {
                        id: 2.28,
                        label: 'main-attendance',
                        link: '/',
                        parentId: 2.26
                    },
                ]
            },
           

        ]
    },
    {
        id: 2.38,
        label: 'notes',
        icon: 'scroll-text',
        link: '/',
        parentId: 2,
    },
   
    {
        id: 2.48,
        label: 'users',
        icon: 'user',
        parentId: 2,
        subItems: [
            {
                id: 2.49,
                label: 'list-view',
                link: '/',
                parentId: 2.48,
            },
            {
                id: 2.50,
                label: 'grid-view',
                link: '/',
                parentId: 2.48,
            }
        ]
    },
    {
        id: 2,
        label: 'pages',
        isTitle: true,
    },
    {
        id: 3,
        label: 'authentication',
        icon: 'award',
        subItems: [
            {
                id: 3.1,
                label: 'login',
                parentId: 3,
                subItems: [
                    {
                        id: 3.2,
                        label: 'basic',
                        link: '/',
                        parentId: 3.1,
                    },
                   
                ]
            },
            {
                id: 3.6,
                label: 'register',
                parentId: 3,
                subItems: [
                    {
                        id: 3.7,
                        label: 'basic',
                        link: '/',
                        parentId: 3.6,
                    },
                  
                ]
            },
          
            {
                id: 3.20,
                label: 'logout',
                parentId: 3,
                subItems: [
                    {
                        id: 3.21,
                        label: 'basic',
                        link: '/',
                        parentId: 3.20,
                    },
                    
                ]
            },
            {
                id: 3.25,
                label: 'reset-password',
                parentId: 3,
                subItems: [
                    {
                        id: 3.26,
                        label: 'basic',
                        link: '/',
                        parentId: 3.25,
                    },
                   
                ]
            },
        
        ]
    },

    {
        id: 4,
        label: 'pages',
        icon: 'codesandbox',
        subItems: [
            {
                id: 4.1,
                label: 'account',
                link: '/',
                parentId: 4
            },
            {
                id: 4.2,
                label: 'settings',
                link: '/',
                parentId: 4
            },
            {
                id: 4.3,
                label: 'pricing',
                link: '/',
                parentId: 4
            },
            {
                id: 4.4,
                label: 'faqs',
                link: '/',
                parentId: 4
            },
            {
                id: 4.5,
                label: 'contact-us',
                link: '/',
                parentId: 4
            },
            {
                id: 4.6,
                label: 'coming-soon',
                link: '/',
                parentId: 4
            },
            {
                id: 4.5,
                label: 'error-pages',
                parentId: 4,
                subItems: [
                    {
                        id: 4.6,
                        label: '404-error',
                        link: '/',
                        parentId: 4.5
                    },
                    {
                        id: 4.7,
                        label: 'offline',
                        link: '/',
                        parentId: 4.5
                    },
                ]
            },
            {
                id: 4.8,
                label: 'maintenance',
                link: '/',
                parentId: 4
            },
        ]
    },


   
    {
        id: 7,
        label: 'navigation',
        icon: "locate-fixed",
        link: '/',
        subItems: [
            {
                id: 7.1,
                label: 'navbar',
                link: '/',
                parentId: 7
            },
            {
                id: 7.2,
                label: 'tabs',
                link: '/',
                parentId: 7
            },
            {
                id: 7.3,
                label: 'breadcrumb',
                link: '/',
                parentId: 7
            },
            {
                id: 7.4,
                label: 'pagination',
                link: '/',
                parentId: 7
            }
        ]
    },
  
   
    {
        id: 10,
        label: 'apexcharts',
        icon: 'pie-chart',
        subItems: [
            {
                id: 10.1,
                label: 'area',
                link: '/',
                parentId: 10
            },
            {
                id: 10.2,
                label: 'bar',
                link: '/',
                parentId: 10
            },
            {
                id: 10.3,
                label: 'boxplot',
                link: '/',
                parentId: 10
            },
            {
                id: 10.4,
                label: 'bubble',
                link: '/',
                parentId: 10
            },
            {
                id: 10.5,
                label: 'candlstick',
                link: '/',
                parentId: 10
            },
            {
                id: 10.6,
                label: 'column',
                link: '/',
                parentId: 10
            },
            {
                id: 10.7,
                label: 'funnel',
                link: '/',
                parentId: 10
            },
            {
                id: 10.8,
                label: 'heatmap',
                link: '/',
                parentId: 10
            },
            {
                id: 10.9,
                label: 'line',
                link: '/',
                parentId: 10
            },
            {
                id: 10.10,
                label: 'mixed',
                link: '/',
                parentId: 10
            },
     
   
            {
                id: 10.18,
                label: 'treemap',
                link: '/',
                parentId: 10
            },
        ]
    },

    {
        id: 12,
        label: 'maps',
        icon: 'map',
        subItems: [
            {
                id: 12.1,
                label: 'google',
                link: '/',
                parentId: 12
            },

            {
                id: 12.2,
                label: 'leaflet',
                link: '/',
                parentId: 12
            }
        ]
    },
 
]