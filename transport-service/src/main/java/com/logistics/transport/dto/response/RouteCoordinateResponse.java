package com.logistics.transport.dto.response;

import com.logistics.transport.dto.TelematicData;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
public class RouteCoordinateResponse {

    private Long id;
    private Long routeId;
    private OffsetDateTime recordedAt;
    private OffsetDateTime serverTime;
    private TelematicData telematicData;
}
