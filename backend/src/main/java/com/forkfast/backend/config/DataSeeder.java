package com.forkfast.backend.config;

import com.forkfast.backend.model.Cliente;
import com.forkfast.backend.model.Inventario;
import com.forkfast.backend.model.Orden;
import com.forkfast.backend.model.Producto;
import com.forkfast.backend.repository.ClienteRepository;
import com.forkfast.backend.repository.InventarioRepository;
import com.forkfast.backend.repository.OrdenRepository;
import com.forkfast.backend.repository.ProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Llena la base de datos con información de prueba al arrancar, solo si
 * está vacía. Útil para probar el frontend sin tener que crear todo a mano.
 * Con H2 en memoria esto se vuelve a correr cada vez que reinicias el backend.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final ProductoRepository productoRepository;
    private final InventarioRepository inventarioRepository;
    private final ClienteRepository clienteRepository;
    private final OrdenRepository ordenRepository;

    public DataSeeder(ProductoRepository productoRepository,
                       InventarioRepository inventarioRepository,
                       ClienteRepository clienteRepository,
                       OrdenRepository ordenRepository) {
        this.productoRepository = productoRepository;
        this.inventarioRepository = inventarioRepository;
        this.clienteRepository = clienteRepository;
        this.ordenRepository = ordenRepository;
    }

    @Override
    public void run(String... args) {
        if (productoRepository.count() > 0) {
            return; // ya hay datos, no duplicar
        }

        Producto p1 = nuevoProducto("Pizza Margarita", "Tomate, mozzarella y albahaca", 8990.0, "Pizzas");
        Producto p2 = nuevoProducto("Hamburguesa Clásica", "Carne, queso, lechuga y tomate", 6490.0, "Hamburguesas");
        Producto p3 = nuevoProducto("Ensalada César", "Pollo, crutones y aderezo césar", 5990.0, "Ensaladas");
        Producto p4 = nuevoProducto("Papas Fritas", "Porción grande con sal de mar", 2990.0, "Acompañamientos");
        Producto p5 = nuevoProducto("Limonada Natural", "Vaso de 500ml", 2490.0, "Bebidas");

        List<Producto> productos = productoRepository.saveAll(List.of(p1, p2, p3, p4, p5));

        for (Producto p : productos) {
            Inventario inv = new Inventario();
            inv.setProducto(p);
            inv.setStockActual(20);
            inv.setStockMinimo(5);
            inventarioRepository.save(inv);
        }

        Cliente c1 = nuevoCliente("Juan Pérez", "juan.perez@example.com", "+56911111111");
        Cliente c2 = nuevoCliente("María González", "maria.gonzalez@example.com", "+56922222222");
        Cliente c3 = nuevoCliente("Pedro Soto", "pedro.soto@example.com", "+56933333333");

        List<Cliente> clientes = clienteRepository.saveAll(List.of(c1, c2, c3));

        crearOrden(clientes.get(0), productos.get(0), 2, "PENDIENTE");
        crearOrden(clientes.get(1), productos.get(1), 1, "EN_PREPARACION");
        crearOrden(clientes.get(2), productos.get(3), 3, "ENTREGADA");
        crearOrden(clientes.get(0), productos.get(4), 1, "PENDIENTE");

        System.out.println(">>> DataSeeder: datos de prueba cargados (productos, inventario, clientes, órdenes).");
    }

    private Producto nuevoProducto(String nombre, String descripcion, Double precio, String categoria) {
        Producto p = new Producto();
        p.setNombre(nombre);
        p.setDescripcion(descripcion);
        p.setPrecio(precio);
        p.setCategoria(categoria);
        return p;
    }

    private Cliente nuevoCliente(String nombre, String email, String telefono) {
        Cliente c = new Cliente();
        c.setNombre(nombre);
        c.setEmail(email);
        c.setTelefono(telefono);
        return c;
    }

    private void crearOrden(Cliente cliente, Producto producto, int cantidad, String estado) {
        Orden o = new Orden();
        o.setCliente(cliente);
        o.setProducto(producto);
        o.setCantidad(cantidad);
        o.setEstado(estado);
        o.setFechaCreacion(LocalDateTime.now());
        ordenRepository.save(o);
    }
}
