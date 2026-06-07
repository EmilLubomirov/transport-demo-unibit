package com.logistics.transport.controller;

import com.logistics.transport.dto.request.CreateTransportRequest;
import com.logistics.transport.dto.request.UpdateTransportStatusRequest;
import com.logistics.transport.dto.response.TransportResponse;
import com.logistics.transport.enums.TransportStatus;
import com.logistics.transport.service.TransportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transports")
@RequiredArgsConstructor
@Tag(name = "Transports", description = "Transport operation management")
public class TransportController {

    private final TransportService transportService;

    @PostMapping
    @Operation(summary = "Create a new transport operation")
    public ResponseEntity<TransportResponse> create(@Valid @RequestBody CreateTransportRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transportService.create(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get transport by ID")
    public ResponseEntity<TransportResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(transportService.getById(id));
    }

    @GetMapping
    @Operation(summary = "List all transports, optionally filtered by status")
    public ResponseEntity<List<TransportResponse>> getAll(
            @RequestParam(required = false) TransportStatus status) {
        return ResponseEntity.ok(transportService.getAll(status));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update transport status")
    public ResponseEntity<TransportResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTransportStatusRequest request) {
        return ResponseEntity.ok(transportService.updateStatus(id, request.getStatus()));
    }
}
