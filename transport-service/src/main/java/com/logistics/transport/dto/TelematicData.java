package com.logistics.transport.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TelematicData {

    private Double lat;
    private Double lon;
    private Double speed;
    private Double temperature;
    private Boolean doorOpen;
    private Boolean engineOn;
}
