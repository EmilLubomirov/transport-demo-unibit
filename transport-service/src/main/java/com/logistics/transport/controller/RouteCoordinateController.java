package com.logistics.transport.controller;

import com.logistics.transport.dto.response.RouteCoordinateResponse;
import com.logistics.transport.service.RouteCoordinateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/coordinates")
@RequiredArgsConstructor
@Tag(name = "Coordinates", description = "GPS coordinate retrieval for map visualization")
public class RouteCoordinateController {

    private final RouteCoordinateService coordinateService;

    @GetMapping("/route/{routeId}")
    @Operation(summary = "Get GPS coordinates for a route, ordered by timestamp")
    public ResponseEntity<List<RouteCoordinateResponse>> getByRouteId(@PathVariable Long routeId) {
        return ResponseEntity.ok(coordinateService.getByRouteId(routeId));
    }
}
