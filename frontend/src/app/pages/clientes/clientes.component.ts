import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/ClienteService';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Clientes</h2>

    <form (ngSubmit)="crear()">
      <input [(ngModel)]="nuevo.nombre" name="nombre" placeholder="Nombre" required />
      <input [(ngModel)]="nuevo.email" name="email" placeholder="Email" required />
      <input [(ngModel)]="nuevo.telefono" name="telefono" placeholder="Teléfono" />
      <button type="submit">Agregar</button>
    </form>

    <table>
      <tr *ngFor="let c of clientes">
        <td>{{ c.nombre }}</td>
        <td>{{ c.email }}</td>
        <td>{{ c.telefono }}</td>
        <td><button (click)="eliminar(c.id)">Eliminar</button></td>
      </tr>
    </table>
  `,
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  nuevo: any = { nombre: '', email: '', telefono: '' };

  constructor(private service: ClienteService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.service.listar().subscribe((data) => (this.clientes = data));
  }

  crear(): void {
    this.service.crear(this.nuevo).subscribe(() => {
      this.nuevo = { nombre: '', email: '', telefono: '' };
      this.cargar();
    });
  }

  eliminar(id: number): void {
    this.service.eliminar(id).subscribe(() => this.cargar());
  }
}
