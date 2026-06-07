package com.logistics.transport.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateRouteRequest {

    @NotNull
    private Long transportId;

    @NotNull
    private Long driverId;

    @NotNull
    private Long vehicleId;

    private String startPoint;
    private String endPoint;
    private BigDecimal distance;
}
