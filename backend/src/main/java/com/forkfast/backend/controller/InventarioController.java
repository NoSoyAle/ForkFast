package com.forkfast.backend.controller;

import com.forkfast.backend.model.Inventario;
import com.forkfast.backend.repository.InventarioRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inventarios")
public class InventarioController {

    private final InventarioRepository repository;

    public InventarioController(InventarioRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Inventario> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Inventario> obtener(@PathVariable Long id) {
        return repository.findById(id);
    }

    @PostMapping
    public Inventario crear(@RequestBody Inventario item) {
        return repository.save(item);
    }

    @PutMapping("/{id}")
    public Inventario actualizar(@PathVariable Long id, @RequestBody Inventario item) {
        item.setId(id);
        return repository.save(item);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
