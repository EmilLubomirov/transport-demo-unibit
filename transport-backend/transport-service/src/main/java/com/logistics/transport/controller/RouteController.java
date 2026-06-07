package com.logistics.transport.controller;

import com.logistics.transport.dto.request.CreateRouteRequest;
import com.logistics.transport.dto.response.RouteResponse;
import com.logistics.transport.service.RouteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/routes")
@RequiredArgsConstructor
@Tag(name = "Routes", description = "Route management within a transport operation")
public class RouteController {

    private final RouteService routeService;

    @PostMapping
    @Operation(summary = "Create a new route")
    public ResponseEntity<RouteResponse> create(@Valid @RequestBody CreateRouteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(routeService.create(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get route by ID")
    public ResponseEntity<RouteResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(routeService.getById(id));
    }

    @GetMapping("/transport/{transportId}")
    @Operation(summary = "Get all routes for a transport")
    public ResponseEntity<List<RouteResponse>> getByTransportId(@PathVariable Long transportId) {
        return ResponseEntity.ok(routeService.getByTransportId(transportId));
    }
}
