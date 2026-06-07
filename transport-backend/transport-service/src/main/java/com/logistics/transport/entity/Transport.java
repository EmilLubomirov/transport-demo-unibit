package com.logistics.transport.entity;

import com.logistics.transport.enums.TransportStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "transports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String origin;

    @Column(nullable = false)
    private String destination;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(columnDefinition = "transport_status", nullable = false)
    private TransportStatus status;

    private OffsetDateTime plannedDeparture;
    private OffsetDateTime plannedArrival;
    private OffsetDateTime actualDeparture;
    private OffsetDateTime actualArrival;
    private OffsetDateTime eta;

    @OneToMany(mappedBy = "transport", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @Builder.Default
    private List<Route> routes = new ArrayList<>();

    @PrePersist
    private void prePersist() {
        if (status == null) {
            status = TransportStatus.PLANNED;
        }
    }
}
