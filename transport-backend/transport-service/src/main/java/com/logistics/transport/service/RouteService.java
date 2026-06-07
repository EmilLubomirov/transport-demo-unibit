package com.logistics.transport.service;

import com.logistics.transport.dto.request.CreateRouteRequest;
import com.logistics.transport.dto.response.RouteResponse;
import com.logistics.transport.entity.Route;
import com.logistics.transport.enums.RouteStatus;
import com.logistics.transport.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final RouteRepository routeRepository;
    private final TransportService transportService;

    @Transactional
    public RouteResponse create(CreateRouteRequest request) {
        Route route = Route.builder()
                .transport(transportService.findOrThrow(request.getTransportId()))
                .driverId(request.getDriverId())
                .vehicleId(request.getVehicleId())
                .startPoint(request.getStartPoint())
                .endPoint(request.getEndPoint())
                .distance(request.getDistance())
                .status(RouteStatus.PENDING)
                .build();

        return toResponse(routeRepository.save(route));
    }

    @Transactional(readOnly = true)
    public RouteResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<RouteResponse> getByTransportId(Long transportId) {
        return routeRepository.findByTransportId(transportId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public void updateRouteStatus(Long routeId, RouteStatus newStatus) {
        Route route = findOrThrow(routeId);
        route.setStatus(newStatus);
        routeRepository.save(route);
    }

    Route findOrThrow(Long id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Route not found: " + id));
    }

    private RouteResponse toResponse(Route r) {
        return RouteResponse.builder()
                .id(r.getId())
                .transportId(r.getTransport().getId())
                .driverId(r.getDriverId())
                .vehicleId(r.getVehicleId())
                .avgSpeed(r.getAvgSpeed())
                .startPoint(r.getStartPoint())
                .endPoint(r.getEndPoint())
                .distance(r.getDistance())
                .status(r.getStatus())
                .build();
    }
}
