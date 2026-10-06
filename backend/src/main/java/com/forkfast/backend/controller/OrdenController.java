package com.forkfast.backend.controller;

import com.forkfast.backend.model.Orden;
import com.forkfast.backend.repository.OrdenRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ordens")
public class OrdenController {

    private final OrdenRepository repository;

    public OrdenController(OrdenRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Orden> listar() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Orden> obtener(@PathVariable Long id) {
        return repository.findById(id);
    }

    @PostMapping
    public Orden crear(@RequestBody Orden item) {
        return repository.save(item);
    }

    @PutMapping("/{id}")
    public Orden actualizar(@PathVariable Long id, @RequestBody Orden item) {
        item.setId(id);
        return repository.save(item);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
