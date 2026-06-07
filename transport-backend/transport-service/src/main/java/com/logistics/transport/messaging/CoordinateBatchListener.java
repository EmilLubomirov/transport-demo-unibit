package com.logistics.transport.messaging;

import com.logistics.transport.config.RabbitMQConfig;
import com.logistics.transport.dto.messaging.CoordinateBatchMessage;
import com.logistics.transport.service.RouteCoordinateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpRejectAndDontRequeueException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class CoordinateBatchListener {

    private final RouteCoordinateService coordinateService;

    @RabbitListener(queues = RabbitMQConfig.COORDINATES_QUEUE)
    public void handleCoordinateBatch(CoordinateBatchMessage message) {
        log.info("Received coordinate batch: routeId={}, points={}",
                message.getRouteId(),
                message.getCoordinates() != null ? message.getCoordinates().size() : 0);

        try {
            coordinateService.saveCoordinateBatch(message.getRouteId(), message.getCoordinates());
            log.info("Saved coordinate batch for routeId={}", message.getRouteId());
        } catch (Exception ex) {
            log.error("Failed to save coordinate batch for routeId={}: {}", message.getRouteId(), ex.getMessage());
            throw new AmqpRejectAndDontRequeueException("Coordinate batch processing failed", ex);
        }
    }
}
