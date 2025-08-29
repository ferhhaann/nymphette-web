import React, { useEffect, useRef, useState } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';

interface Props { regionKey: string; compact?: boolean }

const MapWidget: React.FC<Props> = ({ regionKey, compact }) => {
  const container = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('mapbox_public_token') || ""
    }
    return ""
  });

  useEffect(() => {
    if (!token || !container.current) return;
    let map: any;
    (async () => {
      const mapboxgl = (await import('mapbox-gl')).default;
      mapboxgl.accessToken = token;
      map = new mapboxgl.Map({
        container: container.current!,
        style: 'mapbox://styles/mapbox/light-v11',
        zoom: 1.8,
        center: [10, 50],
        projection: 'globe',
      });
      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');
    })();
    return () => { if (map) map.remove(); };
  }, [token]);

  if (!token) {
    return (
      <div className="border rounded p-3 text-sm">
        <div className="mb-2 font-medium">Map preview</div>
        <p className="text-muted-foreground mb-2">Add a Mapbox public token to enable the interactive map.</p>
        <div className="flex gap-2">
          <input className="flex-1 border rounded px-2 py-1 text-sm bg-background" placeholder="Mapbox public token" onChange={(e)=>setToken(e.target.value)} />
          <button 
            className="text-sm px-3 py-1 rounded border" 
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.setItem('mapbox_public_token', token);
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={compact?"h-48 rounded overflow-hidden border":"h-80 rounded overflow-hidden border"}>
      <div ref={container} className="w-full h-full"/>
    </div>
  );
};

export default MapWidget;
