import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { ProductosComponent } from './pages/productos/productos.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { OrdenesComponent } from './pages/ordenes/ordenes.component';

export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  { path: 'productos', component: ProductosComponent, canActivate: [MsalGuard] },
  { path: 'inventario', component: InventarioComponent, canActivate: [MsalGuard] },
  { path: 'clientes', component: ClientesComponent, canActivate: [MsalGuard] },
  { path: 'ordenes', component: OrdenesComponent, canActivate: [MsalGuard] },
];
