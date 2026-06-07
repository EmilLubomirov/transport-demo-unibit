package com.logistics.transport.dto.request;

import com.logistics.transport.enums.TransportStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateTransportStatusRequest {

    @NotNull
    private TransportStatus status;
}
