import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../hooks/users";

const MapScreen = () => {
  const Params = useLocalSearchParams();
  const dispatch=useDispatch()
  const { currentLocal } = useSelector((state) => state.Localization);
  const locationInfo = useSelector((state) => state.location);
  const { list: users, loading: usersLoading, pagination } = useSelector((state) => state?.users);

  
useEffect(() => {
    const fetchData = () => {
  
      const data = {
        country: locationInfo?.country_en,

      }
  
      if (locationInfo?.country_en) {
        dispatch(fetchUsers(data))
      }
    }
    fetchData()
}, [])
  const router = useRouter();
  const webViewRef = useRef(null);

  const defaultLat = locationInfo?.latitude || 30.0444; // fallback Cairo
  const defaultLng = locationInfo?.longitude || 31.2357;

  const initialLat = Params?.initialLat ? parseFloat(Params.initialLat) : defaultLat;
  const initialLng = Params?.initialLng ? parseFloat(Params.initialLng) : defaultLng;

  const showDetailsText = currentLocal?.home?.showDetails || "عرض التفاصيل";

const allMarkers = (users || [])
  .filter((item) => item.lat && item.long)
  .map((item) => ({
    id: item.id,
    name: item.name || item.first_name + " " + item.last_name,
    type:
      item.role === "shop-owner"
        ? currentLocal.home.shopOwner
        : currentLocal.home.craftsman,
    latitude: parseFloat(item.lat),
    longitude: parseFloat(item.long),
  }));

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }
    button {
      padding: 5px 10px;
      margin-top: 5px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  </style>
  </head>
  <body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const markersData = ${JSON.stringify(allMarkers)};

    const map = L.map('map').setView([${initialLat}, ${initialLng}], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // User Marker
    L.marker([${initialLat}, ${initialLng}])
      .addTo(map)
      .bindPopup("📍 موقعك الحالي");

    // Other Markers
    markersData.forEach(item => {
      if(item.latitude && item.longitude){
        const marker = L.marker([item.latitude, item.longitude]).addTo(map);
        marker.bindPopup(\`
          <div style="width:180px">
            <h4>\${item.name}</h4>
            <p>\${item.type}</p>
            <button onclick="openProduct('\${item.id}')">
              ${showDetailsText}
            </button>
          </div>
        \`);
      }
    });

    function openProduct(id){
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "navigate", id }));
    }
  </script>
  </body>
  </html>
  `;

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data?.type === "navigate") {
        console.log(data,"markerData");
        console.log(allMarkers,"markerData");
        
const markerData = users.find((u) => u?.id == data?.id);
        console.log(markerData,"markerData");
        
        router.push({
          pathname: "/(routes)/UserDetails",
          params: { marker: JSON.stringify(markerData) },
        });
      }
    } catch (e) {
      console.warn("Invalid message from WebView:", e);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: htmlContent, baseUrl: "https://localhost" }}
        style={styles.map}
        javaScriptEnabled
        domStorageEnabled
        onMessage={handleMessage}
      />
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
