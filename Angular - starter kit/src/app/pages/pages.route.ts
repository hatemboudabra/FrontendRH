import { Route } from "@angular/router";
import { IndexComponent } from "./dashboard/index/index.component";
import { ChatComponent } from "./apps/chat/chat.component";
import { EmailComponent } from "./apps/email/email.component";
import { EmployeesComponent } from "./hr/employees/employees.component";
import { ListComponent } from "./tache/list/list.component";

export const PAGE_ROUTES: Route[] = [
    { path: '', component: IndexComponent },
    { path: 'chat', component: ChatComponent },
    {path:'email', component: EmailComponent},
    {path:'hr-employee', component:EmployeesComponent},
    {path:'list-tache' , component:ListComponent}


];