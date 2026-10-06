import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdenService } from '../../services/OrdenService';

@Component({
  selector: 'app-ordenes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Órdenes</h2>

    <form (ngSubmit)="crear()">
      <input [(ngModel)]="nuevo.cliente.id" name="clienteId" type="number" placeholder="ID Cliente" required />
      <input [(ngModel)]="nuevo.producto.id" name="productoId" type="number" placeholder="ID Producto" required />
      <input [(ngModel)]="nuevo.cantidad" name="cantidad" type="number" placeholder="Cantidad" required />
      <select [(ngModel)]="nuevo.estado" name="estado">
        <option value="PENDIENTE">Pendiente</option>
        <option value="EN_PREPARACION">En preparación</option>
        <option value="ENTREGADA">Entregada</option>
        <option value="CANCELADA">Cancelada</option>
      </select>
      <button type="submit">Crear orden</button>
    </form>

    <table>
      <tr *ngFor="let o of ordenes">
        <td>Cliente #{{ o.cliente?.id }}</td>
        <td>Producto #{{ o.producto?.id }}</td>
        <td>Cant: {{ o.cantidad }}</td>
        <td>{{ o.estado }}</td>
        <td><button (click)="eliminar(o.id)">Eliminar</button></td>
      </tr>
    </table>
  `,
})
export class OrdenesComponent implements OnInit {
  ordenes: any[] = [];
  nuevo: any = {
    cliente: { id: null },
    producto: { id: null },
    cantidad: null,
    estado: 'PENDIENTE',
  };

  constructor(private service: OrdenService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.service.listar().subscribe((data) => (this.ordenes = data));
  }

  crear(): void {
    this.service.crear(this.nuevo).subscribe(() => {
      this.nuevo = {
        cliente: { id: null },
        producto: { id: null },
        cantidad: null,
        estado: 'PENDIENTE',
      };
      this.cargar();
    });
  }

  eliminar(id: number): void {
    this.service.eliminar(id).subscribe(() => this.cargar());
  }
}
