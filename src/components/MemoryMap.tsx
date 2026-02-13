import {
  CircleMarker,
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { Memory } from "@/data/memories";
import { useEffect, useState } from "react";
import L, { type LatLngExpression, type LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

type MemoryMapProps = {
  memories: Memory[];
  activeMemoryId: string | null;
  onActiveMemoryChange: (id: string) => void;
  onMemoryOpen: (id: string) => void;
  isPickingLocation: boolean;
  onTogglePickingLocation: () => void;
  onLocationPicked: (lat: number, lng: number) => void;
};

const NEW_DELHI: LatLngExpression = [28.6139, 77.209];

function MapController({
  activeMemory,
}: {
  activeMemory: Memory | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!activeMemory) return;
    const nextCenter: LatLngExpression = [
      activeMemory.latitude,
      activeMemory.longitude,
    ];

    map.flyTo(nextCenter, 13, {
      duration: 1.4,
    });
  }, [activeMemory, map]);

  return null;
}

function LocationPicker({
  enabled,
  onPick,
}: {
  enabled: boolean;
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(event: LeafletMouseEvent) {
      if (!enabled) return;
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

function UserLocationController({
  userLocation,
}: {
  userLocation: LatLngExpression | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!userLocation) return;

    map.flyTo(userLocation, 13, {
      duration: 1.2,
    });
  }, [userLocation, map]);

  return null;
}

function createPinIcon(active: boolean) {
  const color = active ? "#22c55e" : "#f97316";
  const border = active ? "#22c55e" : "#ea580c";

  return L.divIcon({
    className: "",
    iconSize: [30, 40],
    iconAnchor: [15, 38],
    html: `
      <div style="
        position: relative;
        width: 20px;
        height: 20px;
        margin: 0 auto;
        border-radius: 999px;
        background: ${color};
        box-shadow: 0 0 0 3px ${border}33, 0 10px 20px rgba(0,0,0,0.35);
      ">
        <div style="
          position: absolute;
          left: 50%;
          top: 100%;
          width: 0;
          height: 0;
          margin-left: -5px;
          border-width: 6px 5px 0 5px;
          border-style: solid;
          border-color: ${color} transparent transparent transparent;
        "></div>
      </div>
    `,
  });
}

export default function MemoryMap({
  memories,
  activeMemoryId,
  onActiveMemoryChange,
  onMemoryOpen,
  isPickingLocation,
  onTogglePickingLocation,
  onLocationPicked,
}: MemoryMapProps) {
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(
    null,
  );
  const [mapCenter, setMapCenter] =
    useState<LatLngExpression>(NEW_DELHI);

  const activeMemory =
    memories.find((m) => m.id === activeMemoryId) ?? memories[0] ?? null;

  useEffect(() => {
    if (!navigator.geolocation) {
      setMapCenter(NEW_DELHI);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: LatLngExpression = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setUserLocation(coords);
        setMapCenter(coords);
      },
      () => {
        setMapCenter(NEW_DELHI);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30_000,
        timeout: 10_000,
      },
    );
  }, []);

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: LatLngExpression = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setUserLocation(coords);
        setMapCenter(coords);
      },
      () => {
        // Silent failure – in a real app you might surface an inline toast.
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30_000,
        timeout: 10_000,
      },
    );
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={mapCenter as [number, number]}
        zoom={4}
        minZoom={2}
        className="h-full w-full z-0"
        zoomControl={false}
        worldCopyJump
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {memories.map((memory) => {
          const isActive = memory.id === activeMemory?.id;
          return (
            <Marker
              key={memory.id}
              position={[memory.latitude, memory.longitude]}
              icon={createPinIcon(isActive)}
              eventHandlers={{
                click: () => {
                  onActiveMemoryChange(memory.id);
                  onMemoryOpen(memory.id);
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -4]} opacity={0.9}>
                <div className="text-xs font-medium">
                  <p className="mb-0.5">{memory.title}</p>
                  <p className="text-[0.65rem] text-zinc-300">
                    {new Date(memory.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </p>
                </div>
              </Tooltip>
            </Marker>
          );
        })}

        {userLocation && (
          <CircleMarker
            center={userLocation}
            radius={6}
            pathOptions={{
              color: "#3b82f6",
              weight: 2,
              fillColor: "#3b82f6",
              fillOpacity: 0.8,
            }}
          >
            <Tooltip direction="top" offset={[0, -4]} opacity={0.9}>
              <span className="text-xs font-medium">You are here</span>
            </Tooltip>
          </CircleMarker>
        )}

        <MapController activeMemory={activeMemory} />
        <LocationPicker
          enabled={isPickingLocation}
          onPick={onLocationPicked}
        />
        <UserLocationController userLocation={userLocation} />
      </MapContainer>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-between px-3 pb-3">
        <button
          type="button"
          onClick={onTogglePickingLocation}
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-zinc-950/90 px-3 py-1.5 text-xs font-medium text-zinc-50 shadow-lg shadow-black/40 backdrop-blur hover:bg-zinc-900 active:scale-[0.98] dark:bg-zinc-50/95 dark:text-zinc-900 dark:hover:bg-zinc-100"
        >
          <span
            className={`inline-block h-2 w-2 rounded-full ${isPickingLocation ? "bg-emerald-400" : "bg-zinc-400"}`}
          />
          {isPickingLocation ? "Tap map to pin" : "Add memory"}
        </button>

        <button
          type="button"
          onClick={handleLocateMe}
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-zinc-950/90 px-3 py-1.5 text-xs font-medium text-zinc-50 shadow-lg shadow-black/40 backdrop-blur hover:bg-zinc-900 active:scale-[0.98] dark:bg-zinc-50/95 dark:text-zinc-900 dark:hover:bg-zinc-100"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
          Near me
        </button>
      </div>
    </div>
  );
}

