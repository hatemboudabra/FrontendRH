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
        label: 'Tache',
        icon: 'calendar-days',
        parentId: 2,
        subItems: [
            {
                id: 2.4,
                label: 'add Tache',
                link: '/',
                parentId: 2.3
            },
            {
                id: 2.5,
                label: 'List Tache',
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
            // {
            //     id: 2.20,
            //     label: 'Reclamation',
            //     link: '/',
            //     parentId: 2.18
            // },
            {
                id: 2.21,
                label: 'Demande',
                parentId: 2.18,
                subItems: [
                    {
                        id: 2.22,
                        label: 'Avance',
                        link: '/',
                        parentId: 2.21
                    },
                     {
                         id: 2.23,
                        label: 'Prêts',
                         link: '/',
                         parentId: 2.21
                     },
                    // {
                    //     id: 2.24,
                    //     label: 'by-hr',
                    //     link: '/',
                    //     parentId: 2.21
                    // },
                    // {
                    //     id: 2.25,
                    //     label: 'add-leave-hr',
                    //     link: '/',
                    //     parentId: 2.21
                    // },
                ]
            },
            {
                id: 2.26,
                label: 'Cadidature',
                parentId: 2,
                subItems: [
                    {
                        id: 2.27,
                        label: 'List Candidat',
                        link: '/',
                        parentId: 2.26
                    },
                    {
                        id: 2.28,
                        label: 'Offers',
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
 
]