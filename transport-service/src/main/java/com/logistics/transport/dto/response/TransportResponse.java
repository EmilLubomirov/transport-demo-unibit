package com.logistics.transport.dto.response;

import com.logistics.transport.enums.TransportStatus;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
public class TransportResponse {

    private Long id;
    private String origin;
    private String destination;
    private TransportStatus status;
    private OffsetDateTime plannedDeparture;
    private OffsetDateTime plannedArrival;
    private OffsetDateTime actualDeparture;
    private OffsetDateTime actualArrival;
    private OffsetDateTime eta;
    private List<Long> routeIds;
}
