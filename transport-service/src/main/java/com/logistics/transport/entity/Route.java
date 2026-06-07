package com.logistics.transport.entity;

import com.logistics.transport.enums.RouteStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import java.math.BigDecimal;

@Entity
@Table(name = "routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transport_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Transport transport;

    @Column(nullable = false)
    private Long driverId;

    @Column(nullable = false)
    private Long vehicleId;

    private BigDecimal avgSpeed;
    private String startPoint;
    private String endPoint;
    private BigDecimal distance;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(columnDefinition = "route_status", nullable = false)
    private RouteStatus status;

    @PrePersist
    private void prePersist() {
        if (status == null) {
            status = RouteStatus.PENDING;
        }
    }
}
