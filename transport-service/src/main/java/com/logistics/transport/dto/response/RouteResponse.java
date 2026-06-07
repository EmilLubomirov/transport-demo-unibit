package com.logistics.transport.dto.response;

import com.logistics.transport.enums.RouteStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class RouteResponse {

    private Long id;
    private Long transportId;
    private Long driverId;
    private Long vehicleId;
    private BigDecimal avgSpeed;
    private String startPoint;
    private String endPoint;
    private BigDecimal distance;
    private RouteStatus status;
}
