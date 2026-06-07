CREATE TYPE transport_status AS ENUM (
    'PLANNED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);

CREATE TABLE transports (
    id                 BIGSERIAL PRIMARY KEY,
    origin             VARCHAR(255) NOT NULL,
    destination        VARCHAR(255) NOT NULL,
    status             transport_status NOT NULL DEFAULT 'PLANNED',
    planned_departure  TIMESTAMPTZ,
    planned_arrival    TIMESTAMPTZ,
    actual_departure   TIMESTAMPTZ,
    actual_arrival     TIMESTAMPTZ,
    eta                TIMESTAMPTZ
);
