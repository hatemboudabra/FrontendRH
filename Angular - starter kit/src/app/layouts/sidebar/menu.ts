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
                parentId: 1,
                roles: ['ROLE_RESPONSABLE_RH'] 
            },
        ]
    },
    {
        id: 5, 
        label: 'Tache', 
        icon: 'calendar-days', 
        roles: ['ROLE_CHEF', 'ROLE_COLLABORATEUR'],
        subItems: [
            { id: 5.1, label: 'Ajouter Tâche', link: '/add', parentId: 5, roles: ['ROLE_CHEF'] },
            { id: 5.2, label: 'Liste des Tâches', link: '/list-tache', parentId: 5, roles: ['ROLE_CHEF'] },
            { id: 5.3, label: 'Mettre à jour le statut', link: '/updateStatus', parentId: 5, roles: ['ROLE_COLLABORATEUR'] }
        ]
    },
    {
        id: 2.18,
        label: 'Gestion RH',
        icon: 'circuit-board',
        roles: ['ROLE_RESPONSABLE_RH'], 
        subItems: [
            { id: 2.19, label: 'Liste des employés', link: '/hr-employee', parentId: 2.18, roles: ['ROLE_RESPONSABLE_RH'] },
            { id: 2.20, label: 'Liste des offres', link: '/listoffers', parentId: 2.18, roles: ['ROLE_RESPONSABLE_RH'] },
            { id: 2.21, label: 'Demandes', link: '/listdemande', parentId: 2.18, roles: ['ROLE_RESPONSABLE_RH'] },
            { id: 2.22, label: 'Formations', link: '/listformation', parentId: 2.18, roles: ['ROLE_RESPONSABLE_RH'] }
        ]
    },
    {
        id: 6,
        label: 'Demandes',
        icon: 'file-text',
        roles: ['ROLE_CHEF', 'ROLE_COLLABORATEUR'],
        subItems: [
            { id: 6.1, label: 'Gérer les demandes', link: '/demandeChef', parentId: 6, roles: ['ROLE_CHEF'] },
            { id: 6.2, label: 'Ajouter une demande', link: '/add-demande', parentId: 6, roles: ['ROLE_COLLABORATEUR'] },
            { id: 6.3, label: 'Mes demandes', link: '/userdemande', parentId: 6, roles: ['ROLE_COLLABORATEUR'] }
        ]
    },
    {
        id: 7,
        label: 'Reclamations',
        icon: 'alert-triangle',
        roles: ['ROLE_COLLABORATEUR', 'ROLE_RESPONSABLE_RH'],
        subItems: [
            { id: 7.1, label: 'Ajouter Réclamation', link: '/add-reclamation', parentId: 7, roles: ['ROLE_COLLABORATEUR'] },
            { id: 7.2, label: 'Liste Réclamations RH', link: '/listClaims', parentId: 7, roles: ['ROLE_RESPONSABLE_RH'] },
            { id: 7.3, label: 'Mes Réclamations', link: '/listclaimsuser', parentId: 7, roles: ['ROLE_COLLABORATEUR'] }
        ]
    },
    {
        id: 8,
        label: 'Équipe',
        icon: 'users',
        roles: ['ROLE_CHEF', 'ROLE_COLLABORATEUR'],
        subItems: [
            { id: 8.1, label: 'Liste des équipes', link: '/listteam', parentId: 8, roles: ['ROLE_CHEF', 'ROLE_COLLABORATEUR'] },
            { id: 8.2, label: 'Ajouter une équipe', link: '/add-team', parentId: 8, roles: ['ROLE_CHEF'] }
        ]
    },
    {
        id: 10,
        label: 'Statistiques',
        icon: 'pie-chart',
        roles: ['ROLE_CHEF'],
        subItems: [
            { id: 10.1, label: 'Statistiques générales', link: '/stat', parentId: 10, roles: ['ROLE_CHEF'] }
        ]
    },
    {
        id: 11,
        label: 'Communication',
        icon: 'message-circle',
        roles: ['ROLE_RESPONSABLE_RH', 'ROLE_COLLABORATEUR', 'ROLE_CHEF'], 
        subItems: [
            { id: 11.1, label: 'Chat', link: '/chat', parentId: 11, roles: [ 'ROLE_COLLABORATEUR', 'ROLE_CHEF'] },
            { id: 11.2, label: 'Email', link: '/email', parentId: 11, roles: ['ROLE_RESPONSABLE_RH'] }
        ]
    }
];