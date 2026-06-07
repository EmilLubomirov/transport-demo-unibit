package com.logistics.transport.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class CreateTransportRequest {

    @NotBlank
    private String origin;

    @NotBlank
    private String destination;

    private OffsetDateTime plannedDeparture;
    private OffsetDateTime plannedArrival;
}
