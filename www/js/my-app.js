// Initialize your app
var myApp = new Framework7(
    {
        //swipePanel: 'both',
        // App root element
        root: '#app',
        // App id
        id: 'io.cordova.iWasHere',
        // App name
        name: 'iWasHere',

        // ... other parameters
        view: {
        reloadPages:true,
        },
    }
    );
// Export selectors engine
var $$ = Dom7;

// Add views
var view1 = myApp.addView('#view-1');
var view2 = myApp.addView('#view-2', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});
var view3 = myApp.addView('#view-3');
var view4 = myApp.addView('#view-4');
var view4 = myApp.addView('#view-5');
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);   
}
function onDeviceReady() {
    var elementb = document.getElementById('golocations');
    DBMeter.start(function (dB) {
        if (dB <= 5) {
            elementb.innerHTML = " #veryQueit";
        }
        if (dB >5 && dB <=60) {
            elementb.innerHTML = " #notasloudhere";
        }if (dB > 70) {
            elementb.innerHTML = " #quietloud";
        }
    },
    function (e) {
        console.log('code: ' + e.code + ', message: ' + e.message);
    });
    map();
    window.plugin.lightsensor.getReading(
    function success(reading) {
        console.log(JSON.stringify(reading));
    },
    function error(message) {
        console.log(message);
    }
    )
}
function camera() {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        cameraDirection: Camera.Direction.FRONT,
        correctOrientation: true,
    });
    function onSuccess(imageData) {
        view4.router.refreshPage();
        var image = document.getElementById('imageFile');
        image.src = "data:image/jpeg;base64," + imageData;
        var onSuccess = function (position) {
            window.plugin.lightsensor.getReading(
    function success(reading) {
        var ts = new Date();
        var elementb = document.getElementById('golocationdate');
        elementb.innerHTML = ts.toDateString();
        var element = document.getElementById('golocation');
        element.innerHTML =
            document.getElementById("golocationmap").innerHTML + '<br>' +
               JSON.stringify(reading).replace(/\"/g, "").replace(/:/g, "").replace(/[{}]/g, '').replace(/ *, */g, '<br>') + '<br>' +
              //'Latitude: ' + position.coords.latitude + '\n' +
              //'Longitude: ' + position.coords.longitude + '\n' +
              //'Altitude: ' + position.coords.altitude + '\n' +
              //'Accuracy: ' + position.coords.accuracy + '\n' +
              //'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
              //'Heading: ' + position.coords.heading + '\n' +
              //'Speed: ' + position.coords.speed + '\n' +
              '<hr />' + element.innerHTML;
    },
    function error(message) {
        console.log(message);
    }
    )
        };

        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: ' + error.code + '\n' +
                  'message: ' + error.message + '\n');
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}
function upload() {
    document.getElementById("file-input").onchange = function (e) {
        var file = e.target.files[0]
        if (file && file.name) {
            EXIF.getData(file, function () {
                var exifData = EXIF.pretty(this);
                if (exifData) {
                    alert(exifData);
                } else {
                    alert("No EXIF data found in image '" + file.name + "'.");
                }
            });
        }
    }
}
function info() {
    var onSuccess = function (position) {
        window.plugin.lightsensor.getReading(
function success(reading) {
    var ts = new Date();
    var elementb = document.getElementById('golocationdate');
    elementb.innerHTML = ts.toDateString();
    var element = document.getElementById('golocation');
    element.innerHTML =
        document.getElementById("golocationmap").innerHTML + '<br>' + 
           JSON.stringify(reading).replace(/\"/g, "").replace(/:/g, "").replace(/[{}]/g, '').replace(/ *, */g, '<br>') + '<br>' +
          //'Latitude: ' + position.coords.latitude + '\n' +
          //'Longitude: ' + position.coords.longitude + '\n' +
          //'Altitude: ' + position.coords.altitude + '\n' +
          //'Accuracy: ' + position.coords.accuracy + '\n' +
          //'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
          //'Heading: ' + position.coords.heading + '\n' +
          //'Speed: ' + position.coords.speed + '\n' +
          '<hr />' + element.innerHTML;
},
function error(message) {
    console.log(message);
}
)
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: ' + error.code + '\n' +
              'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}
var Latitude = undefined;
var Longitude = undefined;
// Get geo coordinates
function map() {
    navigator.geolocation.getCurrentPosition
    (onMapSuccess, onMapError, { enableHighAccuracy: true });
}

// Success callback for get geo coordinates

var onMapSuccess = function (position) {

    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;

    getMap(Latitude, Longitude);

    nativegeocoder.reverseGeocode(success, failure, Latitude, Longitude, { useLocale: true, maxResults: 1 });
    function success(result) {
        var element = document.getElementById('golocationmap');
        element.innerHTML = JSON.stringify(result[0]).replace(/:/g, "").replace(/\"/g, "").replace(/[{}]/g, '').replace(/ *, */g, ' ') + document.getElementById('golocations').innerHTML;
    }
    function failure(err) {
        alert(JSON.stringify(err));
    }

}

// Get map by using coordinates

function getMap(latitude, longitude) {

    var mapOptions = {
        center: new google.maps.LatLng(0, 0),
        zoom: 1,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map
    (document.getElementById("map"), mapOptions);


    var latLong = new google.maps.LatLng(latitude, longitude);

    var marker = new google.maps.Marker({
        position: latLong
    });

    marker.setMap(map);
    map.setZoom(15);
    map.setCenter(marker.getPosition());
}
// Watch your changing position

function watchMapPosition() {

    return navigator.geolocation.watchPosition
    (onMapWatchSuccess, onMapError, { enableHighAccuracy: true, timeout: 30000 });
}
// Success callback for watching your changing position

var onMapWatchSuccess = function (position) {

    var updatedLatitude = position.coords.latitude;
    var updatedLongitude = position.coords.longitude;

    if (updatedLatitude != Latitude && updatedLongitude != Longitude) {

        Latitude = updatedLatitude;
        Longitude = updatedLongitude;

        getMap(updatedLatitude, updatedLongitude);
    }
}
function getMap(updatedLatitude, updatedLongitude) {

    var mapOptions = {
        center: new google.maps.LatLng(0, 0),
        zoom: 1,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map
    (document.getElementById("map"), mapOptions);


    var latLong = new google.maps.LatLng(updatedLatitude, updatedLongitude);

    var marker = new google.maps.Marker({
        position: latLong
    });

    marker.setMap(map);
    map.setZoom(15);
    map.setCenter(marker.getPosition());
}

// Error callback

function onMapError(error) {
    console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}
