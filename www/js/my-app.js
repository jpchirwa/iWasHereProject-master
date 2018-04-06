// Initialize your app
var myApp = new Framework7(
    {
        swipePanel: 'both',
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
function onLoad(){
    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("backbutton", onBackKeyDown, false);
    function onBackKeyDown(e) {
        e.preventDefault();
        alert('Exiting iWasHere ?');
    }
}
function onDeviceReady() {
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
        navigator.camera.getPicture(onSuccess, onFail, {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    });

    function onSuccess(imageURL) {
        var image = document.getElementById('uploadFile');
        image.style.display = 'block';
        image.src = "data:image/jpeg;base64," + imageURL;
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}
function info() {


}