<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Map with Geolocation</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <style>
        body,
        html {
            height: 100%;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
        }

        #map {
            flex-grow: 1;
            width: 100%;
        }

        #controls {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 1000;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 5px;
            border-radius: 5px;
        }

        button {
            padding: 5px 10px;
            font-size: 14px;
            margin: 2px;
        }

        #position_view {
            position: absolute;
            bottom: 10px;
            left: 10px;
            z-index: 1000;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 5px;
            border-radius: 5px;
            font-size: 12px;
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        #loadingMessage {
            display: none;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2000;
            background-color: rgba(255, 255, 0, 0.8);
            padding: 10px;
            border-radius: 5px;
        }
    </style>

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@IshiiStpete" />
    <meta name="twitter:title" content="I'M HERE! HELP!">
    <meta name="twitter:image" content="https://raw.githubusercontent.com/tztechno/vercel_map/main/here.png">
</head>

<body>
    <div id="map"></div>
    <div id="controls">
        <button onclick="stopTracking()" aria-label="Stop tracking location">Stop Tracking</button>
        <button onclick="summarize()" aria-label="Summarize location data">Summarize</button>
        <button onclick="getPoints()" aria-label="Get all location points">Get Points</button>
    </div>
    <div id="loadingMessage">処理中...</div>
    <div id="position_view"></div>

    <script>
        var num = 0;
        var watch_id;
        var lat0 = 35.6895;
        var lon0 = 139.6917;
        var map;
        var currentMarker;
        //summarize.gs
        var webAppUrl1 = 'https://script.google.com/macros/s/AKfycbzFFeGvIhh9q85dHWTQXkAXbPNRbjJXX4wTqMJr72YLX228mXaruFL9P3oVSkGB1K5b/exec';
        //getdata.gs
        var webAppUrl2 = 'https://script.google.com/macros/s/AKfycbyfnJ80Bn0oN68e2ey_25gnllyS0_Ep2hAmfRHPg9sFNQlCMyGGi_igvTiJFjrXuCi1/exec';

        function startTracking() {
            watch_id = navigator.geolocation.watchPosition(
                updatePosition,
                handleLocationError,
                { "enableHighAccuracy": true, "timeout": 20000, "maximumAge": 5000 }
            );
        }

        function stopTracking() {
            if (watch_id) {
                navigator.geolocation.clearWatch(watch_id);
                watch_id = null;
            }
        }

        function handleLocationError(error) {
            let errorMessage;
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = "位置情報の利用が許可されていません。";
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = "位置情報が取得できません。";
                    break;
                case error.TIMEOUT:
                    errorMessage = "位置情報の取得がタイムアウトしました。";
                    break;
                default:
                    errorMessage = "位置情報の取得中にエラーが発生しました。";
            }
            alert(errorMessage);
        }

        function updatePosition(position) {
            lat0 = position.coords.latitude;
            lon0 = position.coords.longitude;

            var geo_text = `緯度: ${lat0.toFixed(6)}, 経度: ${lon0.toFixed(6)}`;

            document.getElementById('position_view').innerText = geo_text;

            if (!map) {
                map = L.map('map').setView([lat0, lon0], 15);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);
            } else {
                map.setView([lat0, lon0]);
            }

            if (currentMarker) {
                map.removeLayer(currentMarker);
            }
            currentMarker = L.marker([lat0, lon0]).addTo(map)
                .bindPopup("<b>HERE!</b>")
                .openPopup();
        }

        function summarize() {
            document.getElementById('loadingMessage').style.display = 'block';

            fetch(webAppUrl1)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(message => {
                    document.getElementById('loadingMessage').style.display = 'none';
                    alert(message);
                })
                .catch(error => {
                    document.getElementById('loadingMessage').style.display = 'none';
                    console.error('Error:', error);
                    alert('エラーが発生しました。後ほど再試行してください。');
                });
        }

        function getPoints() {
            document.getElementById('loadingMessage').style.display = 'block';

            fetch(webAppUrl2)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Received data:", data);

                    const geojsonLayer = L.geoJSON(data, {
                        onEachFeature: function (feature, layer) {
                            if (feature.properties && feature.properties.name) {
                                layer.bindPopup(feature.properties.name);
                            }
                        }
                    }).addTo(map);

                    map.fitBounds(geojsonLayer.getBounds());
                    document.getElementById('loadingMessage').style.display = 'none';
                })
                .catch(error => {
                    console.error('Error fetching the data:', error);
                    document.getElementById('loadingMessage').style.display = 'none';
                    alert('データの取得中にエラーが発生しました。後ほど再試行してください。');
                });
        }

        document.addEventListener("DOMContentLoaded", function () {
            startTracking();
        });
    </script>
</body>

</html>
