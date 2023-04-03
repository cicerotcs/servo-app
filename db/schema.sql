CREATE DATABASE petrol_map;

CREATE TABLE petrol_station (
    id serial PRIMARY KEY,
    object_id integer,
    feature_type text,
    description text,
    class text,
    fid integer,
    name text,
    operational_status text,
    owner text,
    industry_id text,
    address text,
    suburb text,
    state text,
    spatial_confidence integer,
    revised date,
    comment text,
    latitude numeric(15,12),
    longitude numeric(15,12)
);