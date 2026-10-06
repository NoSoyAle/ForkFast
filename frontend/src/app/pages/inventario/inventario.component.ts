import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../../services/InventarioService';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Inventario</h2>

    <form (ngSubmit)="crear()">
      <input [(ngModel)]="nuevo.producto.id" name="productoId" type="number" placeholder="ID Producto" required />
      <input [(ngModel)]="nuevo.stockActual" name="stockActual" type="number" placeholder="Stock actual" required />
      <input [(ngModel)]="nuevo.stockMinimo" name="stockMinimo" type="number" placeholder="Stock mínimo" required />
      <button type="submit">Agregar</button>
    </form>

    <table>
      <tr *ngFor="let i of inventario">
        <td>Producto #{{ i.producto?.id }}</td>
        <td>Actual: {{ i.stockActual }}</td>
        <td>Mínimo: {{ i.stockMinimo }}</td>
        <td><button (click)="eliminar(i.id)">Eliminar</button></td>
      </tr>
    </table>
  `,
})
export class InventarioComponent implements OnInit {
  inventario: any[] = [];
  nuevo: any = { producto: { id: null }, stockActual: null, stockMinimo: null };

  constructor(private service: InventarioService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.service.listar().subscribe((data) => (this.inventario = data));
  }

  crear(): void {
    this.service.crear(this.nuevo).subscribe(() => {
      this.nuevo = { producto: { id: null }, stockActual: null, stockMinimo: null };
      this.cargar();
    });
  }

  eliminar(id: number): void {
    this.service.eliminar(id).subscribe(() => this.cargar());
  }
}
