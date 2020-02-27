import { RecipesRoutingModule } from './recipes/recipes-routing.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'blank-page', loadChildren: () => import('./blank-page/blank-page.module').then(m => m.BlankPageModule) },
            { path: 'dining-rooms', loadChildren: () => import('./dining-rooms/dining-rooms.module').then(m => m.DiningRoomsModule) },
            { path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule) },
            { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule) }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
