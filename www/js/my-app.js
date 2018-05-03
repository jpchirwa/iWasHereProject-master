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
function onLoad(){
    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("backbutton", onBackKeyDown, false);
    window.addEventListener("compassneedscalibration", function (event) {
        // ask user to wave device in a figure-eight motion  
        event.preventDefault();
    }, true);
    function onBackKeyDown(e) {
        e.preventDefault();
        alert('Exiting iWasHere ?');
    }
}
function onDeviceReady() {
    map();
    //info();
    //watchMapPosition();
    window.plugin.lightsensor.getReading(
function success(reading) {
    console.log(JSON.stringify(reading));
    //alert(JSON.stringify(reading));
    // Output: {"intensity": 25}
},
function error(message) {
    console.log(message);
}
)
    console.log("ALL SET");
    console.log(navigator.camera);
    DBMeter.start(function (dB) {
        console.log(dB);
    });
}
function login() {
    var fbLoginSuccess = function (userData) {
        console.log("UserInfo: ", userData);
        myApp.closeModal('.login-screen.modal-in')
        map();
    }

    facebookConnectPlugin.login(["public_profile"], fbLoginSuccess,
      function loginError(error) {
          alert(error);
      }
    );
}
function camera() {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        //allowEdit: true,
        cameraDirection: Camera.Direction.BACK,
        correctOrientation: true  //Corrects Android orientation quirks
    });
    function onSuccess(imageData) {
        var image = document.getElementById('imageFile');
        image.style.display = 'block';
        image.src = "data:image/jpeg;base64," + imageData;
        DBMeter.start(function (dB) {
            alert(dB);
        }, function (e) {
            alert('code: ' + e.code + ', message: ' + e.message);
        });
        DBMeter.stop(function () {
            console.log("DBMeter well stopped");
        }, function (e) {
            console.log('code: ' + e.code + ', message: ' + e.message);
        });
        DBMeter.delete(function () {
            console.log("Well done !");
        }, function (e) {
            console.log('code: ' + e.code + ', message: ' + e.message);
        });
        window.plugin.lightsensor.getReading(
function success(reading) {
    console.log(JSON.stringify(reading));
    alert(JSON.stringify(reading));
},
function error(message) {
    console.log(message);
}
)
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
    // onSuccess Callback
    // This method accepts a Position object, which contains the
    // current GPS coordinates
    //
    
    var onSuccess = function (position) {
        DBMeter.start(function (dB) {
        window.plugin.lightsensor.getReading(
function success(reading) {
        alert('Latitude: ' + position.coords.latitude + '\n' +
              'Longitude: ' + position.coords.longitude + '\n' +
              'Altitude: ' + position.coords.altitude + '\n' +
              'Accuracy: ' + position.coords.accuracy + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
              'Heading: ' + position.coords.heading + '\n' +
              'Speed: ' + position.coords.speed + '\n' +
              'Lighting: ' + JSON.stringify(reading) + '\n' +
              'Noise Levels: ' + dB + '\n' +
              'Timestamp: ' + position.timestamp + '\n');
}, function (e) {
    alert('code: ' + e.code + ', message: ' + e.message);
});
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

    var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError,{enableHighAccuracy: true ,timeout: 3000});

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
        alert("The address is: \n\n" + JSON.stringify(result[0]));
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
    (onMapWatchSuccess, onMapError, { enableHighAccuracy: true,timeout: 30000 });
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
function getMap(updatedLatitude,updatedLongitude) {

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



function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#blah')
                    .attr('src', e.target.result)
                    .width(150)
                    .height(200);
            };
            
            reader.readAsDataURL(input.files[0]);
        }
        document.getElementById("blah").onclick = function () {
            EXIF.getData(this, function () {
                alert(EXIF.pretty(this));
                location.reload();
            });
        }
    }