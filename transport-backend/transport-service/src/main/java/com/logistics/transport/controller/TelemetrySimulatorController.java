package com.logistics.transport.controller;

import com.logistics.transport.config.RabbitMQConfig;
import com.logistics.transport.dto.messaging.CoordinateBatchMessage;
import com.logistics.transport.dto.messaging.SensorEventMessage;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/simulator")
@RequiredArgsConstructor
@Tag(name = "Telemetry Simulator", description = "Simulates telemetry-service for demo purposes")
public class TelemetrySimulatorController {

    private final RabbitTemplate rabbitTemplate;

    @PostMapping("/coordinates")
    @Operation(summary = "Publish a GPS coordinate batch (simulates telemetry-service)")
    public ResponseEntity<String> publishCoordinateBatch(@RequestBody CoordinateBatchMessage message) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.TELEMETRY_EXCHANGE,
                "telemetry.coordinates.route",
                message);

        int count = message.getCoordinates() != null ? message.getCoordinates().size() : 0;
        return ResponseEntity.ok("Published " + count + " coordinates for routeId=" + message.getRouteId());
    }

    @PostMapping("/sensor-event")
    @Operation(summary = "Publish a sensor event (simulates telemetry-service)")
    public ResponseEntity<String> publishSensorEvent(@RequestBody SensorEventMessage event) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.TELEMETRY_EXCHANGE,
                "telemetry.sensors.vehicle",
                event);

        return ResponseEntity.ok("Published sensor event: " + event.getEventType()
                + " for routeId=" + event.getRouteId());
    }
}
