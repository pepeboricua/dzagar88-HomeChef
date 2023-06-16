import React, { useState, useContext, useEffect } from "react";
import { useLoadScript, GoogleMap, Marker, Circle } from "@react-google-maps/api";
import homechefBG from "../../img/homechefBG.jpg";
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";
import { DinerMenuItem } from "../component/dinerMenuItem.js";

const libraries = ["places"];

export const Diner = () => {
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const handleMenuItemClick = (DinerMenuItem) => {
        setSelectedMenuItem(DinerMenuItem)
    }

    const [alignment, setAlignment] = useState('diner');
    const navigate = useNavigate();
    const handleChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    const { store, actions } = useContext(Context);

    const [searchAddress, setSearchAddress] = useState({
        street: "",
        city: "",
        state: ""
    });
    const [center, setCenter] = useState({ lat: 30.6697, lng: -81.4626 });

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [pin, setPin] = useState([]);
    const [map, setMap] = useState(null);

    const handleClick = (value) => {
        console.log(`Button ${value} clicked!`);
        if (value === "home") {
            navigate("/");
        } else if (value === "diner") {
            navigate("/diner");
        } else {
            navigate("/chef");
        }
    };

    const initMap = () => {
        const newMap = new window.google.maps.Map(document.getElementById('map'), {
            center: { lat: 0, lng: 0 },
            zoom: 10
        });

        setMap(newMap);

        getMenuItems();
    };

    const loadGoogleMapsAPI = () => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        script.onload = initMap;
    };

    const handleSearch = () => {
        const address = `${searchAddress.street}, ${searchAddress.city}, ${searchAddress.state}`;
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === "OK" && results.length > 0) {
                const location = results[0].geometry.location;
                setCenter({ lat: location.lat(), lng: location.lng() });
            } else {
                console.log("Geocode was not successful for the following reason: " + status);
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    };

    useEffect(() => {
        // Load the Google Maps JavaScript API
        loadGoogleMapsAPI();
    }, []);

    useEffect(() => {
        if (map && store.menuItemsforGoogleMaps.length > 0) {
            updateMapWithMarkers();
        }
    }, [map, store.menuItemsforGoogleMaps]);

    const updateMapWithMarkers = () => {
        const bounds = new window.google.maps.LatLngBounds()
        store.menuItemsforGoogleMaps.forEach(menuItem => {
            const position = {
                lat: menuItem.latitude,
                lng: menuItem.longitude
            };
            const marker = new window.google.maps.Marker({ position: position, map: map, title: menuItem.title });
            bounds.extend(position);
            setPin(prevPins => [...prevPins, marker]);
        });
        map.fitBounds(bounds);
    };

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div
            style={{
                backgroundImage: `url(${homechefBG})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
            }}
        >
            <div>
                <br />
                <ToggleButtonGroup
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                    aria-label="Platform"
                    className="Toggle d-flex justify-content-center"
                >
                    <ToggleButton
                        className="bg-light border"
                        value="diner"
                        onClick={() => handleClick('diner')}
                    >
                        Diner
                    </ToggleButton>
                    <ToggleButton
                        className="bg-light border"
                        value="chef"
                        onClick={() => handleClick('chef')}
                    >
                        Chef
                    </ToggleButton>
                </ToggleButtonGroup>
                <div className="container">
                    <br />
                    <h1
                        style={{ width: "85%" }}
                        className="white-title title-font opacity60 d-flex justify-content-center m-auto"
                    >
                        Diner
                    </h1>
                    <br />
                    <p
                        style={{ fontSize: "20px", width: "85%" }}
                        className="white-title lower-font opacity60 m-auto p-1 d-flex justify-content-center"
                    >
                        Here you can search for local homecooked meals...
                    </p>
                </div>
                <div className="container d-flex justify-content-center flex-wrap">
                    <div className="input-container">
                        <input
                            className="my-2 me-1"
                            type="text"
                            value={searchAddress.street}
                            onChange={(event) =>
                                setSearchAddress({ ...searchAddress, street: event.target.value })
                            }
                            placeholder="Street"
                        />
                    </div>
                    <div className="input-container">
                        <input
                            className="my-2 me-1"
                            type="text"
                            value={searchAddress.city}
                            onChange={(event) =>
                                setSearchAddress({ ...searchAddress, city: event.target.value })
                            }
                            placeholder="City"
                        />
                    </div>
                    <div className="input-container">
                        <input
                            className="my-2"
                            type="text"
                            value={searchAddress.state}
                            onChange={(event) =>
                                setSearchAddress({ ...searchAddress, state: event.target.value })
                            }
                            placeholder="State"
                        />
                    </div>
                    <div className="container d-flex justify-content-center">
                        <button
                            className="btn white-title oy-button btn m-3"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="container d-flex justify-content-center">
                    <GoogleMap zoom={10} center={center} mapContainerClassName="map-container">
                        <Marker position={center} />
                        <Circle
                            center={center}
                            radius={10 * 1609.34} // Convert 10 miles to meters
                            options={{
                                strokeColor: "#FF0000",
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                fillColor: "#FF0000",
                                fillOpacity: 0.35,
                            }}
                        />
                    </GoogleMap>
                </div>
            </div>
        </div>
    );
};