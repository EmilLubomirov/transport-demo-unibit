package com.logistics.transport.service;

import com.logistics.transport.dto.request.CreateTransportRequest;
import com.logistics.transport.dto.response.TransportResponse;
import com.logistics.transport.entity.Route;
import com.logistics.transport.entity.Transport;
import com.logistics.transport.enums.TransportStatus;
import com.logistics.transport.repository.TransportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransportService {

    private final TransportRepository transportRepository;

    @Transactional
    public TransportResponse create(CreateTransportRequest request) {
        Transport transport = Transport.builder()
                .origin(request.getOrigin())
                .destination(request.getDestination())
                .plannedDeparture(request.getPlannedDeparture())
                .plannedArrival(request.getPlannedArrival())
                .status(TransportStatus.PLANNED)
                .build();

        return toResponse(transportRepository.save(transport));
    }

    @Transactional(readOnly = true)
    public TransportResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<TransportResponse> getAll(TransportStatus status) {
        List<Transport> transports = (status != null)
                ? transportRepository.findByStatus(status)
                : transportRepository.findAll();
        return transports.stream().map(this::toResponse).toList();
    }

    @Transactional
    public TransportResponse updateStatus(Long id, TransportStatus newStatus) {
        Transport transport = findOrThrow(id);
        transport.setStatus(newStatus);
        if (newStatus == TransportStatus.IN_PROGRESS && transport.getActualDeparture() == null) {
            transport.setActualDeparture(OffsetDateTime.now());
        }
        if (newStatus == TransportStatus.COMPLETED && transport.getActualArrival() == null) {
            transport.setActualArrival(OffsetDateTime.now());
        }
        return toResponse(transportRepository.save(transport));
    }

    Transport findOrThrow(Long id) {
        return transportRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Transport not found: " + id));
    }

    private TransportResponse toResponse(Transport t) {
        return TransportResponse.builder()
                .id(t.getId())
                .origin(t.getOrigin())
                .destination(t.getDestination())
                .status(t.getStatus())
                .plannedDeparture(t.getPlannedDeparture())
                .plannedArrival(t.getPlannedArrival())
                .actualDeparture(t.getActualDeparture())
                .actualArrival(t.getActualArrival())
                .eta(t.getEta())
                .routeIds(t.getRoutes().stream().map(Route::getId).toList())
                .build();
    }
}
