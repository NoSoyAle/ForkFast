import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/ProductoService';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Productos</h2>

    <form (ngSubmit)="crear()">
      <input [(ngModel)]="nuevo.nombre" name="nombre" placeholder="Nombre" required />
      <input [(ngModel)]="nuevo.descripcion" name="descripcion" placeholder="Descripción" />
      <input [(ngModel)]="nuevo.precio" name="precio" type="number" placeholder="Precio" required />
      <input [(ngModel)]="nuevo.categoria" name="categoria" placeholder="Categoría" />
      <button type="submit">Agregar</button>
    </form>

    <table>
      <tr *ngFor="let p of productos">
        <td>{{ p.nombre }}</td>
        <td>{{ p.descripcion }}</td>
        <td>{{ p.precio | currency }}</td>
        <td>{{ p.categoria }}</td>
        <td><button (click)="eliminar(p.id)">Eliminar</button></td>
      </tr>
    </table>
  `,
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  nuevo: any = { nombre: '', descripcion: '', precio: null, categoria: '' };

  constructor(private service: ProductoService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.service.listar().subscribe((data) => (this.productos = data));
  }

  crear(): void {
    this.service.crear(this.nuevo).subscribe(() => {
      this.nuevo = { nombre: '', descripcion: '', precio: null, categoria: '' };
      this.cargar();
    });
  }

  eliminar(id: number): void {
    this.service.eliminar(id).subscribe(() => this.cargar());
  }
}
