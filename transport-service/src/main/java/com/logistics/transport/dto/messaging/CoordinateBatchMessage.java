package com.logistics.transport.dto.messaging;

import com.logistics.transport.dto.TelematicData;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoordinateBatchMessage {

    private Long routeId;
    private List<CoordinateEntry> coordinates;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CoordinateEntry {
        private OffsetDateTime recordedAt;
        private TelematicData data;
    }
}
