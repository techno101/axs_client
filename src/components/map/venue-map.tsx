"use client";

import { useEffect, useRef } from "react";

const VENUE_LAT = 3.1390;
const VENUE_LNG = 101.6869;
const DEFAULT_ZOOM = 16;

export function VenueMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [VENUE_LAT, VENUE_LNG],
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: !window.matchMedia("(max-width: 720px)").matches,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const markerIcon = L.divIcon({
        className: "venue-map__marker",
        html: '<span>AXS</span>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker([VENUE_LAT, VENUE_LNG], { icon: markerIcon }).addTo(map);
      mapRef.current = map;
    }

    init();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        (mapRef.current as { remove(): void }).remove();
      }
    };
  }, []);

  return <div ref={containerRef} className="venue-map" aria-label="ArmourXSports venue location map" role="img" />;
}
