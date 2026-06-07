package com.logistics.transport.messaging;

import com.logistics.transport.config.RabbitMQConfig;
import com.logistics.transport.dto.messaging.SensorEventMessage;
import com.logistics.transport.enums.RouteStatus;
import com.logistics.transport.service.RouteService;
import com.logistics.transport.service.TransportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SensorStateListener {

    private final RouteService routeService;
    private final TransportService transportService;

    @RabbitListener(queues = RabbitMQConfig.SENSORS_QUEUE)
    public void handleSensorEvent(SensorEventMessage event) {
        log.info("Sensor event: type={}, routeId={}, vehicleId={}, at={}",
                event.getEventType(), event.getRouteId(),
                event.getVehicleId(), event.getOccurredAt());

        switch (event.getEventType()) {
            case ENGINE_ON    -> handleEngineOn(event);
            case ENGINE_OFF   -> handleEngineOff(event);
            case DOOR_OPEN    -> handleDoorOpen(event);
            case DOOR_CLOSE   -> handleDoorClose(event);
            case GEOFENCE_ENTER -> handleGeofenceEnter(event);
            case GEOFENCE_EXIT  -> handleGeofenceExit(event);
        }
    }

    private void handleEngineOn(SensorEventMessage event) {
        log.info("ENGINE_ON → route {} set to ACTIVE (departure detected)", event.getRouteId());
        routeService.updateRouteStatus(event.getRouteId(), RouteStatus.ACTIVE);
    }

    private void handleEngineOff(SensorEventMessage event) {
        log.info("ENGINE_OFF → vehicle stopped for route {}", event.getRouteId());
    }

    private void handleDoorOpen(SensorEventMessage event) {
        log.info("DOOR_OPEN → cargo door opened for route {} (loading/unloading)", event.getRouteId());
    }

    private void handleDoorClose(SensorEventMessage event) {
        log.info("DOOR_CLOSE → cargo door closed for route {}", event.getRouteId());
    }

    private void handleGeofenceEnter(SensorEventMessage event) {
        log.info("GEOFENCE_ENTER → vehicle arrived at destination for route {} → set COMPLETED",
                event.getRouteId());
        routeService.updateRouteStatus(event.getRouteId(), RouteStatus.COMPLETED);
    }

    private void handleGeofenceExit(SensorEventMessage event) {
        log.info("GEOFENCE_EXIT → vehicle left geofence area for route {}", event.getRouteId());
    }
}
