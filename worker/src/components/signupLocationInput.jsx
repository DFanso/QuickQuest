'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons';

const LocationPicker = ({ onLocationSelect }) => {
    const [showMap, setShowMap] = useState(false);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        if (showMap) {
            if (window.google && window.google.maps && window.google.maps.places) {
                initializeMap();
                initializeAutocomplete();
            } else {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAP_API_KEY}&libraries=places`;
                script.async = true;
                document.body.appendChild(script);
                script.onload = () => {
                    initializeMap();
                    initializeAutocomplete();
                };
            }
        }
    }, [showMap]);

    const initializeMap = () => {
        const initialPosition = { lat: 0, lng: 0 };
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
            center: initialPosition,
            zoom: 2,
        });

        markerRef.current = new window.google.maps.Marker({
            position: initialPosition,
            map: mapInstanceRef.current,
            draggable: true,
        });

        markerRef.current.addListener('dragend', handleMarkerDrag);
    };

    const initializeAutocomplete = () => {
        const input = document.getElementById('location');
        const autocomplete = new window.google.maps.places.Autocomplete(input);

        if (mapInstanceRef.current) {
            autocomplete.bindTo('bounds', mapInstanceRef.current);
        }

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry || !place.geometry.location) {
                console.log("Returned place contains no geometry");
                return;
            }
            const location = place.geometry.location;

            if (mapInstanceRef.current) {
                mapInstanceRef.current.setCenter(location);
                mapInstanceRef.current.setZoom(15);
            }

            if (markerRef.current) {
                markerRef.current.setPosition(location);
            }
        });
    };

    const handleIconClick = () => {
        setShowMap(!showMap);
    };

    const handleMarkerDrag = () => {
        const latLng = markerRef.current.getPosition();
        if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter(latLng);
        }
    };

    const confirmLocation = () => {
        const latLng = markerRef.current.getPosition();
        onLocationSelect({ lat: latLng.lat(), lng: latLng.lng() });
        setShowMap(false);
    };

    return (
        <div className="flex flex-col mb-4">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <div className="relative mt-1">
                <input
                    type="text"
                    id="location"
                    placeholder="Enter Location or Locate me"
                    className={`block w-full border border-green-800 pl-3 pr-12 py-1 ${showMap ? "rounded-tl-md rounded-tr-md" : "rounded-md"} shadow-sm focus:outline-none focus:border`}
                />
                <div className={`absolute inset-y-0 right-0 flex items-center bg-teal-500 rounded-r-md ${showMap ? "rounded-br-none" : "rounded-r-md"}`}>
                    <FontAwesomeIcon icon={faCrosshairs} className="w-5 h-5 text-white mx-3" onClick={handleIconClick} />
                </div>
            </div>
            {showMap && (
                <div className="map-container" style={{ display: 'block', height: '300px', width: '100%' }} ref={mapRef}></div>
            )}
            {showMap && (
                <button
                    onClick={confirmLocation}
                    className="mt-0 bg-teal-500 text-white py-1 border border-green-800 w-full"
                >
                    Confirm & Continue
                </button>
            )}
        </div>
    );
};

export default LocationPicker;