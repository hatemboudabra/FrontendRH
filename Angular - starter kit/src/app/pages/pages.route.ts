import { Route } from "@angular/router";
import { IndexComponent } from "./dashboard/index/index.component";
import { ChatComponent } from "./apps/chat/chat.component";
import { EmailComponent } from "./apps/email/email.component";
import { EmployeesComponent } from "./hr/employees/employees.component";
import { ListComponent } from "./tache/list/list.component";
import { UpdateStatusComponent } from "./tache/update-status/update-status.component";
import { AddTacheComponent } from "./tache/list/add-tache/add-tache.component";
import { OffersComponent } from "./hr/offers/offers.component";
import { ListoffersComponent } from "./hr/listoffers/listoffers.component";
import path from "path";
import { ListdemandeComponent } from "./hr/listdemande/listdemande.component";
import { DemandeManagerComponent } from "./demande/demande-manager/demande-manager.component";
import { AdddemandeComponent } from "./demande/adddemande/adddemande.component";
import { UserdemandeComponent } from "./demande/userdemande/userdemande.component";
import { ListformationComponent } from "./apps/formation/listformation/listformation.component";
import { AddformationComponent } from "./apps/formation/addformation/addformation.component";
import { ListformationuserComponent } from "./hr/listformationuser/listformationuser.component";
import { ListteamComponent } from "./team/listteam/listteam.component";
import { AddTeamComponent } from "./team/add-team/add-team.component";
import { StatComponent } from "./tache/stat/stat.component";
import { AddReclamationComponent } from "./reclamation/add-reclamation/add-reclamation.component";
import { ListReclamationComponent } from "./reclamation/list-reclamation/list-reclamation.component";
import { ClaimsuserComponent } from "./reclamation/claimsuser/claimsuser.component";
import { StatistiqueComponent } from "./hr/statistique/statistique.component";
import { UpdateProfileComponent } from "../account/profile/update-profile/update-profile.component";

export const PAGE_ROUTES: Route[] = [
    { path: '', component: IndexComponent },
    { path: 'chat', component: ChatComponent },//colla /chef
    {path:'email', component: EmailComponent},//rh
    {path:'hr-employee', component:EmployeesComponent},//rh
    {path:'list-tache' , component:ListComponent},//chef    
    {path:'add' , component: AddTacheComponent},//chef
    {path:'updateStatus' , component:UpdateStatusComponent},//colaborateur
    {path:'offers', component:OffersComponent},//homepage
    {path:'listoffers',component:ListoffersComponent},//rh
   {path:'listdemande',component:ListdemandeComponent},//rh
   {path:'demandeChef', component:DemandeManagerComponent},//chef
   {path:'add-demande', component:AdddemandeComponent},//collaborateur
   {path:'userdemande',component:UserdemandeComponent},//collaborateur
   {path:'listformation',component:ListformationComponent},//coll+chef
   {path:'listformation/addformations',component:AddformationComponent},//colla+chef
   {path:'listformationuser',component:ListformationuserComponent},//rh
   {path:'listteam',component:ListteamComponent},//chef / colla
   {path:'add-team',component:AddTeamComponent},//chef
   {path:'stat',component:StatComponent},//chef
   {path:'add-reclamation',component:AddReclamationComponent},//coll    
   {path:'listClaims',component:ListReclamationComponent},//rh
   {path:'listclaimsuser',component:ClaimsuserComponent},//colla
   {path:'statist',component:StatistiqueComponent},//
   {path:'updateProfile', component:UpdateProfileComponent},



];