import { useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Polyline,
  Marker,
} from "@react-google-maps/api";
import { useEffect } from "react";

const GoogleMapPolyline = () => {
  const [path, setPath] = useState([]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
  });

  useEffect(() => {
    const localData = localStorage.getItem("googleMapPolyline");
    if (localData) {
      const parsedData = JSON.parse(localData);
      setPath(parsedData);
    }
  }, []);

  const addPointToPath = (e) => {
    try {
      const latLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      const mergedData = [...path, latLng];
      setPath(mergedData);
      localStorage.setItem("googleMapPolyline", JSON.stringify(mergedData));
    } catch (error) {
      console.error("addPointToPath error", error);
    }
  };

  const removeItem = (index) => {
    const arr = [...path];
    arr.splice(index, 1);
    setPath(arr);
    localStorage.setItem("googleMapPolyline", JSON.stringify(arr));
  };

  return isLoaded ? (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center", // Изменяем выравнивание на центр
          width: 1200,
        }}
      >
        <div style={{ width: "50%" }}>
          <GoogleMap
            onClick={addPointToPath}
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={{ lat: 51.7147, lng: 94.4534 }} // Координаты Кызыла
            zoom={11}
          >
            {path.map((item, i) => (
              <Marker key={i} position={item} onClick={() => removeItem(i)} />
            ))}
          </GoogleMap>
        </div>
        <div style={{ width: "39%" }}>
          {path.map((item, i) => (
            <p key={i}>
              <button onClick={() => removeItem(i)}>X</button>{" "}
              {JSON.stringify(item)}
            </p>
          ))}
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default GoogleMapPolyline;
