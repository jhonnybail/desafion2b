import { RouterModule, Routes } from '@angular/router';
import { ListPostComponent } from './list-post/list-post.component';
import { AuthGuard } from './guards/AuthGuard';

const routes: Routes = [
    { path: '', component: ListPostComponent },
    { path: 'meus-posts', component: ListPostComponent, canActivate: [AuthGuard] }
];

export const routing = RouterModule.forRoot(routes);
