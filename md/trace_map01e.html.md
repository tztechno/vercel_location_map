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
            height: 90vh;
            width: 100%;
        }

        #controls {
            padding: 10px;
            display: flex;
            justify-content: space-around;
        }

        button {
            padding: 10px;
            font-size: 16px;
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
        <button onclick="clear()">Stop Tracking</button>
        <button onclick="sendLocationToGAS()">Send Location</button>
        <input type="text" id="username" placeholder="Enter your name" />
    </div>



    <div id="position_view"></div>

    <script>
        var num = 0;
        var watch_id;
        var lat0 = 35.6895;
        var lon0 = 139.6917;
        var map;

        function test() {
            watch_id = navigator.geolocation.watchPosition(test2, function (e) { alert(e.message); }, { "enableHighAccuracy": true, "timeout": 20000, "maximumAge": 2000 });
        }

        function clear() {
            navigator.geolocation.clearWatch(watch_id);
        }

        function test2(position) {
            lat0 = position.coords.latitude;
            lon0 = position.coords.longitude;

            var geo_text = "緯度:" + lat0 + "\n";
            geo_text += "経度:" + lon0 + "\n";
            geo_text += "高度:" + position.coords.altitude + "\n";
            geo_text += "位置精度:" + position.coords.accuracy + "\n";
            geo_text += "高度精度:" + position.coords.altitudeAccuracy + "\n";
            geo_text += "移動方向:" + position.coords.heading + "\n";
            geo_text += "速度:" + position.coords.speed + "\n";

            var date = new Date(position.timestamp);
            geo_text += "取得時刻:" + date.toLocaleString() + "\n";
            geo_text += "取得回数:" + (++num) + "\n";

            document.getElementById('position_view').innerHTML = geo_text;

            if (!map) {
                map = L.map('map').setView([lat0, lon0], 15);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);
            } else {
                map.setView([lat0, lon0]);
            }

            L.marker([lat0, lon0]).addTo(map)
                .bindPopup("<b>HERE!</b>")
                .openPopup();
        }

        function sendLocationToGAS() {
            var time = new Date().toISOString();
            var wkt = `POINT(${lon0} ${lat0})`;
            var name = document.getElementById('username').value;  // ユーザーが入力した名前を取得

            if (!name) {
                alert('Please enter your name before sending your location.');
                return;
            }

            var data = {
                wkt: wkt,
                time: time,
                name: name  // 名前をデータに追加
            };
            console.log(data.name)
            //postdata.gs
            fetch('https://script.google.com/macros/s/AKfycbyeRoHRj0wLOvM6bYzl3leJzvxcrKrspkPTvt2PdNmXBQbYQoQ5Sf0PxwFyfZL2wejQ/exec', {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                redirect: 'follow',
                body: JSON.stringify(data)
            }).then(response => {
                console.log('Location sent successfully');
                alert('Location sent successfully');
            }).catch(error => {
                console.error('Error:', error);
                alert('Error sending location');
            });
        }


        document.addEventListener("DOMContentLoaded", function () {
            test();
        });
    </script>
</body>

</html>