CREATE TYPE route_status AS ENUM (
    'PENDING',
    'ACTIVE',
    'COMPLETED',
    'CANCELLED'
);

CREATE TABLE routes (
    id           BIGSERIAL PRIMARY KEY,
    transport_id BIGINT          NOT NULL REFERENCES transports(id),
    driver_id    BIGINT          NOT NULL,
    vehicle_id   BIGINT          NOT NULL,
    avg_speed    NUMERIC(6, 2),
    start_point  VARCHAR(255),
    end_point    VARCHAR(255),
    distance     NUMERIC(10, 2),
    status       route_status    NOT NULL DEFAULT 'PENDING'
);
