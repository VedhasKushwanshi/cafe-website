import React, { useState } from 'react';
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { ExternalLink, MapPin } from 'lucide-react';
import { CAFE_LOCATION } from '../data/cafeData';

const UPES_POSITION = {
  lat: CAFE_LOCATION.lat,
  lng: CAFE_LOCATION.lng,
};

function CafeMarkerWithInfo() {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={UPES_POSITION}
        title={CAFE_LOCATION.name}
        onClick={() => setInfoOpen((prev) => !prev)}
      >
        <Pin background="#3B2416" borderColor="#C88746" glyphColor="#FFF4E6" />
      </AdvancedMarker>

      {infoOpen && marker && (
        <InfoWindow anchor={marker} onCloseClick={() => setInfoOpen(false)}>
          <div className="p-1 max-w-[220px] text-[#3B2416]">
            <p className="font-serif font-semibold text-sm leading-snug">Chai &amp; Coc Café</p>
            <p className="text-xs text-[#6F4E37] mt-0.5">
              Opposite UPES Energy Acres Gate, Bidholi, Dehradun
            </p>
            <a
              href={CAFE_LOCATION.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#C88746] hover:text-[#3B2416] mt-2"
            >
              <span>Get Directions</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export function UpesLocationMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

  if (!apiKey || apiKey === 'MY_GOOGLE_MAPS_API_KEY') {
    return (
      <div className="h-[380px] w-full rounded-2xl border border-[#E8D5BC] bg-gradient-to-br from-[#FFF4E6] via-[#E8D5BC]/50 to-[#FFFDF9] p-6 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-full bg-[#3B2416] text-[#FFF4E6] flex items-center justify-center mb-4 shadow-md">
          <MapPin className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-xl font-semibold text-[#3B2416]">{CAFE_LOCATION.name}</h3>
        <p className="text-sm text-[#6F4E37] mt-1.5 max-w-md">{CAFE_LOCATION.fullAddress}</p>
        <p className="font-mono text-xs text-[#6F4E37] mt-2 tabular-nums">
          {CAFE_LOCATION.lat.toFixed(4)}° N, {CAFE_LOCATION.lng.toFixed(4)}° E
        </p>
        <a
          href={CAFE_LOCATION.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-sm font-semibold hover:bg-[#C88746] transition-colors"
        >
          <span>Open in Google Maps</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="h-[380px] w-full rounded-2xl overflow-hidden border border-[#E8D5BC] shadow-sm bg-[#FFF4E6]">
      <APIProvider apiKey={apiKey} libraries={['marker']} language="en" region="IN">
        <GoogleMap
          mapId="DEMO_MAP_ID"
          defaultCenter={UPES_POSITION}
          defaultZoom={16}
          gestureHandling="cooperative"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          className="w-full h-full"
        >
          <CafeMarkerWithInfo />
        </GoogleMap>
      </APIProvider>
    </div>
  );
}
