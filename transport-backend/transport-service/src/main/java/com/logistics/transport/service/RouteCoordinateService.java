package com.logistics.transport.service;

import com.logistics.transport.dto.messaging.CoordinateBatchMessage;
import com.logistics.transport.dto.response.RouteCoordinateResponse;
import com.logistics.transport.entity.RouteCoordinate;
import com.logistics.transport.repository.RouteCoordinateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteCoordinateService {

    private final RouteCoordinateRepository coordinateRepository;
    private final RouteService routeService;

    @Transactional(readOnly = true)
    public List<RouteCoordinateResponse> getByRouteId(Long routeId) {
        return coordinateRepository.findByRouteIdOrderByRecordedAtAsc(routeId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public void saveCoordinateBatch(Long routeId, List<CoordinateBatchMessage.CoordinateEntry> entries) {
        var route = routeService.findOrThrow(routeId);

        List<RouteCoordinate> coordinates = entries.stream()
                .map(entry -> RouteCoordinate.builder()
                        .route(route)
                        .recordedAt(entry.getRecordedAt())
                        .serverTime(OffsetDateTime.now())
                        .telematicData(entry.getData())
                        .build())
                .toList();

        coordinateRepository.saveAll(coordinates);
    }

    private RouteCoordinateResponse toResponse(RouteCoordinate c) {
        return RouteCoordinateResponse.builder()
                .id(c.getId())
                .routeId(c.getRoute().getId())
                .recordedAt(c.getRecordedAt())
                .serverTime(c.getServerTime())
                .telematicData(c.getTelematicData())
                .build();
    }
}
