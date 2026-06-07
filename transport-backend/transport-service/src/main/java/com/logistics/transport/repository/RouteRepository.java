package com.logistics.transport.repository;

import com.logistics.transport.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RouteRepository extends JpaRepository<Route, Long> {

    List<Route> findByTransportId(Long transportId);
}
