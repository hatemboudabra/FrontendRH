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
                id: 101,
                label: 'hr',
                link: '/',
                parentId: 1,
                roles: ['ROLE_RESPONSABLE_RH'] 
            },
        ]
    },
    {
        id: 5, 
        label: 'Project', 
        icon: 'calendar-days', 
        roles: ['ROLE_CHEF', 'ROLE_COLLABORATEUR'],
        subItems: [
            { id: 501, label: 'Ajouter Projet', link: '/addproject', parentId: 5, roles: ['ROLE_CHEF'] },
            { id: 505, label: 'Liste des Projets', link: '/listproject', parentId: 5, roles: ['ROLE_CHEF'] },
            { id: 502, label: 'Ajouter Tâche', link: '/add', parentId: 5, roles: ['ROLE_CHEF'] },
            { id: 503, label: 'Liste des Tâches', link: '/list-tache', parentId: 5, roles: ['ROLE_CHEF'] },
            { id: 504, label: 'Mettre à jour le statut', link: '/updateStatus', parentId: 5, roles: ['ROLE_COLLABORATEUR'] },
        ]
    },
    {
        id: 218,
        label: 'Gestion RH',
        icon: 'circuit-board',
        roles: ['ROLE_RESPONSABLE_RH'], 
        subItems: [
            { id: 219, label: 'Liste des employés', link: '/hr-employee', parentId: 218, roles: ['ROLE_RESPONSABLE_RH'] },
            { id: 220, label: 'Liste des offres', link: '/listoffers', parentId: 218, roles: ['ROLE_RESPONSABLE_RH'] },
            { id: 221, label: 'Demandes', link: '/listdemande', parentId: 218, roles: ['ROLE_RESPONSABLE_RH'] },
            { id: 222, label: 'Formations', link: '/listformationuser', parentId: 218, roles: ['ROLE_RESPONSABLE_RH'] },
            { id: 222, label: 'events', link: '/addevent', parentId: 218, roles: ['ROLE_RESPONSABLE_RH'] }

        ]
    },
    
    {
        id: 6,
        label: 'Demandes',
        icon: 'file-text',
        roles: ['ROLE_CHEF', 'ROLE_COLLABORATEUR'],
        subItems: [
            { id: 601, label: 'Gérer les demandes', link: '/demandeChef', parentId: 6, roles: ['ROLE_CHEF'] },
            { id: 602, label: 'Ajouter une demande', link: '/add-demande', parentId: 6, roles: ['ROLE_COLLABORATEUR'] },
            { id: 603, label: 'Mes demandes', link: '/userdemande', parentId: 6, roles: ['ROLE_COLLABORATEUR'] }
        ]
    },
    {
        id: 7,
        label: 'Reclamations',
        icon: 'alert-triangle',
        roles: ['ROLE_COLLABORATEUR', 'ROLE_RESPONSABLE_RH'],
        subItems: [
            { id: 701, label: 'Ajouter Réclamation', link: '/add-reclamation', parentId: 7, roles: ['ROLE_COLLABORATEUR'] },
            { id: 702, label: 'Liste Réclamations RH', link: '/listClaims', parentId: 7, roles: ['ROLE_RESPONSABLE_RH'] },
            { id: 703, label: 'Mes Réclamations', link: '/listclaimsuser', parentId: 7, roles: ['ROLE_COLLABORATEUR'] }
        ]
    },
    
    {
        id: 8,
        label: 'Équipe',
        icon: 'users',
        roles: ['ROLE_CHEF', 'ROLE_COLLABORATEUR'],
        subItems: [
            { id: 801, label: 'Liste des équipes', link: '/listteam', parentId: 8, roles: ['ROLE_CHEF'] },
            { id: 802, label: 'Ajouter une équipe', link: '/add-team', parentId: 8, roles: ['ROLE_CHEF'] },
            { id: 803, label: 'Liste une équipe', link: '/listteamcoolaborateur', parentId: 8, roles: ['ROLE_COLLABORATEUR'] },
        ]
    },
    {
        id: 9,
        label: 'Formations',
        icon: 'book-open', 
        roles: ['ROLE_CHEF', 'ROLE_COLLABORATEUR'], 
        subItems: [
            { id: 901, label: 'Liste des Formations', link: '/listformation', parentId: 9, roles: ['ROLE_CHEF', 'ROLE_COLLABORATEUR'] },
            { id: 902, label: 'Ajouter une Formation', link: '/listformation/addformations', parentId: 9, roles: ['ROLE_CHEF'] } 
        ]
    },
    {
        id: 10,
        label: 'Statistiques',
        icon: 'pie-chart',
        link: '/stat',
        roles: ['ROLE_CHEF']
    },
    {
        id: 11,
        label: 'Statistiques',
        icon: 'pie-chart',
        link: '/statist',
        roles: ['ROLE_RESPONSABLE_RH']
    },
    {
        id: 11,
        label: 'Communication',
        icon: 'message-circle',
        roles: ['ROLE_RESPONSABLE_RH', 'ROLE_COLLABORATEUR', 'ROLE_CHEF'], 
        subItems: [
            { id: 1101, label: 'Chat', link: '/chat', parentId: 11, roles: [ 'ROLE_COLLABORATEUR', 'ROLE_CHEF'] },  
            { id: 1102, label: 'Email', link: '/email', parentId: 11, roles: ['ROLE_RESPONSABLE_RH'] }
        ]
    }/*,
    {
        id: 12,
        label: 'Évaluation',
        icon: 'clipboard-list', 
        roles: ['ROLE_CHEF'],
        subItems: [
            { id: 1201, label: 'Ajouter une évaluation', link: '/addnote', parentId: 12, roles: ['ROLE_CHEF'] },
           
        ]
    }*/,
        {
            id: 13,
            label: 'Calendrier',
            icon: 'calendar',
            link: '/calendar',
            roles: ['ROLE_RESPONSABLE_RH']
        },
        

];
