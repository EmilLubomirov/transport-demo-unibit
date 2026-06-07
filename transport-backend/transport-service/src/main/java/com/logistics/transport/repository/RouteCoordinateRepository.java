package com.logistics.transport.repository;

import com.logistics.transport.entity.RouteCoordinate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RouteCoordinateRepository extends JpaRepository<RouteCoordinate, Long> {

    List<RouteCoordinate> findByRouteIdOrderByRecordedAtAsc(Long routeId);
}
