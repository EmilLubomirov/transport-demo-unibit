package com.logistics.transport.dto.messaging;

import com.logistics.transport.enums.SensorEventType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SensorEventMessage {

    private Long routeId;
    private Long vehicleId;
    private SensorEventType eventType;
    private OffsetDateTime occurredAt;
    private Map<String, Object> metadata;
}
