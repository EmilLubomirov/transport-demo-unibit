package com.logistics.transport.entity;

import com.logistics.transport.dto.TelematicData;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

import java.time.OffsetDateTime;

@Entity
@Table(name = "routes_coordinates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RouteCoordinate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Route route;

    @Column(nullable = false)
    private OffsetDateTime recordedAt;

    @Column(nullable = false)
    private OffsetDateTime serverTime;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb", nullable = false)
    private TelematicData telematicData;

    @PrePersist
    private void prePersist() {
        if (serverTime == null) {
            serverTime = OffsetDateTime.now();
        }
    }
}
