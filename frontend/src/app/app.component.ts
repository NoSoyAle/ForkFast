import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <header>
      <h1>🍽️ ForkFast-FF</h1>
      <nav *ngIf="estaAutenticado">
        <a routerLink="/productos">Productos</a>
        <a routerLink="/inventario">Inventario</a>
        <a routerLink="/clientes">Clientes</a>
        <a routerLink="/ordenes">Órdenes</a>
        <button (click)="cerrarSesion()">Cerrar sesión</button>
      </nav>
    </header>

    <main *ngIf="estaAutenticado">
      <router-outlet></router-outlet>
    </main>

    <div class="login-screen" *ngIf="!estaAutenticado">
      <h2>Bienvenido a ForkFast-FF</h2>
      <p>Gestiona productos, inventario, clientes y órdenes de tu restaurante. Inicia sesión con tu cuenta corporativa para continuar.</p>
      <button (click)="iniciarSesion()">Iniciar sesión con Microsoft</button>
    </div>
  `,
})
export class AppComponent implements OnInit {
  estaAutenticado = false;

  constructor(
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {}

  ngOnInit(): void {
    this.msalBroadcastService.inProgress$
      .pipe(filter((status) => status === InteractionStatus.None))
      .subscribe(() => {
        this.estaAutenticado = this.msalService.instance.getAllAccounts().length > 0;
      });
  }

  iniciarSesion(): void {
    this.msalService.loginRedirect();
  }

  cerrarSesion(): void {
    this.msalService.logoutRedirect();
  }
}
