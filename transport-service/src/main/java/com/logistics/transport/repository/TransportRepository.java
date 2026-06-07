package com.logistics.transport.repository;

import com.logistics.transport.entity.Transport;
import com.logistics.transport.enums.TransportStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransportRepository extends JpaRepository<Transport, Long> {

    List<Transport> findByStatus(TransportStatus status);
}
