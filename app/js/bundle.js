(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by user on 25.03.16.
 */
function createArrayStorage(){

}

function closeSettings(){

}

module.exports = {
    createArrayStorage: createArrayStorage,
    closeSettings: closeSettings
};




},{}],2:[function(require,module,exports){
'use strict';

/**
 * Created by user on 21.04.16.
 */
var f7 = require('framework7');
var webactivity = require('./webactivity');
var my_app = require('./MyApp');


console.log('333 ', my_app);


var myapp = myapp || {};
var myApp = new Framework7(
    {
        //pushState:true,
        init:false,
        //tapHold: true, //enable tap hold events
        router: true,
        reloadPages:true,
        //animateNavBackIcon: true,
        swipeBackPage: false,
        // Enable templates auto precompilation
        precompileTemplates: true,
        // Enabled pages rendering using Template7
        template7Pages: true,
        // Specify Template7 data for pages
        modalButtonCancel: _w.global.buttons.cancel[LN]
});
// global
var n = {
    language:'en',
    platform: "iOS",
    JSAPI: null,
    free: false,
    settings: null,
    sounds:{},
    key_storage:{
        categories:"trip_obj",
        language:"trip_language"
    }
};
document.addEventListener("DOMContentLoaded", function(event) {
    //storageClear();
    // Init method
    if(!storageGet(n.key_storage.categories)){
        // заносим категории по умолчанию
        my_app.createArrayStorage();
    }
    else{
        console.log('init');

    }

    n.JSAPI = JSAPI;
    n.JSAPI.keepScreenOn();
    n.JSAPI.setStatusBarColor("black");


    if(n.free){
        addPaddingBunner();
    }
    //setInterval(updateData, 1000);

    console.log('end ready');
    // Initialize app
    var fw7App = myApp,
        $$ = Dom7,
        ipc = new myapp.pages.IndexPageController(fw7App, $$);

    $$(document.body).on('click','.toolbar .link', function(e){
        closeSettings();
    });
});
window.addEventListener("deviceReadyEvent", function(event) {
    n.sounds.tap = new Sound('sounds/tap.mp3');
    n.sounds.tap.volume(0.5);
    $$(document.body).on('click', '.navbar .link, .toolbar .link, .subnavbar .tab-link', function(e){
        var that = $$(this);
        pointerEvent(that, 'none');
        playSound(n.sounds.tap);
        pointerEvent(that, 'auto', 300);
    });
});



},{"./MyApp":1,"./webactivity":3,"framework7":"framework7"}],3:[function(require,module,exports){
/*
 * Devices platform
 */

var platform = getDevice();

function setPlatform(input) {
    platform = input;
}

function getDevice() {
    var ua = navigator.userAgent;
    var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
    var mac = ua.match(/(Mac OS X)/i);
    var device = {
    ios: ipad || iphone || ipod,
    android: android,
    mac: mac
    };
    
    if(device.ios) return "ios";
    if(device.android) return "android";
    if(device.mac) return "mac";
}

function getPlatform() {
    switch (platform) {
        case "android": alert("Android is current platform!"); break;
        case "ios": alert("iOS is current platform!"); break;
        case "mac": alert("Mac is current platform!"); break;
    }
}

/*
 * LocalStorage functions
 */

localStorage.removeItem = function(key) {
    if (typeof MyJS != "undefined") {
        MyJS.localStorageDeleted(key);
        MyJS.localStorageRemoveItem(key);
    }
    
    if (typeof JSAPI.bridge != "undefined") JSAPI.bridge("removeLocalStorageKey");
    
    delete localStorage[key];
}

localStorage.setItem = function(key, value) {
    if (typeof MyJS != "undefined") {
        MyJS.localStorageChanged(key); // deprecated method for synchronization with apple watch
        MyJS.localStorageSetItem(key, value);
    }
    
    if (typeof JSAPI.bridge != "undefined") JSAPI.bridge("localStorageSetItem");
    localStorage[key] = value;
}

localStorage.getItem = function(key) {
    if (typeof MyJS != "undefined") return MyJS.localStorageGetItem(key);
    
    if (typeof JSAPI.bridge != "undefined") return JSAPI.bridge("localStorageGetItem");
    return localStorage[key];
}

Storage.prototype.getKeys = function() {
    if (typeof MyJS != "undefined") return JSON.parse(MyJS.getLocalStorageKeys());
    if (typeof JSAPI.bridge != "undefined") return JSON.parse(JSAPI.bridge("getLocalStorageKeys")).keys;
    
    var keys = []; for (var i = localStorage.length; --i>=0;) keys.push(localStorage.key(i));
    return keys;
}

function localStorageGetItem(key) {
    return localStorage[key];
}

function localStorageSetItem(key, value) {
    localStorage[key] = value;
}

function localStorageGetKeys() {
    var str = '';
    for (var key in localStorage) {
        str += key + ","
    }
    str = str.slice(0, -1);
    return str;
}

/*
 * Getting GET arguments
 */

var localeVar = parseGET()['locale'];

function parseGET() {
    var tmp = new Array();
    var tmp2 = new Array();
    var get = new Array();
    
    var url = location.search;
    if (url != '') {
        tmp = (url.substr(1)).split('&');
        
        for(var i=0; i < tmp.length; i++) {
            tmp2 = tmp[i].split('=');
            
            get[tmp2[0]] = tmp2[1];
        }
    }
    
    return get;
}

/*
 * Event buffer variables
 */

var bufferEventVar = {
path: "",
longitude: 0,
latitude: 0,
altitude: 0,
speed: 0,
magneticHeading: 0,
trueHeading: 0,
x: 0,
y: 0,
z: 0,
batteryLevel: 0,
filePath: "",
locationInfo: ""
};

function getBufferEventVar() {
    return bufferEventVar;
}

function dispatchCustomEvent(eventName, data) {
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(eventName, true, false, data);
    window.dispatchEvent(evt);
}

/*
 * Event initialization
 */

var deviceReadyEvent;

var appMinimizeEvent;
var appMaximizeEvent;
var appCloseEvent;

var magneticHeadingEvent;
var locationChangedEvent;
var accelerometerChangedEvent;
var magneticFieldChangedEvent;

var batteryLevelChangedEvent;

var menuButtonEvent;
var backButtonEvent;
var volumeUpEvent;
var volumeDownEvent;

var cameraCapturedImageEvent;
var pickedImageEvent;
var pickedImageErrorEvent;

var downloadFileEvent;
var downloadFileErrorEvent;

var locationInfoEvent;

var mediaPreparedEvent;

var providerDisabledEvent;
var providerEnabledEvent;
var alarmEvent;
var filePartCopyEvent;
var finishFileCopyEvent;
var fakeUpdateStarted;
var fakeUpdateFinished;
var handMoveEvent;
var pedometrEvent;
var callMoveEvent;

/*
 * Social
 */

var getParamsEvent;

/*
 * In-Apps
 */

var purchaseEvent;
var purchaseExitEvent;
var productDataEvent;

/*
 * Banner Ad
 */

var adCrossClickedEvent;
var onAdDisableError;
var onAdDisabled;

/*
 * Create Events
 */

document.addEventListener('DOMContentLoaded', function() {
                          
                          deviceReadyEvent = document.createEvent('Event');
                          deviceReadyEvent.initEvent('deviceReadyEvent', false, false);
                          
                          appMinimizeEvent = document.createEvent('Event');
                          appMinimizeEvent.initEvent('appMinimizeEvent', false, false);
                          
                          appMaximizeEvent = document.createEvent('Event');
                          appMaximizeEvent.initEvent('appMaximizeEvent', false, false);
                          
                          appCloseEvent = document.createEvent('Event');
                          appCloseEvent.initEvent('appCloseEvent', false, false);
                          
                          magneticHeadingEvent = document.createEvent('Event');
                          magneticHeadingEvent.initEvent('magneticHeadingEvent', false, false);
                          
                          locationChangedEvent = document.createEvent('Event');
                          locationChangedEvent.initEvent('locationChangedEvent', false, false);
                          
                          accelerometerChangedEvent = document.createEvent('Event');
                          accelerometerChangedEvent.initEvent('accelerometerChangedEvent', false, false);
                          
                          magneticFieldChangedEvent = document.createEvent('Event');
                          magneticFieldChangedEvent.initEvent('magneticFieldChangedEvent', false, false);
                          
                          batteryLevelChangedEvent = document.createEvent('Event');
                          batteryLevelChangedEvent.initEvent('batteryLevelChangedEvent', false, false);
                          
                          menuButtonEvent = document.createEvent('Event');
                          menuButtonEvent.initEvent('menubutton', false, false);
                          
                          backButtonEvent = document.createEvent('Event');
                          backButtonEvent.initEvent('backbutton', false, false);
                          
                          volumeUpEvent = document.createEvent('Event');
                          volumeUpEvent.initEvent('volumeup', false, false);
                          
                          volumeDownEvent = document.createEvent('Event');
                          volumeDownEvent.initEvent('volumedown', false, false);
                          
                          cameraCapturedImageEvent = document.createEvent('Event');
                          cameraCapturedImageEvent.initEvent('cameraCapturedImageEvent', false, false);
                          
                          pickedImageEvent = document.createEvent('Event');
                          pickedImageEvent.initEvent('pickedImageEvent', false, false);
                          
                          pickedImageErrorEvent = document.createEvent('Event');
                          pickedImageErrorEvent.initEvent('pickedImageErrorEvent', false, false);
                          
                          downloadFileEvent = document.createEvent('Event');
                          downloadFileEvent.initEvent('downloadFileEvent', false, false);
                          
                          downloadFileErrorEvent = document.createEvent('Event');
                          downloadFileErrorEvent.initEvent('downloadFileErrorEvent', false, false);
                          
                          locationInfoEvent = document.createEvent('Event');
                          locationInfoEvent.initEvent('locationInfoEvent', false, false);
                          
                          mediaPreparedEvent = document.createEvent('Event');
                          mediaPreparedEvent.initEvent('mediaPrepared', false, false);
                          
                          providerDisabledEvent = document.createEvent('Event');
                          providerDisabledEvent.initEvent('providerDisabledEvent', false, false);
                          
                          providerEnabledEvent = document.createEvent('Event');
                          providerEnabledEvent.initEvent('providerEnabledEvent', false, false);
                          
                          alarmEvent = document.createEvent('Event');
                          alarmEvent.initEvent('alarmEvent', false, false);
                          
                          filePartCopyEvent = document.createEvent('Event');
                          filePartCopyEvent.initEvent('filePartCopyEvent', false, false);
                          
                          finishFileCopyEvent = document.createEvent('Event');
                          finishFileCopyEvent.initEvent('finishFileCopyEvent', false, false);
                          
                          fakeUpdateStarted = document.createEvent('Event');
                          fakeUpdateStarted.initEvent('fakeUpdateStarted', false, false);
                          
                          fakeUpdateFinished = document.createEvent('Event');
                          fakeUpdateFinished.initEvent('fakeUpdateFinished', false, false);
                          
                          handMoveEvent = document.createEvent('Event');
                          handMoveEvent.initEvent('handMoveEvent', false, false);
                          
                          pedometrEvent = document.createEvent('Event');
                          pedometrEvent.initEvent('pedometrEvent', false, false);
                          
                          callMoveEvent = document.createEvent('Event');
                          callMoveEvent.initEvent('callMoveEvent', false, false);
                          
                          // Social
                          getParamsEvent = document.createEvent('CustomEvent');
                          getParamsEvent.initEvent('getParamsEvent', true, false);
                          
                          // LocalStorage
                          setItemCallback = document.createEvent('CustomEvent');
                          setItemCallback.initEvent('setItemCallback', true, false);
                          
                          getAllCallback = document.createEvent('CustomEvent');
                          getAllCallback.initEvent('getAllCallback', true, false);
                          
                          // In-Apps
                          purchaseEvent = document.createEvent('Event');
                          purchaseEvent.initEvent('purchaseEvent', false, false);
                          
                          productDataEvent = document.createEvent('Event');
                          productDataEvent.initEvent('productDataEvent', false, false);
                          
                          purchaseExitEvent = document.createEvent('Event');
                          purchaseExitEvent.initEvent('purchaseExitEvent', false, false);
                          
                          // Banner Ad
                          adCrossClickedEvent = document.createEvent('Event');
                          adCrossClickedEvent.initEvent('adCrossClickedEvent', false, false);
                          
                          onAdDisableError = document.createEvent('Event');
                          onAdDisableError.initEvent('onAdDisableError', false, false);
                          
                          onAdDisabled = document.createEvent('Event');
                          onAdDisabled.initEvent('onAdDisabled', false, false);
                          
                          // Встретились только в андроид версии !!!
                          screenOnEvent = document.createEvent('Event');
                          screenOnEvent.initEvent('screenOnEvent', false, false);
                          
                          screenOffEvent = document.createEvent('Event');
                          screenOffEvent.initEvent('screenOffEvent', false, false);
                          
                          }, false);

/*
 * JSAPI methods
 */

document.addEventListener("DOMContentLoaded", function() {
                          if (platform == "android") {
                          if (typeof JSAPI == 'object') {
                          return;
                          }
                          (function() {
                           JSAPI = function() {
                           function bridge(func) {
                           var args = Array.prototype.slice.call(arguments.callee.caller.arguments, 0);
                           var res = prompt("jsapi."+func, JSON.stringify(args));
                           try {
                           res = JSON.parse(res);
                           res = (res && res.result) ? res.result : null;
                           }
                           catch (e) {
                           res = null;
                           }
                           return JSON.parse(res);
                           }
                           
                           this.bridge = bridge;
                           
                           this.test = function() {
                           console.log("JSAPI: test() unavailable on Android.");
                           }
                           
                           this.log = function(input) {
                           console.log("JSAPI: log(\"" + input + "\") unavailable on Android.");
                           }
                           
                           this.keepScreenOn = function() {
                           bridge('keepScreenOn');
                           }
                           
                           this.unsetScreenOn = function() {
                           console.log("JSAPI: unsetScreenOn() unavailable on Android.");
                           }
                           
                           this.setFullScreen = function() {
                           bridge('setFullScreen');
                           }
                           
                           this.unsetFullScreen = function() {
                           bridge('unsetFullScreen');
                           }
                           
                           this.setStatusBarColor = function(input) {
                           console.log("JSAPI: setStatusBarColor(\"" + input + "\") unavailable on Android.");
                           }
                           
                           this.setButtonHandler = function(input) {
                           bridge('setButtonHandler');
                           }
                           
                           this.unsetButtonHandler = function(input) {
                           bridge('unsetButtonHandler');
                           }
                           
                           this.reload = function() {
                           console.log("JSAPI: reload() unavailable on Android.");
                           }
                           
                           this.canVibrate = function() {
                           console.log("JSAPI: canVibrate() unavailable on Android.");
                           }
                           
                           this.vibrate = function(time) {
                           return bridge('vibration');
                           }
                           
                           this.getDeviceId = function() {
                           console.log("JSAPI: getDeviceId() unavailable on Android.");
                           }
                           
                           this.showAd = function() {
                           return bridge('showAd');
                           }
                           
                           this.createUnitNotif = function(type, time, alarmId, title, text, tickerText, vibrationTime, soundPath) {
                           return bridge('createUnitNotif');
                           }
                           
                           this.createRepeatNotif = function(type, time, timeInterval, alarmId, title, text, tickerText, vibrationTime, soundPath) {
                           return bridge('createRepeatNotif');
                           }
                           
                           this.createMultipleNotif = function(notifList) {
                           return bridge('createMultipleNotif');
                           }
                           
                           this.cancelNotif = function(alarmId) {
                           return bridge('cancelNotif');
                           }
                           
                           this.getSettings = function() {
                           console.log("JSAPI: getSettings() unavailable on Android.");
                           }
                           
                           
                           this.sharing=function(text){
                           return bridge('sharing');
                           }
                           
                           this.sharing=function(text,img){
                           return bridge('sharing');
                           }
                           
                           this.saveImage = function() {
                           return bridge('saveImage');
                           }
                           
                           this.saveFileFromUrl = function() {
                           bridge('saveFileFromUrl');
                           }
                           
                           this.listenLocation = function(minTime,  minDistance, providerStr) {
                           return bridge('listenLocation');
                           }
                           
                           this.stopListenLocation = function() {
                           return bridge('stopListenLocation');
                           }
                           
                           this.listenAccelerometer = function(delayMicrosec) {
                           return bridge('listenAccelerometerField');
                           }
                           
                           this.stopListenAccelerometer = function() {
                           return bridge('stopListenAccelerometerField');
                           }
                           
                           this.listenMagneticField = function(delayMicrosec) {
                           return bridge('listenMagneticField');
                           }
                           
                           this.stopListenMagneticField = function() {
                           return bridge('stopListenMagneticField');
                           }
                           
                           this.pickPhoto = function() {
                           return bridge('pickPhoto');
                           }
                           
                           this.takePhoto = function() {
                           return bridge('takePhoto');
                           }
                           
                           this.newMedia = function(link) {
                           return bridge("createMedia");
                           }
                           
                           this.mediaPlay = function(id) {
                           bridge("mediaPlay");
                           }
                           
                           this.mediaStop = function(id) {
                           bridge("mediaStop");
                           }
                           
                           this.mediaPause = function(id) {
                           bridge("mediaPause");
                           }
                           
                           this.mediaSetVolume = function(count, id) {
                           bridge("mediaSetVolume");
                           }
                           
                           this.mediaSeekTo = function(id, time) {
                           bridge("mediaSeekTo");
                           }
                           
                           this.mediaLoop = function(id, state) {
                           return bridge("mediaLoop");
                           }
                           
                           this.mediaGetDuration = function(mid) {
                           return bridge('mediaGetDuration');
                           }
                           
                           this.mediaGetPosition = function(mid) {
                           return bridge('mediaGetPosition');
                           }
                           
                           this.mediaRelease = function(id) {
                           bridge("mediaRelease");
                           }
                           
                           this.newSound = function(link) {
                           return bridge('newSound');
                           }
                           
                           this.playSound = function(id, vol) {
                           return bridge("playSound");
                           }
                           
                           this.setVolume = function(id, volume) {
                           console.log("JSAPI: setVolume(id: \""+id+"\", volume: \""+volume+"\") unavailable on Android.");
                           }
                           
                           this.playLoopedSound = function(id, vol) {
                           return bridge("playLoopedSound");
                           }
                           
                           this.stopSound = function(id) {
                           return bridge("stopSound");
                           }
                           
                           this.isFlashLight = function() {
                           return bridge('isFlashLight');
                           }
                           
                           this.flashLightOn = function() {
                           return bridge('flashLightOn');
                           }
                           
                           this.flashLightOff = function() {
                           return bridge('flashLightOff');
                           }
                           
                           this.flashLightLevel = function(input) {
                           console.log("JSAPI: flashLightLevel() unavailable on Android.");
                           }
                           
                           this.setScreenBrightness = function(input) {
                           return bridge('setScreenBrightness');
                           }
                           
                           this.getScreenBrightness = function() {
                           return bridge('getScreenBrightness');
                           }
                           
                           this.getBatteryLevel = function() {
                           return bridge('getBatteryLevel');
                           }
                           
                           this.startBatteryLevelChangedListen = function() {
                           return bridge('startBatteryLevelChangedListen');
                           }
                           
                           this.stopBatteryLevelChangedListen = function() {
                           return bridge('stopBatteryLevelChangedListen');
                           }
                           
                           this.clearCookies = function() {
                           return bridge('clearCookies');
                           }
                           
                           this.toast = function(message) {
                           return bridge('toast');
                           }
                           
                           this.changeOrientation = function(orientation) {
                           return bridge('changeOrientation');
                           }
                           
                           this.getContactList = function(params) {
                           return bridge('getContactList');
                           }
                           
                           this.getCallList = function(params) {
                           return bridge('getCallList');
                           }
                           
                           this.getInSmsList = function(params) {
                           return bridge('getInSmsList');
                           }
                           
                           this.getOutSmsList = function(params) {
                           return bridge('getOutSmsList');
                           }
                           
                           this.makePhoneCall = function(params) {
                           return bridge('makePhoneCall');
                           }
                           
                           this.sendSms = function(number,msg) {
                           return bridge('sendSms');
                           }
                           
                           this.createUnitAlarm = function(type,time,alarmId) {
                           return bridge('createUnitAlarm');
                           }
                           
                           this.createRepeatAlarm = function(type,time,timeInterval,alarmId) {
                           return bridge('createRepeatAlarm');
                           }
                           
                           this.cancelAlarm = function(alarmId) {
                           return bridge('cancelAlarm');
                           }
                           
                           this.cancelAlarm = function(alarmId) {
                           return bridge('cancelAlarm');
                           }
                           
                           this.getFileListForDir = function(dir) {
                           return bridge('getFileListForDir');
                           }
                           
                           this.getSdDir = function() {
                           return bridge('getSdDir');
                           }
                           
                           this.getRootDir = function() {
                           return bridge('getRootDir');
                           }
                           
                           this.copy = function(from, to) {
                           return bridge('copy');
                           }
                           
                           this.createDir = function(folder) {
                           return bridge('createDir');
                           }
                           
                           this.createFile = function(path) {
                           return bridge('createFile');
                           }
                           
                           this.deleteFile = function(path) {
                           return bridge('deleteFile');
                           }
                           
                           this.move = function(from, to) {
                           return bridge('move');
                           }
                           
                           this.getFileSize = function(path) {
                           return bridge('getFileSize');
                           }
                           
                           this.startListenGesture = function() {
                           return bridge('startListenGesture');
                           }
                           
                           this.stopListenGesture = function() {
                           return bridge('stopListenGesture');
                           }
                           
                           this.startListenPedometrPeriodic = function(interval,isSendUniqOnly) {
                           return bridge('startListenPedometrPeriodic');
                           }
                           
                           this.stopListenPedometr = function() {
                           return bridge('stopListenPedometr');
                           }
                           
                           this.startListenCallMove = function() {
                           return bridge('startListenCallMove');
                           }
                           
                           this.stopListenCallMove = function() {
                           return bridge('stopListenCallMove');
                           }
                           
                           this.isSDMounted = function() {
                           return bridge('isSDMounted');
                           }
                           
                           this.writeFileSD = function(filePath, text,isAppend) {
                           return bridge('writeFileSD');
                           }
                           
                           this.getTextFromFileSD = function(filePath ) {
                           return bridge('getTextFromFileSD');
                           }
                           
                           this.writeFileInternal = function(filePath, text, isAppend ) {
                           return bridge('writeFileInternal');
                           }
                           
                           this.getTextFromFileInternal = function(filePath) {
                           return bridge('getTextFromFileInternal');
                           }
                           
                           this.exit = function() {
                           return bridge('exit');
                           }
                           
                           this.openDatabase = function(dbName) {
                           return bridge('openDatabase');
                           }
                           
                           this.closeDatabase = function(dbName) {
                           return bridge('openDatabase');
                           }
                           
                           this.deleteDatabase = function(dbName) {
                           return bridge('deleteDatabase');
                           }
                           
                           this.rawQuery = function(dbName, query) {
                           return bridge('rawQuery');
                           }
                           
                           this.beginTransaction = function(dbName) {
                           return bridge('beginTransaction');
                           }
                           
                           this.endTransaction = function(dbName) {
                           return bridge('endTransaction');
                           }
                           
                           this.setTransactionSuccessful = function(dbName) {
                           return bridge('setTransactionSuccessful');
                           }
                           
                           this.insertInTable = function(dbName, tableName, data) {
                           return bridge('insertInTable');
                           }
                           
                           this.updateInTable = function(dbName, tableName, data,where) {
                           return bridge('updateInTable');
                           }
                           
                           this.deleteInTable = function(dbName, tableName,where) {
                           return bridge('deleteInTable');
                           }
                           
                           this.getActiveNetworkList = function() {
                           return bridge('getActiveNetworkList');
                           }
                           
                           this.getAvailableNetworkList = function() {
                           return bridge('getAvailableNetworkList');
                           }
                           
                           this.testMethod1 = function() {
                           return bridge('testMethod1');
                           }
                           
                           this.testMethod2 = function() {
                           return bridge('testMethod2');
                           }
                           
                           this.testMethod3 = function() {
                           return bridge('testMethod3');
                           }
                           
                           this.openURLinAppStore = function(input) {
                           console.log("JSAPI: openURLinAppStore(url: \""+input+"\") unavailable on Android.");
                           }
                           
                           this.openURLinBrowser = function(link) {
                           return bridge('openURLinBrowser');
                           }
                           
                           this.pushCustomEvent = function(input) {
                           return bridge('pushCustomEvent');
                           }
                           
                           this.downloadFile = function(input) {
                           console.log("JSAPI: downloadFile(url: \""+input+"\") unavailable on Android.");
                           }
                           
                           this.getLocationInfo = function(latitude, longitude) {
                           return bridge('getLocationInfo');
                           }
                           
                           // In-Apps
                           this.purchase = function(purchaseId){
                           return bridge('purchase');
                           }
                           
                           this.confirmReceipt = function(receiptId){
                           return bridge('confirmReceipt');
                           }
                           
                           this.requestProductData = function(){
                           return bridge('requestProductData');
                           }
                           
                           this.refreshPurchases = function(){
                           return bridge('refreshPurchases');
                           }
                           
                           // Banner Ad
                           this.enableCross = function() {
                           bridge('enableCross');
                           }
                           
                           this.disableAd = function() {
                           bridge('disableAd');
                           }
                           
                           this.isAdDisabled = function() {
                           var result = bridge('isAdDisabled');
                           if (result == "true") return true;
                           else return false;
                           }
                           
                           this.getProjectFile = function(fileName) {
                           console.warn('Not available in android');
                           }
                           
                           /**
                            * Проверка налиия камеры у девайса
                            * @return true, если камера есть и false, если её нет
                            */
                           this.hasDeviceCamera = function() {
                           return bridge("hasDeviceCamera") == "true" ? true : false;
                           }
                           
                           // Было только в андроид !!!
                           this.checkGps = function() {
                           var result = bridge('checkGps');
                           if (result == "true") return true;
                           return false;
                           }
                           
                           this.isGPSEnabled=function() {
                           return bridge('isGPSEnabled');
                           }
                           
                           this.isNetworkEnabled=function() {
                           return bridge('isNetworkEnabled');
                           }
                           
                           this.setIsAllowOffScreen=function(isAllow){
                           return bridge('setIsAllowOffScreen');
                           }
                           
                           this.startAudioRecord=function(){
                           return bridge('startAudioRecord');
                           }
                           
                           this.stopAudioRecord=function(){
                           return bridge('stopAudioRecord');
                           }
                           
                           this.startListenScreenPower=function(){
                           return bridge('startListenScreenPower');
                           }
                           
                           this.stopListenScreenPower=function(){
                           return bridge('stopListenScreenPower');
                           }
                           };
                           
                           window.JSAPI = new JSAPI();
                           })(window);
                          }
                          else if (platform == "ios") {
                          if (typeof JSAPI == 'object') {
                          return;
                          }
                          (function() {
                           JSAPI = function() {
                           this.console = true;
                           
                           this.test = function() {
                           if (this.console) console.log("JSAPI: test() invoked.");
                           if (typeof MyJS != "undefined") MyJS.test();
                           }
                           
                           this.log = function(input) {
                           console.log("JSAPI: log(" + input + ") invoked.");
                           if (typeof MyJS != "undefined") MyJS.log("JSAPI: "+ input);
                           }
                           
                           this.keepScreenOn = function() {
                           if (this.console) console.log("JSAPI: keepScreenOn() invoked.");
                           if (typeof MyJS != "undefined") MyJS.setLockDisabled();
                           }
                           
                           this.unsetScreenOn = function() {
                           if (this.console) console.log("JSAPI: unsetScreenOn() invoked.");
                           if (typeof MyJS != "undefined") MyJS.setLockEnabled();
                           }
                           
                           this.setFullScreen = function() {
                           if (this.console) console.log("JSAPI: setFullScreen() invoked.");
                           if (typeof MyJS != "undefined") MyJS.hideStatusBar();
                           }
                           
                           this.unsetFullScreen = function() {
                           if (this.console) console.log("JSAPI: unsetFullScreen() invoked.");
                           if (typeof MyJS != "undefined") MyJS.showStatusBar();
                           }
                           
                           this.setStatusBarColor = function(input) {
                           if (this.console) console.log("JSAPI: setStatusBarColor(\""+input+"\") invoked.");
                           if (typeof MyJS != "undefined") MyJS.setStatusBarColor(input);
                           }
                           
                           this.setButtonHandler = function(input) {
                           console.log("JSAPI: setButtonHandler() unavailable on iOS.");
                           }
                           
                           this.unsetButtonHandler = function(input) {
                           console.log("JSAPI: unsetButtonHandler() unavailable on iOS.");
                           }
                           
                           this.reload = function() {
                           if (this.console) console.log("JSAPI: reload() invoked.");
                           if (typeof MyJS != "undefined") MyJS.reloadView();
                           }
                           
                           this.canVibrate = function() {
                           if (this.console) console.log("JSAPI: canVibrate() invoked.");
                           if (typeof MyJS != "undefined") return (MyJS.canVibrate() == "true") ? true : false;
                           }
                           
                           this.vibrate = function(input) {
                           if (this.console) console.log("JSAPI: vibrate(" + input + ") invoked.");
                           if (typeof MyJS != "undefined") MyJS.vibrate(input);
                           }
                           
                           this.getDeviceId = function() {
                           if (this.console) console.log("JSAPI: getDeviceId() invoked.");
                           if (typeof MyJS != "undefined") return MyJS.getDeviceId();
                           }
                           
                           this.showAd = function() {
                           if (this.console) console.log("JSAPI: showAd() invoked.");
                           if (typeof MyJS != "undefined") MyJS.showAd();
                           }
                           
                           this.createUnitNotif = function(notificationMode, notTime, notifierId, topText, statusBar, fullText, vibrationTime, soundLink) {
                           if (this.console) console.log("JSAPI: createUnitNotif(mode: \""+notificationMode+"\", time: \""+notTime+"\", ID: \""+notifierId
                                                         +"\", text: \""+topText+"\", statusBar: \""+statusBar+"\", fullText: \""+fullText+"\", vibrationTime: \""+vibrationTime
                                                         +"\", sound: \""+soundLink+"\") invoked.");
                           var noTime = notTime/1000;
                           if (typeof MyJS != "undefined") MyJS.createNotificationwithIdwithDate(fullText, notifierId, noTime);
                           }
                           
                           this.createRepeatNotif = function(notificationMode, notTime, interval, notifierId, topText, statusBar, fullText, vibrationTime, soundLink) {
                           if (this.console) console.log("JSAPI: createUnitNotif(mode: \""+notificationMode+"\", time: \""+notTime+"\", interval: \""+interval
                                                         +"\", ID: \""+notifierId+"\", text: \""+topText+"\", statusBar: \""+statusBar+"\", fullText: \""+fullText+"\", vibrationTime: \""
                                                         +vibrationTime+"\", sound: \""+soundLink+"\") invoked.");
                           var noTime = notTime/1000;
                           if (typeof MyJS != "undefined") MyJS.createRepeatNotificationwithIdwithDatewithRepeatInterval(fullText, notifierId, noTime, interval);
                           }
                           
                           this.cancelNotif = function(input) {
                           if (this.console) console.log("JSAPI: cancelNotif(" + input + ") invoked.");
                           if (typeof MyJS != "undefined") MyJS.cancelNotification(input);
                           }
                           
                           this.getSettings = function() {
                           if (this.console) console.log("JSAPI: getNotificationSettings() invoked.");
                           if (typeof MyJS != "undefined") MyJS.getNotificationSettings();
                           }
                           
                           this.sharing = function (text, img) {
                           var imgBool = "false";
                           if (img) imgBool = "true";
                           if (this.console) console.log("JSAPI: share(text: \"" + text + "\", img: \"" + imgBool + "\")");
                           if (typeof MyJS != "undefined") MyJS.sharingwithImg(text, img);
                           }
                           
                           this.saveImage = function() {
                           console.log("JSAPI: saveImage() unavailable on iOS.");
                           }
                           
                           this.listenLocation = function(minDelay, minDistance, locationProvider){
                           if (this.console) console.log("JSAPI: listenLocation(delay: \""+minDelay+"\", distance: \""+minDistance+"\", provider: \""+locationProvider+"\") invoked.");
                           if (typeof MyJS != "undefined") MyJS.listenLocation(locationProvider);
                           }
                           
                           this.stopListenLocation = function() {
                           if (this.console) console.log("JSAPI: stopListenLocation() invoked.");
                           if (typeof MyJS != "undefined") MyJS.stopListenLocation();
                           }
                           
                           this.listenAccelerometer = function(delayMicrosec) {
                           if (this.console) console.log("JSAPI: listenAccelerometer("+delayMicrosec+") invoked.");
                           if (typeof MyJS != "undefined") MyJS.listenAccelerometer();
                           }
                           
                           this.stopListenAccelerometer = function() {
                           if (this.console) console.log("JSAPI: stopListenAccelerometer() invoked.");
                           if (typeof MyJS != "undefined") MyJS.stopListenAccelerometer();
                           }
                           
                           this.listenMagneticField = function(delayMicrosec) {
                           console.log("JSAPI: listenMagneticField() unavailable on iOS.");
                           }
                           
                           this.stopListenMagneticField = function() {
                           console.log("JSAPI: stopListenMagneticField() unavailable on iOS.");
                           }
                           
                           this.pickPhoto = function() {
                           if (this.console) console.log("JSAPI: pickPhoto() invoked.");
                           if (typeof MyJS != "undefined") MyJS.showPhotoView();
                           }
                           
                           this.takePhoto = function() {
                           if (this.console) console.log("JSAPI: takePhoto() invoked.");
                           if (typeof MyJS != "undefined") MyJS.takePhoto();
                           }
                           
                           this.newMedia = function(link) {
                           if (this.console) console.log("JSAPI: newMedia(" + link + ") invoked.");
                           if (typeof MyJS != "undefined") return MyJS.newSound(link);
                           }
                           
                           this.mediaPlay = function(id) {
                           if (this.console) console.log("JSAPI: mediaPlay("+id+") invoked.");
                           if (typeof MyJS != "undefined") MyJS.playMedia(id);
                           }
                           
                           this.mediaStop = function(id) {
                           if (this.console) console.log("JSAPI: mediaStop("+id+") invoked.");
                           if (typeof MyJS != "undefined") MyJS.stopSound(id);
                           }
                           
                           this.mediaPause = function(id) {
                           if (this.console) console.log("JSAPI: mediaPause("+id+") invoked.");
                           if (typeof MyJS != "undefined") MyJS.pauseSound(id);
                           }
                           
                           this.mediaSetVolume = function(id, volume) {
                           if (this.console) console.log("JSAPI: mediaSetVolume("+volume+", "+id+") invoked.");
                           if (typeof MyJS != "undefined") MyJS.changeVolume(volume, id);
                           }
                           
                           this.mediaSeekTo = function(id, position) {
                           if (this.console) console.log("JSAPI: mediaSeekTo("+id+", "+position+") invoked.");
                           if (typeof MyJS != "undefined") MyJS.setPosition(id, position);
                           }
                           
                           this.mediaLoop = function(id, state) {
                           if (this.console) console.log("JSAPI: mediaLoop("+id+", "+state+") invoked.");
                           if (typeof MyJS != "undefined") MyJS.setLoop(id, state);
                           }
                           
                           this.mediaGetDuration = function(id) {
                           if (this.console) console.log("JSAPI: mediaGetDuration("+id+") invoked.");
                           if (typeof MyJS != "undefined") return MyJS.getDuration(id);
                           }
                           
                           this.mediaGetPosition = function(id) {
                           if (this.console) console.log("JSAPI: mediaGetPosition("+id+") invoked.");
                           if (typeof MyJS != "undefined") return MyJS.getPosition(id);
                           }
                           
                           this.mediaRelease = function(id) {
                           console.log("JSAPI: mediaRelease() unavailable on iOS.");
                           }
                           
                           this.newSound = function(link) {
                           if (this.console) console.log("JSAPI: newSound(" + link + ") invoked.");
                           if (typeof MyJS != "undefined") return MyJS.newSound(link);
                           }
                           
                           this.playSound = function(id, volume) {
                           if (this.console) console.log("JSAPI: playSound("+id+", "+volume+") invoked.");
                           if (typeof MyJS != "undefined") MyJS.playSoundwithVolume(id, volume);
                           }
                           
                           this.setVolume = function(id, volume) {
                           if (this.console) console.log("JSAPI: setVolume("+id+", "+volume+") invoked.");
                           if (typeof MyJS != "undefined") MyJS.changeVolume(id, volume);
                           }
                           
                           this.playLoopedSound = function(id, volume) {
                           if (this.console) console.log("JSAPI: playLoopedSound("+id+", "+volume+") invoked.");
                           if (typeof MyJS != "undefined") MyJS.playLoopedSoundwithVolume(id, volume);
                           }
                           
                           this.stopSound = function(id) {
                           if (this.console) console.log("JSAPI: stopSound(" + id + ") invoked.");
                           if (typeof MyJS != "undefined") MyJS.stopSound(id);
                           }
                           
                           this.isFlashLight = function() {
                           if (this.console) console.log("JSAPI: isFlashLight() invoked.");
                           if (typeof MyJS != "undefined") return (MyJS.isFlashLight() == "true") ? true : false;
                           }
                           
                           this.flashLightOn = function() {
                           if (this.console) console.log("JSAPI: flashLightOn() invoked.");
                           if (typeof MyJS != "undefined") MyJS.flashLightOn();
                           }
                           
                           this.flashLightOff = function() {
                           if (this.console) console.log("JSAPI: flashLightOff() invoked.");
                           if (typeof MyJS != "undefined") MyJS.flashLightOff();
                           }
                           
                           this.flashLightLevel = function(input) {
                           if (this.console) console.log("JSAPI: flashLightLevel(" + input + ") invoked.");
                           if (typeof MyJS != "undefined") MyJS.flashLightLevel(input);
                           }
                           
                           this.setScreenBrightness = function(input) {
                           if (this.console) console.log("JSAPI: setScreenBrightness(" + input + ") invoked.");
                           if (typeof MyJS != "undefined") MyJS.setScreenBrightness(input);
                           }
                           
                           this.getScreenBrightness = function() {
                           if (this.console) console.log("JSAPI: getScreenBrightness() invoked.");
                           if (typeof MyJS != "undefined") return parseInt(MyJS.getScreenBrightness());
                           }
                           
                           this.getBatteryLevel = function() {
                           if (this.console) console.log("JSAPI: getBatteryLevel() invoked.");
                           if (typeof MyJS != "undefined") return parseInt(MyJS.getBatteryLevel());
                           }
                           
                           this.startBatteryLevelChangedListen = function() {
                           if (this.console) console.log("JSAPI: startBatteryLevelChangedListen() invoked.");
                           if (typeof MyJS != "undefined") MyJS.startBatteryLevelChangedListen();
                           }
                           
                           this.stopBatteryLevelChangedListen = function() {
                           if (this.console) console.log("JSAPI: stopBatteryLevelChangedListen() invoked.");
                           if (typeof MyJS != "undefined") MyJS.stopBatteryLevelChangedListen();
                           }
                           
                           this.clearCookies = function() {
                           if (this.console) console.log("JSAPI: clearCookies() invoked.");
                           if (typeof MyJS != "undefined") MyJS.clearCookies();
                           }
                           
                           this.toast = function(message) {
                           console.log("JSAPI: toast(message: \"" + message + "\") unavailable on iOS.");
                           }
                           
                           this.changeOrientation = function(orientation) {
                           console.log("JSAPI: changeOrientation(orientation: \"" + orientation + "\") unavailable on iOS.");
                           }
                           
                           this.getContactList = function(params) {
                           console.log("JSAPI: getContactList(params: \"" + params + "\") unavailable on iOS.");
                           }
                           
                           this.getCallList = function(params) {
                           console.log("JSAPI: getCallList(params: \"" + params + "\") unavailable on iOS.");
                           }
                           
                           this.getInSmsList = function(params) {
                           console.log("JSAPI: getInSmsList(params: \"" + params + "\") unavailable on iOS.");
                           }
                           
                           this.getOutSmsList = function(params) {
                           console.log("JSAPI: getOutSmsList(params: \"" + params + "\") unavailable on iOS.");
                           }
                           
                           this.makePhoneCall = function(params) {
                           console.log("JSAPI: makePhoneCall(params: \"" + params + "\") unavailable on iOS.");
                           }
                           
                           this.sendSms = function(number, msg) {
                           console.log("JSAPI: sendSms(number: \"" + number + "\", msg: \"" + msg + "\") unavailable on iOS.");
                           }
                           
                           this.createUnitAlarm = function(type,time,alarmId) {
                           console.log("JSAPI: createUnitAlarm(type: \"" + type + "\", time: \"" + time + "\", alarmId: \"" + alarmId + "\") unavailable on iOS.");
                           }
                           
                           this.createRepeatAlarm = function(type,time,timeInterval,alarmId) {
                           console.log("JSAPI: createRepeatAlarm(type: \"" + type + "\", time: \"" + time + "\", timeInterval: \"" + timeInterval + "\", alarmId: \"" + alarmId + "\") unavailable on iOS.");
                           }
                           
                           this.cancelAlarm = function(alarmId) {
                           console.log("JSAPI: cancelAlarm(alarmId: \"" + alarmId + "\") unavailable on iOS.");
                           }
                           
                           this.getFileListForDir = function(dir) {
                           console.log("JSAPI: getFileListForDir(dir: \"" + dir + "\") unavailable on iOS.");
                           }
                           
                           this.getSdDir = function() {
                           console.log("JSAPI: getSdDir() unavailable on iOS.");
                           }
                           
                           this.getRootDir = function() {
                           console.log("JSAPI: getRootDir() unavailable on iOS.");
                           }
                           
                           this.copy = function(from, to) {
                           console.log("JSAPI: copy(from: \"" + from + "\", to: \"" + to + "\") unavailable on iOS.");
                           }
                           
                           this.createDir = function(folder) {
                           console.log("JSAPI: createDir(folder: \"" + folder + "\") unavailable on iOS.");
                           }
                           
                           this.createFile = function(path) {
                           console.log("JSAPI: createFile(path: \"" + path + "\") unavailable on iOS.");
                           }
                           
                           this.deleteFile = function(path) {
                           console.log("JSAPI: deleteFile(path: \"" + path + "\") unavailable on iOS.");
                           }
                           
                           this.move = function(from, to) {
                           console.log("JSAPI: move(from: \"" + from + "\", to: \"" + to + "\") unavailable on iOS.");
                           }
                           
                           this.getFileSize = function(path) {
                           console.log("JSAPI: getFileSize(path: \"" + path + "\") unavailable on iOS.");
                           }
                           
                           this.startListenGesture = function() {
                           console.log("JSAPI: startListenGesture() unavailable on iOS.");
                           }
                           
                           this.stopListenGesture = function() {
                           console.log("JSAPI: stopListenGesture() unavailable on iOS.");
                           }
                           
                           this.startListenPedometrPeriodic = function(interval, isSendUniqOnly) {
                           console.log("JSAPI: startListenPedometrPeriodic(interval: \"" + interval + "\", isSendUniqOnly: \"" + isSendUniqOnly + "\") unavailable on iOS.");
                           }
                           
                           this.stopListenPedometr = function() {
                           console.log("JSAPI: stopListenPedometr() unavailable on iOS.");
                           }
                           
                           this.startListenCallMove = function() {
                           console.log("JSAPI: startListenCallMove() unavailable on iOS.");
                           }
                           
                           this.stopListenCallMove = function() {
                           console.log("JSAPI: stopListenCallMove() unavailable on iOS.");
                           }
                           
                           this.isSDMounted = function() {
                           console.log("JSAPI: isSDMounted() unavailable on iOS.");
                           }
                           
                           this.writeFileSD = function(filePath, text, isAppend) {
                           console.log("JSAPI: writeFileSD(filePath: \"" + filePath + "\", text: \"" + text + "\", isAppend: \"" + isAppend + "\") unavailable on iOS.");
                           }
                           
                           this.getTextFromFileSD = function(filePath) {
                           console.log("JSAPI: getTextFromFileSD(filePath: \"" + filePath + "\") unavailable on iOS.");
                           }
                           
                           this.writeFileInternal = function(filePath, text, isAppend ) {
                           console.log("JSAPI: writeFileInternal(filePath: \"" + filePath + "\", text: \"" + text + "\", isAppend: \"" + isAppend + "\") unavailable on iOS.");
                           }
                           
                           this.getTextFromFileInternal = function(filePath) {
                           console.log("JSAPI: getTextFromFileInternal(filePath: \"" + filePath + "\") unavailable on iOS.");
                           }
                           
                           this.exit = function() {
                           console.log("JSAPI: exit() unavailable on iOS.");
                           }
                           
                           this.openDatabase = function(dbName) {
                           console.log("JSAPI: openDatabase(dbName: \"" + dbName + "\") unavailable on iOS.");
                           }
                           
                           this.closeDatabase = function(dbName) {
                           console.log("JSAPI: closeDatabase(dbName: \"" + dbName + "\") unavailable on iOS.");
                           }
                           
                           this.deleteDatabase = function(dbName) {
                           console.log("JSAPI: deleteDatabase(dbName: \"" + dbName + "\") unavailable on iOS.");
                           }
                           
                           this.rawQuery = function(dbName, query) {
                           console.log("JSAPI: rawQuery(dbName: \"" + dbName + "\", query: \"" + query + "\") unavailable on iOS.");
                           }
                           
                           this.beginTransaction = function(dbName) {
                           console.log("JSAPI: beginTransaction(dbName: \"" + dbName + "\") unavailable on iOS.");
                           }
                           
                           this.endTransaction = function(dbName) {
                           console.log("JSAPI: endTransaction(dbName: \"" + dbName + "\") unavailable on iOS.");
                           }
                           
                           this.setTransactionSuccessful = function(dbName) {
                           console.log("JSAPI: setTransactionSuccessful(dbName: \"" + dbName + "\") unavailable on iOS.");
                           }
                           
                           this.insertInTable = function(dbName, tableName, data) {
                           console.log("JSAPI: insertInTable(dbName: \"" + dbName + "\", dbName: \"" + dbName + "\", dbName: \"" + dbName + "\") unavailable on iOS.");
                           }
                           
                           this.updateInTable = function(dbName, tableName, data, where) {
                           console.log("JSAPI: updateInTable(dbName: \"" + dbName + "\", tableName: \"" + tableName + "\", data: \"" + data + "\", where: \"" + where + "\") unavailable on iOS.");
                           }
                           
                           this.deleteInTable = function(dbName, tableName, where) {
                           console.log("JSAPI: deleteInTable(dbName: \"" + dbName + "\", tableName: \"" + tableName + "\", where: \"" + where + "\") unavailable on iOS.");
                           }
                           
                           this.getActiveNetworkList = function() {
                           console.log("JSAPI: getActiveNetworkList() unavailable on iOS.");
                           }
                           
                           this.getAvailableNetworkList = function() {
                           console.log("JSAPI: getAvailableNetworkList() unavailable on iOS.");
                           }
                           
                           this.testMethod1 = function() {
                           console.log("JSAPI: testMethod1() unavailable on iOS.");
                           }
                           
                           this.testMethod2 = function() {
                           console.log("JSAPI: testMethod2() unavailable on iOS.");
                           }
                           
                           this.testMethod3 = function() {
                           console.log("JSAPI: testMethod3() unavailable on iOS.");
                           }
                           
                           this.openURLinAppStore = function(input) {
                           if (this.console) console.log("JSAPI: openURLinAppStore(url: \"" + input + "\") invoked.");
                           if (typeof MyJS != "undefined") MyJS.openURLinAppStore(input);
                           }
                           
                           this.openURLinBrowser = function(input) {
                           if (this.console) console.log("JSAPI: openURLinBrowser(url: \"" + input + "\") invoked.");
                           if (typeof MyJS != "undefined") MyJS.openURLinBrowser(input);
                           }
                           
                           this.pushCustomEvent = function(input) {
                           if (this.console) console.log("JSAPI: pushCustomEvent(eventName: \"" + input + "\") invoked.");
                           if (typeof MyJS != "undefined") MyJS.pushCustomEvent(input);
                           }
                           
                           this.downloadFile = function(input) {
                           if (this.console) console.log("JSAPI: downloadFile(url: \"" + input + "\") invoked.");
                           if (typeof MyJS != "undefined") MyJS.downloadFile(input);
                           }
                           
                           this.getLocationInfo = function (latitude, longitude) {
                           if (this.console) console.log("JSAPI: getLocationInfo(latitude: \"" + latitude + "\", longitude: \"" + longitude + "\") invoked.");
                           if (typeof MyJS != "undefined") MyJS.getLocationInfoByLatitudewithLongitude(latitude, longitude);
                           }
                           
                           // In-Apps
                           this.purchase = function(purchaseId) {
                           if (this.console) console.log("JSAPI: purchase(purchaseId: \"" + purchaseId + "\") invoked.");
                           if (typeof MyJS != "undefined") MyJS.purchase(purchaseId);
                           }
                           
                           this.confirmReceipt = function(receiptId) {
                           if (this.console) console.log("JSAPI: confirmReceipt(receiptId: \"" + receiptId + "\") invoked.");
                           if (typeof MyJS != "undefined") MyJS.confirmReceipt(receiptId);
                           }
                           
                           this.requestProductData = function() {
                           if (this.console) console.log("JSAPI: requestProductData() invoked.");
                           if (typeof MyJS != "undefined") MyJS.requestProductData();
                           }
                           
                           this.refreshPurchases = function() {
                           if (this.console) console.log("JSAPI: refreshPurchases() invoked.");
                           if (typeof MyJS != "undefined") MyJS.refreshPurchases();
                           }
                           
                           // Banner Ad
                           this.enableCross = function() {
                           if (this.console) console.log("JSAPI: enableCross() invoked.");
                           if (typeof MyJS != "undefined") MyJS.enableCross();
                           }
                           
                           this.disableAd = function() {
                           if (this.console) console.log("JSAPI: disableAd() invoked.");
                           if (typeof MyJS != "undefined") MyJS.disableAd();
                           }
                           
                           this.isAdDisabled = function() {
                           if (this.console) console.log("JSAPI: disableAd() invoked.");
                           if (typeof MyJS != "undefined") var result = MyJS.isAdDisabled();
                           
                           if (result == "true") return true;
                           else return false;
                           }
                           
                           this.getProjectFile = function(fileName) {
                           if (this.console) console.log("JSAPI: getProjectFile(\"" + fileName + "\") invoked.");
                           if (typeof MyJS != "undefined") return MyJS.getProjectFile(fileName);
                           }
                           };
                           
                           window.JSAPI = new JSAPI();
                           })(window);
                          }
                          });

/*
 * Sound initialization
 */

function Sound(link) {
    
    this.id = JSAPI.newSound(link);
    this.mvolume = "1";
    
    this.volume = function(input) {
        this.mvolume = "" + input;
    }
    
    this.play = function() {
        JSAPI.playSound(this.id, this.mvolume);
    }
    
    this.playLooped = function() {
        JSAPI.playLoopedSound(this.id, this.mvolume);
    }
    
    this.stop = function() {
        JSAPI.stopSound(this.id);
    }
    
}

/*
 * Media initialization
 */

function Media(link) {
    
    this.id = "" + JSAPI.newMedia(link);
    this.isPlayed = false;
    
    this.play = function() {
        JSAPI.mediaPlay(this.id);
        this.isPlayed = true;
    }
    
    this.loop = function(state) {
        JSAPI.mediaLoop(this.id, state);
    }
    
    this.stop = function() {
        if (this.isPlayed) JSAPI.mediaStop(this.id);
        this.isPlayed = false;
    }
    
    this.pause = function() {
        if (this.isPlayed) JSAPI.mediaPause(this.id);
        this.isPlayed = false;
    }
    
    this.volume = function(count) {
        JSAPI.mediaSetVolume(""+count, this.id);
    }
    
    this.seekto = function(time) {
        JSAPI.mediaSeekTo(this.id, ""+time);
    }
    
    this.duration = function() {
        return JSAPI.mediaGetDuration(this.id);
    }
    
    this.position = function() {
        return JSAPI.mediaGetPosition(this.id);
    }
    
    this.release = function() {
        JSAPI.mediaRelease(this.id);
    }
}


},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvc2NyaXB0cy9NeUFwcC5qcyIsImFwcC9qcy9zY3JpcHRzL2luaXQuanMiLCJhcHAvanMvc2NyaXB0cy93ZWJhY3Rpdml0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDI1LjAzLjE2LlxuICovXG5mdW5jdGlvbiBjcmVhdGVBcnJheVN0b3JhZ2UoKXtcblxufVxuXG5mdW5jdGlvbiBjbG9zZVNldHRpbmdzKCl7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgY3JlYXRlQXJyYXlTdG9yYWdlOiBjcmVhdGVBcnJheVN0b3JhZ2UsXG4gICAgY2xvc2VTZXR0aW5nczogY2xvc2VTZXR0aW5nc1xufTtcblxuXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjEuMDQuMTYuXG4gKi9cbnZhciBmNyA9IHJlcXVpcmUoJ2ZyYW1ld29yazcnKTtcbnZhciB3ZWJhY3Rpdml0eSA9IHJlcXVpcmUoJy4vd2ViYWN0aXZpdHknKTtcbnZhciBteV9hcHAgPSByZXF1aXJlKCcuL015QXBwJyk7XG5cblxuY29uc29sZS5sb2coJzMzMyAnLCBteV9hcHApO1xuXG5cbnZhciBteWFwcCA9IG15YXBwIHx8IHt9O1xudmFyIG15QXBwID0gbmV3IEZyYW1ld29yazcoXG4gICAge1xuICAgICAgICAvL3B1c2hTdGF0ZTp0cnVlLFxuICAgICAgICBpbml0OmZhbHNlLFxuICAgICAgICAvL3RhcEhvbGQ6IHRydWUsIC8vZW5hYmxlIHRhcCBob2xkIGV2ZW50c1xuICAgICAgICByb3V0ZXI6IHRydWUsXG4gICAgICAgIHJlbG9hZFBhZ2VzOnRydWUsXG4gICAgICAgIC8vYW5pbWF0ZU5hdkJhY2tJY29uOiB0cnVlLFxuICAgICAgICBzd2lwZUJhY2tQYWdlOiBmYWxzZSxcbiAgICAgICAgLy8gRW5hYmxlIHRlbXBsYXRlcyBhdXRvIHByZWNvbXBpbGF0aW9uXG4gICAgICAgIHByZWNvbXBpbGVUZW1wbGF0ZXM6IHRydWUsXG4gICAgICAgIC8vIEVuYWJsZWQgcGFnZXMgcmVuZGVyaW5nIHVzaW5nIFRlbXBsYXRlN1xuICAgICAgICB0ZW1wbGF0ZTdQYWdlczogdHJ1ZSxcbiAgICAgICAgLy8gU3BlY2lmeSBUZW1wbGF0ZTcgZGF0YSBmb3IgcGFnZXNcbiAgICAgICAgbW9kYWxCdXR0b25DYW5jZWw6IF93Lmdsb2JhbC5idXR0b25zLmNhbmNlbFtMTl1cbn0pO1xuLy8gZ2xvYmFsXG52YXIgbiA9IHtcbiAgICBsYW5ndWFnZTonZW4nLFxuICAgIHBsYXRmb3JtOiBcImlPU1wiLFxuICAgIEpTQVBJOiBudWxsLFxuICAgIGZyZWU6IGZhbHNlLFxuICAgIHNldHRpbmdzOiBudWxsLFxuICAgIHNvdW5kczp7fSxcbiAgICBrZXlfc3RvcmFnZTp7XG4gICAgICAgIGNhdGVnb3JpZXM6XCJ0cmlwX29ialwiLFxuICAgICAgICBsYW5ndWFnZTpcInRyaXBfbGFuZ3VhZ2VcIlxuICAgIH1cbn07XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkge1xuICAgIC8vc3RvcmFnZUNsZWFyKCk7XG4gICAgLy8gSW5pdCBtZXRob2RcbiAgICBpZighc3RvcmFnZUdldChuLmtleV9zdG9yYWdlLmNhdGVnb3JpZXMpKXtcbiAgICAgICAgLy8g0LfQsNC90L7RgdC40Lwg0LrQsNGC0LXQs9C+0YDQuNC4INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXG4gICAgICAgIG15X2FwcC5jcmVhdGVBcnJheVN0b3JhZ2UoKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgICAgY29uc29sZS5sb2coJ2luaXQnKTtcblxuICAgIH1cblxuICAgIG4uSlNBUEkgPSBKU0FQSTtcbiAgICBuLkpTQVBJLmtlZXBTY3JlZW5PbigpO1xuICAgIG4uSlNBUEkuc2V0U3RhdHVzQmFyQ29sb3IoXCJibGFja1wiKTtcblxuXG4gICAgaWYobi5mcmVlKXtcbiAgICAgICAgYWRkUGFkZGluZ0J1bm5lcigpO1xuICAgIH1cbiAgICAvL3NldEludGVydmFsKHVwZGF0ZURhdGEsIDEwMDApO1xuXG4gICAgY29uc29sZS5sb2coJ2VuZCByZWFkeScpO1xuICAgIC8vIEluaXRpYWxpemUgYXBwXG4gICAgdmFyIGZ3N0FwcCA9IG15QXBwLFxuICAgICAgICAkJCA9IERvbTcsXG4gICAgICAgIGlwYyA9IG5ldyBteWFwcC5wYWdlcy5JbmRleFBhZ2VDb250cm9sbGVyKGZ3N0FwcCwgJCQpO1xuXG4gICAgJCQoZG9jdW1lbnQuYm9keSkub24oJ2NsaWNrJywnLnRvb2xiYXIgLmxpbmsnLCBmdW5jdGlvbihlKXtcbiAgICAgICAgY2xvc2VTZXR0aW5ncygpO1xuICAgIH0pO1xufSk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRldmljZVJlYWR5RXZlbnRcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBuLnNvdW5kcy50YXAgPSBuZXcgU291bmQoJ3NvdW5kcy90YXAubXAzJyk7XG4gICAgbi5zb3VuZHMudGFwLnZvbHVtZSgwLjUpO1xuICAgICQkKGRvY3VtZW50LmJvZHkpLm9uKCdjbGljaycsICcubmF2YmFyIC5saW5rLCAudG9vbGJhciAubGluaywgLnN1Ym5hdmJhciAudGFiLWxpbmsnLCBmdW5jdGlvbihlKXtcbiAgICAgICAgdmFyIHRoYXQgPSAkJCh0aGlzKTtcbiAgICAgICAgcG9pbnRlckV2ZW50KHRoYXQsICdub25lJyk7XG4gICAgICAgIHBsYXlTb3VuZChuLnNvdW5kcy50YXApO1xuICAgICAgICBwb2ludGVyRXZlbnQodGhhdCwgJ2F1dG8nLCAzMDApO1xuICAgIH0pO1xufSk7XG5cblxuIiwiLypcbiAqIERldmljZXMgcGxhdGZvcm1cbiAqL1xuXG52YXIgcGxhdGZvcm0gPSBnZXREZXZpY2UoKTtcblxuZnVuY3Rpb24gc2V0UGxhdGZvcm0oaW5wdXQpIHtcbiAgICBwbGF0Zm9ybSA9IGlucHV0O1xufVxuXG5mdW5jdGlvbiBnZXREZXZpY2UoKSB7XG4gICAgdmFyIHVhID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICB2YXIgYW5kcm9pZCA9IHVhLm1hdGNoKC8oQW5kcm9pZCk7P1tcXHNcXC9dKyhbXFxkLl0rKT8vKTtcbiAgICB2YXIgaXBhZCA9IHVhLm1hdGNoKC8oaVBhZCkuKk9TXFxzKFtcXGRfXSspLyk7XG4gICAgdmFyIGlwb2QgPSB1YS5tYXRjaCgvKGlQb2QpKC4qT1NcXHMoW1xcZF9dKykpPy8pO1xuICAgIHZhciBpcGhvbmUgPSAhaXBhZCAmJiB1YS5tYXRjaCgvKGlQaG9uZVxcc09TKVxccyhbXFxkX10rKS8pO1xuICAgIHZhciBtYWMgPSB1YS5tYXRjaCgvKE1hYyBPUyBYKS9pKTtcbiAgICB2YXIgZGV2aWNlID0ge1xuICAgIGlvczogaXBhZCB8fCBpcGhvbmUgfHwgaXBvZCxcbiAgICBhbmRyb2lkOiBhbmRyb2lkLFxuICAgIG1hYzogbWFjXG4gICAgfTtcbiAgICBcbiAgICBpZihkZXZpY2UuaW9zKSByZXR1cm4gXCJpb3NcIjtcbiAgICBpZihkZXZpY2UuYW5kcm9pZCkgcmV0dXJuIFwiYW5kcm9pZFwiO1xuICAgIGlmKGRldmljZS5tYWMpIHJldHVybiBcIm1hY1wiO1xufVxuXG5mdW5jdGlvbiBnZXRQbGF0Zm9ybSgpIHtcbiAgICBzd2l0Y2ggKHBsYXRmb3JtKSB7XG4gICAgICAgIGNhc2UgXCJhbmRyb2lkXCI6IGFsZXJ0KFwiQW5kcm9pZCBpcyBjdXJyZW50IHBsYXRmb3JtIVwiKTsgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJpb3NcIjogYWxlcnQoXCJpT1MgaXMgY3VycmVudCBwbGF0Zm9ybSFcIik7IGJyZWFrO1xuICAgICAgICBjYXNlIFwibWFjXCI6IGFsZXJ0KFwiTWFjIGlzIGN1cnJlbnQgcGxhdGZvcm0hXCIpOyBicmVhaztcbiAgICB9XG59XG5cbi8qXG4gKiBMb2NhbFN0b3JhZ2UgZnVuY3Rpb25zXG4gKi9cblxubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0gPSBmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAodHlwZW9mIE15SlMgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBNeUpTLmxvY2FsU3RvcmFnZURlbGV0ZWQoa2V5KTtcbiAgICAgICAgTXlKUy5sb2NhbFN0b3JhZ2VSZW1vdmVJdGVtKGtleSk7XG4gICAgfVxuICAgIFxuICAgIGlmICh0eXBlb2YgSlNBUEkuYnJpZGdlICE9IFwidW5kZWZpbmVkXCIpIEpTQVBJLmJyaWRnZShcInJlbW92ZUxvY2FsU3RvcmFnZUtleVwiKTtcbiAgICBcbiAgICBkZWxldGUgbG9jYWxTdG9yYWdlW2tleV07XG59XG5cbmxvY2FsU3RvcmFnZS5zZXRJdGVtID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIE15SlMubG9jYWxTdG9yYWdlQ2hhbmdlZChrZXkpOyAvLyBkZXByZWNhdGVkIG1ldGhvZCBmb3Igc3luY2hyb25pemF0aW9uIHdpdGggYXBwbGUgd2F0Y2hcbiAgICAgICAgTXlKUy5sb2NhbFN0b3JhZ2VTZXRJdGVtKGtleSwgdmFsdWUpO1xuICAgIH1cbiAgICBcbiAgICBpZiAodHlwZW9mIEpTQVBJLmJyaWRnZSAhPSBcInVuZGVmaW5lZFwiKSBKU0FQSS5icmlkZ2UoXCJsb2NhbFN0b3JhZ2VTZXRJdGVtXCIpO1xuICAgIGxvY2FsU3RvcmFnZVtrZXldID0gdmFsdWU7XG59XG5cbmxvY2FsU3RvcmFnZS5nZXRJdGVtID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIHJldHVybiBNeUpTLmxvY2FsU3RvcmFnZUdldEl0ZW0oa2V5KTtcbiAgICBcbiAgICBpZiAodHlwZW9mIEpTQVBJLmJyaWRnZSAhPSBcInVuZGVmaW5lZFwiKSByZXR1cm4gSlNBUEkuYnJpZGdlKFwibG9jYWxTdG9yYWdlR2V0SXRlbVwiKTtcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlW2tleV07XG59XG5cblN0b3JhZ2UucHJvdG90eXBlLmdldEtleXMgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodHlwZW9mIE15SlMgIT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIEpTT04ucGFyc2UoTXlKUy5nZXRMb2NhbFN0b3JhZ2VLZXlzKCkpO1xuICAgIGlmICh0eXBlb2YgSlNBUEkuYnJpZGdlICE9IFwidW5kZWZpbmVkXCIpIHJldHVybiBKU09OLnBhcnNlKEpTQVBJLmJyaWRnZShcImdldExvY2FsU3RvcmFnZUtleXNcIikpLmtleXM7XG4gICAgXG4gICAgdmFyIGtleXMgPSBbXTsgZm9yICh2YXIgaSA9IGxvY2FsU3RvcmFnZS5sZW5ndGg7IC0taT49MDspIGtleXMucHVzaChsb2NhbFN0b3JhZ2Uua2V5KGkpKTtcbiAgICByZXR1cm4ga2V5cztcbn1cblxuZnVuY3Rpb24gbG9jYWxTdG9yYWdlR2V0SXRlbShrZXkpIHtcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlW2tleV07XG59XG5cbmZ1bmN0aW9uIGxvY2FsU3RvcmFnZVNldEl0ZW0oa2V5LCB2YWx1ZSkge1xuICAgIGxvY2FsU3RvcmFnZVtrZXldID0gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGxvY2FsU3RvcmFnZUdldEtleXMoKSB7XG4gICAgdmFyIHN0ciA9ICcnO1xuICAgIGZvciAodmFyIGtleSBpbiBsb2NhbFN0b3JhZ2UpIHtcbiAgICAgICAgc3RyICs9IGtleSArIFwiLFwiXG4gICAgfVxuICAgIHN0ciA9IHN0ci5zbGljZSgwLCAtMSk7XG4gICAgcmV0dXJuIHN0cjtcbn1cblxuLypcbiAqIEdldHRpbmcgR0VUIGFyZ3VtZW50c1xuICovXG5cbnZhciBsb2NhbGVWYXIgPSBwYXJzZUdFVCgpWydsb2NhbGUnXTtcblxuZnVuY3Rpb24gcGFyc2VHRVQoKSB7XG4gICAgdmFyIHRtcCA9IG5ldyBBcnJheSgpO1xuICAgIHZhciB0bXAyID0gbmV3IEFycmF5KCk7XG4gICAgdmFyIGdldCA9IG5ldyBBcnJheSgpO1xuICAgIFxuICAgIHZhciB1cmwgPSBsb2NhdGlvbi5zZWFyY2g7XG4gICAgaWYgKHVybCAhPSAnJykge1xuICAgICAgICB0bXAgPSAodXJsLnN1YnN0cigxKSkuc3BsaXQoJyYnKTtcbiAgICAgICAgXG4gICAgICAgIGZvcih2YXIgaT0wOyBpIDwgdG1wLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0bXAyID0gdG1wW2ldLnNwbGl0KCc9Jyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGdldFt0bXAyWzBdXSA9IHRtcDJbMV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIGdldDtcbn1cblxuLypcbiAqIEV2ZW50IGJ1ZmZlciB2YXJpYWJsZXNcbiAqL1xuXG52YXIgYnVmZmVyRXZlbnRWYXIgPSB7XG5wYXRoOiBcIlwiLFxubG9uZ2l0dWRlOiAwLFxubGF0aXR1ZGU6IDAsXG5hbHRpdHVkZTogMCxcbnNwZWVkOiAwLFxubWFnbmV0aWNIZWFkaW5nOiAwLFxudHJ1ZUhlYWRpbmc6IDAsXG54OiAwLFxueTogMCxcbno6IDAsXG5iYXR0ZXJ5TGV2ZWw6IDAsXG5maWxlUGF0aDogXCJcIixcbmxvY2F0aW9uSW5mbzogXCJcIlxufTtcblxuZnVuY3Rpb24gZ2V0QnVmZmVyRXZlbnRWYXIoKSB7XG4gICAgcmV0dXJuIGJ1ZmZlckV2ZW50VmFyO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwgZGF0YSkge1xuICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICBldnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwgdHJ1ZSwgZmFsc2UsIGRhdGEpO1xuICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2dCk7XG59XG5cbi8qXG4gKiBFdmVudCBpbml0aWFsaXphdGlvblxuICovXG5cbnZhciBkZXZpY2VSZWFkeUV2ZW50O1xuXG52YXIgYXBwTWluaW1pemVFdmVudDtcbnZhciBhcHBNYXhpbWl6ZUV2ZW50O1xudmFyIGFwcENsb3NlRXZlbnQ7XG5cbnZhciBtYWduZXRpY0hlYWRpbmdFdmVudDtcbnZhciBsb2NhdGlvbkNoYW5nZWRFdmVudDtcbnZhciBhY2NlbGVyb21ldGVyQ2hhbmdlZEV2ZW50O1xudmFyIG1hZ25ldGljRmllbGRDaGFuZ2VkRXZlbnQ7XG5cbnZhciBiYXR0ZXJ5TGV2ZWxDaGFuZ2VkRXZlbnQ7XG5cbnZhciBtZW51QnV0dG9uRXZlbnQ7XG52YXIgYmFja0J1dHRvbkV2ZW50O1xudmFyIHZvbHVtZVVwRXZlbnQ7XG52YXIgdm9sdW1lRG93bkV2ZW50O1xuXG52YXIgY2FtZXJhQ2FwdHVyZWRJbWFnZUV2ZW50O1xudmFyIHBpY2tlZEltYWdlRXZlbnQ7XG52YXIgcGlja2VkSW1hZ2VFcnJvckV2ZW50O1xuXG52YXIgZG93bmxvYWRGaWxlRXZlbnQ7XG52YXIgZG93bmxvYWRGaWxlRXJyb3JFdmVudDtcblxudmFyIGxvY2F0aW9uSW5mb0V2ZW50O1xuXG52YXIgbWVkaWFQcmVwYXJlZEV2ZW50O1xuXG52YXIgcHJvdmlkZXJEaXNhYmxlZEV2ZW50O1xudmFyIHByb3ZpZGVyRW5hYmxlZEV2ZW50O1xudmFyIGFsYXJtRXZlbnQ7XG52YXIgZmlsZVBhcnRDb3B5RXZlbnQ7XG52YXIgZmluaXNoRmlsZUNvcHlFdmVudDtcbnZhciBmYWtlVXBkYXRlU3RhcnRlZDtcbnZhciBmYWtlVXBkYXRlRmluaXNoZWQ7XG52YXIgaGFuZE1vdmVFdmVudDtcbnZhciBwZWRvbWV0ckV2ZW50O1xudmFyIGNhbGxNb3ZlRXZlbnQ7XG5cbi8qXG4gKiBTb2NpYWxcbiAqL1xuXG52YXIgZ2V0UGFyYW1zRXZlbnQ7XG5cbi8qXG4gKiBJbi1BcHBzXG4gKi9cblxudmFyIHB1cmNoYXNlRXZlbnQ7XG52YXIgcHVyY2hhc2VFeGl0RXZlbnQ7XG52YXIgcHJvZHVjdERhdGFFdmVudDtcblxuLypcbiAqIEJhbm5lciBBZFxuICovXG5cbnZhciBhZENyb3NzQ2xpY2tlZEV2ZW50O1xudmFyIG9uQWREaXNhYmxlRXJyb3I7XG52YXIgb25BZERpc2FibGVkO1xuXG4vKlxuICogQ3JlYXRlIEV2ZW50c1xuICovXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZVJlYWR5RXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlUmVhZHlFdmVudC5pbml0RXZlbnQoJ2RldmljZVJlYWR5RXZlbnQnLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwTWluaW1pemVFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBNaW5pbWl6ZUV2ZW50LmluaXRFdmVudCgnYXBwTWluaW1pemVFdmVudCcsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBNYXhpbWl6ZUV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFwcE1heGltaXplRXZlbnQuaW5pdEV2ZW50KCdhcHBNYXhpbWl6ZUV2ZW50JywgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFwcENsb3NlRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwQ2xvc2VFdmVudC5pbml0RXZlbnQoJ2FwcENsb3NlRXZlbnQnLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWFnbmV0aWNIZWFkaW5nRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWFnbmV0aWNIZWFkaW5nRXZlbnQuaW5pdEV2ZW50KCdtYWduZXRpY0hlYWRpbmdFdmVudCcsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbkNoYW5nZWRFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbkNoYW5nZWRFdmVudC5pbml0RXZlbnQoJ2xvY2F0aW9uQ2hhbmdlZEV2ZW50JywgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFjY2VsZXJvbWV0ZXJDaGFuZ2VkRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjZWxlcm9tZXRlckNoYW5nZWRFdmVudC5pbml0RXZlbnQoJ2FjY2VsZXJvbWV0ZXJDaGFuZ2VkRXZlbnQnLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWFnbmV0aWNGaWVsZENoYW5nZWRFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBtYWduZXRpY0ZpZWxkQ2hhbmdlZEV2ZW50LmluaXRFdmVudCgnbWFnbmV0aWNGaWVsZENoYW5nZWRFdmVudCcsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICBiYXR0ZXJ5TGV2ZWxDaGFuZ2VkRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmF0dGVyeUxldmVsQ2hhbmdlZEV2ZW50LmluaXRFdmVudCgnYmF0dGVyeUxldmVsQ2hhbmdlZEV2ZW50JywgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1lbnVCdXR0b25FdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBtZW51QnV0dG9uRXZlbnQuaW5pdEV2ZW50KCdtZW51YnV0dG9uJywgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tCdXR0b25FdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrQnV0dG9uRXZlbnQuaW5pdEV2ZW50KCdiYWNrYnV0dG9uJywgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZvbHVtZVVwRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdm9sdW1lVXBFdmVudC5pbml0RXZlbnQoJ3ZvbHVtZXVwJywgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZvbHVtZURvd25FdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2b2x1bWVEb3duRXZlbnQuaW5pdEV2ZW50KCd2b2x1bWVkb3duJywgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNhbWVyYUNhcHR1cmVkSW1hZ2VFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjYW1lcmFDYXB0dXJlZEltYWdlRXZlbnQuaW5pdEV2ZW50KCdjYW1lcmFDYXB0dXJlZEltYWdlRXZlbnQnLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGlja2VkSW1hZ2VFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBwaWNrZWRJbWFnZUV2ZW50LmluaXRFdmVudCgncGlja2VkSW1hZ2VFdmVudCcsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwaWNrZWRJbWFnZUVycm9yRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGlja2VkSW1hZ2VFcnJvckV2ZW50LmluaXRFdmVudCgncGlja2VkSW1hZ2VFcnJvckV2ZW50JywgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRvd25sb2FkRmlsZUV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRvd25sb2FkRmlsZUV2ZW50LmluaXRFdmVudCgnZG93bmxvYWRGaWxlRXZlbnQnLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZG93bmxvYWRGaWxlRXJyb3JFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBkb3dubG9hZEZpbGVFcnJvckV2ZW50LmluaXRFdmVudCgnZG93bmxvYWRGaWxlRXJyb3JFdmVudCcsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbkluZm9FdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbkluZm9FdmVudC5pbml0RXZlbnQoJ2xvY2F0aW9uSW5mb0V2ZW50JywgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1lZGlhUHJlcGFyZWRFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBtZWRpYVByZXBhcmVkRXZlbnQuaW5pdEV2ZW50KCdtZWRpYVByZXBhcmVkJywgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVyRGlzYWJsZWRFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBwcm92aWRlckRpc2FibGVkRXZlbnQuaW5pdEV2ZW50KCdwcm92aWRlckRpc2FibGVkRXZlbnQnLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJFbmFibGVkRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZXJFbmFibGVkRXZlbnQuaW5pdEV2ZW50KCdwcm92aWRlckVuYWJsZWRFdmVudCcsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICBhbGFybUV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFsYXJtRXZlbnQuaW5pdEV2ZW50KCdhbGFybUV2ZW50JywgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVQYXJ0Q29weUV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVQYXJ0Q29weUV2ZW50LmluaXRFdmVudCgnZmlsZVBhcnRDb3B5RXZlbnQnLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZmluaXNoRmlsZUNvcHlFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBmaW5pc2hGaWxlQ29weUV2ZW50LmluaXRFdmVudCgnZmluaXNoRmlsZUNvcHlFdmVudCcsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICBmYWtlVXBkYXRlU3RhcnRlZCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBmYWtlVXBkYXRlU3RhcnRlZC5pbml0RXZlbnQoJ2Zha2VVcGRhdGVTdGFydGVkJywgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZha2VVcGRhdGVGaW5pc2hlZCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBmYWtlVXBkYXRlRmluaXNoZWQuaW5pdEV2ZW50KCdmYWtlVXBkYXRlRmluaXNoZWQnLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZE1vdmVFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kTW92ZUV2ZW50LmluaXRFdmVudCgnaGFuZE1vdmVFdmVudCcsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwZWRvbWV0ckV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBlZG9tZXRyRXZlbnQuaW5pdEV2ZW50KCdwZWRvbWV0ckV2ZW50JywgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxNb3ZlRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbE1vdmVFdmVudC5pbml0RXZlbnQoJ2NhbGxNb3ZlRXZlbnQnLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU29jaWFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGdldFBhcmFtc0V2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGdldFBhcmFtc0V2ZW50LmluaXRFdmVudCgnZ2V0UGFyYW1zRXZlbnQnLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMb2NhbFN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0SXRlbUNhbGxiYWNrID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNldEl0ZW1DYWxsYmFjay5pbml0RXZlbnQoJ3NldEl0ZW1DYWxsYmFjaycsIHRydWUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGdldEFsbENhbGxiYWNrID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGdldEFsbENhbGxiYWNrLmluaXRFdmVudCgnZ2V0QWxsQ2FsbGJhY2snLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJbi1BcHBzXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHB1cmNoYXNlRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcHVyY2hhc2VFdmVudC5pbml0RXZlbnQoJ3B1cmNoYXNlRXZlbnQnLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdERhdGFFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0RGF0YUV2ZW50LmluaXRFdmVudCgncHJvZHVjdERhdGFFdmVudCcsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwdXJjaGFzZUV4aXRFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBwdXJjaGFzZUV4aXRFdmVudC5pbml0RXZlbnQoJ3B1cmNoYXNlRXhpdEV2ZW50JywgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJhbm5lciBBZFxuICAgICAgICAgICAgICAgICAgICAgICAgICBhZENyb3NzQ2xpY2tlZEV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFkQ3Jvc3NDbGlja2VkRXZlbnQuaW5pdEV2ZW50KCdhZENyb3NzQ2xpY2tlZEV2ZW50JywgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQWREaXNhYmxlRXJyb3IgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25BZERpc2FibGVFcnJvci5pbml0RXZlbnQoJ29uQWREaXNhYmxlRXJyb3InLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25BZERpc2FibGVkID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIG9uQWREaXNhYmxlZC5pbml0RXZlbnQoJ29uQWREaXNhYmxlZCcsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDQktGB0YLRgNC10YLQuNC70LjRgdGMINGC0L7Qu9GM0LrQviDQsiDQsNC90LTRgNC+0LjQtCDQstC10YDRgdC40LggISEhXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNjcmVlbk9uRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyZWVuT25FdmVudC5pbml0RXZlbnQoJ3NjcmVlbk9uRXZlbnQnLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyZWVuT2ZmRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc2NyZWVuT2ZmRXZlbnQuaW5pdEV2ZW50KCdzY3JlZW5PZmZFdmVudCcsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LCBmYWxzZSk7XG5cbi8qXG4gKiBKU0FQSSBtZXRob2RzXG4gKi9cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwbGF0Zm9ybSA9PSBcImFuZHJvaWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIEpTQVBJID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBKU0FQSSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gYnJpZGdlKGZ1bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLmNhbGxlZS5jYWxsZXIuYXJndW1lbnRzLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXMgPSBwcm9tcHQoXCJqc2FwaS5cIitmdW5jLCBKU09OLnN0cmluZ2lmeShhcmdzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gSlNPTi5wYXJzZShyZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gKHJlcyAmJiByZXMucmVzdWx0KSA/IHJlcy5yZXN1bHQgOiBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShyZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJyaWRnZSA9IGJyaWRnZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTQVBJOiB0ZXN0KCkgdW5hdmFpbGFibGUgb24gQW5kcm9pZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNBUEk6IGxvZyhcXFwiXCIgKyBpbnB1dCArIFwiXFxcIikgdW5hdmFpbGFibGUgb24gQW5kcm9pZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMua2VlcFNjcmVlbk9uID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBicmlkZ2UoJ2tlZXBTY3JlZW5PbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVuc2V0U2NyZWVuT24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNBUEk6IHVuc2V0U2NyZWVuT24oKSB1bmF2YWlsYWJsZSBvbiBBbmRyb2lkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRGdWxsU2NyZWVuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBicmlkZ2UoJ3NldEZ1bGxTY3JlZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51bnNldEZ1bGxTY3JlZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyaWRnZSgndW5zZXRGdWxsU2NyZWVuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdHVzQmFyQ29sb3IgPSBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogc2V0U3RhdHVzQmFyQ29sb3IoXFxcIlwiICsgaW5wdXQgKyBcIlxcXCIpIHVuYXZhaWxhYmxlIG9uIEFuZHJvaWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEJ1dHRvbkhhbmRsZXIgPSBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJpZGdlKCdzZXRCdXR0b25IYW5kbGVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudW5zZXRCdXR0b25IYW5kbGVyID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyaWRnZSgndW5zZXRCdXR0b25IYW5kbGVyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVsb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTQVBJOiByZWxvYWQoKSB1bmF2YWlsYWJsZSBvbiBBbmRyb2lkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW5WaWJyYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTQVBJOiBjYW5WaWJyYXRlKCkgdW5hdmFpbGFibGUgb24gQW5kcm9pZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlicmF0ZSA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ3ZpYnJhdGlvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldERldmljZUlkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTQVBJOiBnZXREZXZpY2VJZCgpIHVuYXZhaWxhYmxlIG9uIEFuZHJvaWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dBZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnc2hvd0FkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVW5pdE5vdGlmID0gZnVuY3Rpb24odHlwZSwgdGltZSwgYWxhcm1JZCwgdGl0bGUsIHRleHQsIHRpY2tlclRleHQsIHZpYnJhdGlvblRpbWUsIHNvdW5kUGF0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnY3JlYXRlVW5pdE5vdGlmJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUmVwZWF0Tm90aWYgPSBmdW5jdGlvbih0eXBlLCB0aW1lLCB0aW1lSW50ZXJ2YWwsIGFsYXJtSWQsIHRpdGxlLCB0ZXh0LCB0aWNrZXJUZXh0LCB2aWJyYXRpb25UaW1lLCBzb3VuZFBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ2NyZWF0ZVJlcGVhdE5vdGlmJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlTXVsdGlwbGVOb3RpZiA9IGZ1bmN0aW9uKG5vdGlmTGlzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnY3JlYXRlTXVsdGlwbGVOb3RpZicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbmNlbE5vdGlmID0gZnVuY3Rpb24oYWxhcm1JZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnY2FuY2VsTm90aWYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRTZXR0aW5ncyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogZ2V0U2V0dGluZ3MoKSB1bmF2YWlsYWJsZSBvbiBBbmRyb2lkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNoYXJpbmc9ZnVuY3Rpb24odGV4dCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdzaGFyaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hhcmluZz1mdW5jdGlvbih0ZXh0LGltZyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdzaGFyaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2F2ZUltYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdzYXZlSW1hZ2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zYXZlRmlsZUZyb21VcmwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyaWRnZSgnc2F2ZUZpbGVGcm9tVXJsJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdGVuTG9jYXRpb24gPSBmdW5jdGlvbihtaW5UaW1lLCAgbWluRGlzdGFuY2UsIHByb3ZpZGVyU3RyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdsaXN0ZW5Mb2NhdGlvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3BMaXN0ZW5Mb2NhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnc3RvcExpc3RlbkxvY2F0aW9uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdGVuQWNjZWxlcm9tZXRlciA9IGZ1bmN0aW9uKGRlbGF5TWljcm9zZWMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ2xpc3RlbkFjY2VsZXJvbWV0ZXJGaWVsZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3BMaXN0ZW5BY2NlbGVyb21ldGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdzdG9wTGlzdGVuQWNjZWxlcm9tZXRlckZpZWxkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdGVuTWFnbmV0aWNGaWVsZCA9IGZ1bmN0aW9uKGRlbGF5TWljcm9zZWMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ2xpc3Rlbk1hZ25ldGljRmllbGQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9wTGlzdGVuTWFnbmV0aWNGaWVsZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnc3RvcExpc3Rlbk1hZ25ldGljRmllbGQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5waWNrUGhvdG8gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ3BpY2tQaG90bycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRha2VQaG90byA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgndGFrZVBob3RvJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV3TWVkaWEgPSBmdW5jdGlvbihsaW5rKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKFwiY3JlYXRlTWVkaWFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWVkaWFQbGF5ID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyaWRnZShcIm1lZGlhUGxheVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tZWRpYVN0b3AgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJpZGdlKFwibWVkaWFTdG9wXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1lZGlhUGF1c2UgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJpZGdlKFwibWVkaWFQYXVzZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tZWRpYVNldFZvbHVtZSA9IGZ1bmN0aW9uKGNvdW50LCBpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJpZGdlKFwibWVkaWFTZXRWb2x1bWVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWVkaWFTZWVrVG8gPSBmdW5jdGlvbihpZCwgdGltZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJpZGdlKFwibWVkaWFTZWVrVG9cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWVkaWFMb29wID0gZnVuY3Rpb24oaWQsIHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKFwibWVkaWFMb29wXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1lZGlhR2V0RHVyYXRpb24gPSBmdW5jdGlvbihtaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ21lZGlhR2V0RHVyYXRpb24nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tZWRpYUdldFBvc2l0aW9uID0gZnVuY3Rpb24obWlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdtZWRpYUdldFBvc2l0aW9uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWVkaWFSZWxlYXNlID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyaWRnZShcIm1lZGlhUmVsZWFzZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdTb3VuZCA9IGZ1bmN0aW9uKGxpbmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ25ld1NvdW5kJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGxheVNvdW5kID0gZnVuY3Rpb24oaWQsIHZvbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZShcInBsYXlTb3VuZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRWb2x1bWUgPSBmdW5jdGlvbihpZCwgdm9sdW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTQVBJOiBzZXRWb2x1bWUoaWQ6IFxcXCJcIitpZCtcIlxcXCIsIHZvbHVtZTogXFxcIlwiK3ZvbHVtZStcIlxcXCIpIHVuYXZhaWxhYmxlIG9uIEFuZHJvaWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXlMb29wZWRTb3VuZCA9IGZ1bmN0aW9uKGlkLCB2b2wpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoXCJwbGF5TG9vcGVkU291bmRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcFNvdW5kID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoXCJzdG9wU291bmRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNGbGFzaExpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdpc0ZsYXNoTGlnaHQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mbGFzaExpZ2h0T24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ2ZsYXNoTGlnaHRPbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZsYXNoTGlnaHRPZmYgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ2ZsYXNoTGlnaHRPZmYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mbGFzaExpZ2h0TGV2ZWwgPSBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogZmxhc2hMaWdodExldmVsKCkgdW5hdmFpbGFibGUgb24gQW5kcm9pZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U2NyZWVuQnJpZ2h0bmVzcyA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdzZXRTY3JlZW5CcmlnaHRuZXNzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0U2NyZWVuQnJpZ2h0bmVzcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnZ2V0U2NyZWVuQnJpZ2h0bmVzcycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldEJhdHRlcnlMZXZlbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnZ2V0QmF0dGVyeUxldmVsJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRCYXR0ZXJ5TGV2ZWxDaGFuZ2VkTGlzdGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdzdGFydEJhdHRlcnlMZXZlbENoYW5nZWRMaXN0ZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9wQmF0dGVyeUxldmVsQ2hhbmdlZExpc3RlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnc3RvcEJhdHRlcnlMZXZlbENoYW5nZWRMaXN0ZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhckNvb2tpZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ2NsZWFyQ29va2llcycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvYXN0ID0gZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgndG9hc3QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VPcmllbnRhdGlvbiA9IGZ1bmN0aW9uKG9yaWVudGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdjaGFuZ2VPcmllbnRhdGlvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldENvbnRhY3RMaXN0ID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdnZXRDb250YWN0TGlzdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldENhbGxMaXN0ID0gZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdnZXRDYWxsTGlzdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldEluU21zTGlzdCA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnZ2V0SW5TbXNMaXN0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0T3V0U21zTGlzdCA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnZ2V0T3V0U21zTGlzdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1ha2VQaG9uZUNhbGwgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ21ha2VQaG9uZUNhbGwnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU21zID0gZnVuY3Rpb24obnVtYmVyLG1zZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnc2VuZFNtcycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVVuaXRBbGFybSA9IGZ1bmN0aW9uKHR5cGUsdGltZSxhbGFybUlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdjcmVhdGVVbml0QWxhcm0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVSZXBlYXRBbGFybSA9IGZ1bmN0aW9uKHR5cGUsdGltZSx0aW1lSW50ZXJ2YWwsYWxhcm1JZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnY3JlYXRlUmVwZWF0QWxhcm0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW5jZWxBbGFybSA9IGZ1bmN0aW9uKGFsYXJtSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ2NhbmNlbEFsYXJtJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FuY2VsQWxhcm0gPSBmdW5jdGlvbihhbGFybUlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdjYW5jZWxBbGFybScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldEZpbGVMaXN0Rm9yRGlyID0gZnVuY3Rpb24oZGlyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdnZXRGaWxlTGlzdEZvckRpcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFNkRGlyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdnZXRTZERpcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFJvb3REaXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ2dldFJvb3REaXInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3B5ID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ2NvcHknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVEaXIgPSBmdW5jdGlvbihmb2xkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ2NyZWF0ZURpcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUZpbGUgPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdjcmVhdGVGaWxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlRmlsZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ2RlbGV0ZUZpbGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ21vdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRGaWxlU2l6ZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ2dldEZpbGVTaXplJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRMaXN0ZW5HZXN0dXJlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdzdGFydExpc3Rlbkdlc3R1cmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9wTGlzdGVuR2VzdHVyZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnc3RvcExpc3Rlbkdlc3R1cmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydExpc3RlblBlZG9tZXRyUGVyaW9kaWMgPSBmdW5jdGlvbihpbnRlcnZhbCxpc1NlbmRVbmlxT25seSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnc3RhcnRMaXN0ZW5QZWRvbWV0clBlcmlvZGljJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcExpc3RlblBlZG9tZXRyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdzdG9wTGlzdGVuUGVkb21ldHInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydExpc3RlbkNhbGxNb3ZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdzdGFydExpc3RlbkNhbGxNb3ZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcExpc3RlbkNhbGxNb3ZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdzdG9wTGlzdGVuQ2FsbE1vdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1NETW91bnRlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnaXNTRE1vdW50ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53cml0ZUZpbGVTRCA9IGZ1bmN0aW9uKGZpbGVQYXRoLCB0ZXh0LGlzQXBwZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCd3cml0ZUZpbGVTRCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFRleHRGcm9tRmlsZVNEID0gZnVuY3Rpb24oZmlsZVBhdGggKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdnZXRUZXh0RnJvbUZpbGVTRCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndyaXRlRmlsZUludGVybmFsID0gZnVuY3Rpb24oZmlsZVBhdGgsIHRleHQsIGlzQXBwZW5kICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnd3JpdGVGaWxlSW50ZXJuYWwnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRUZXh0RnJvbUZpbGVJbnRlcm5hbCA9IGZ1bmN0aW9uKGZpbGVQYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdnZXRUZXh0RnJvbUZpbGVJbnRlcm5hbCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4aXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ2V4aXQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuRGF0YWJhc2UgPSBmdW5jdGlvbihkYk5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ29wZW5EYXRhYmFzZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlRGF0YWJhc2UgPSBmdW5jdGlvbihkYk5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ29wZW5EYXRhYmFzZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZURhdGFiYXNlID0gZnVuY3Rpb24oZGJOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdkZWxldGVEYXRhYmFzZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJhd1F1ZXJ5ID0gZnVuY3Rpb24oZGJOYW1lLCBxdWVyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgncmF3UXVlcnknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5iZWdpblRyYW5zYWN0aW9uID0gZnVuY3Rpb24oZGJOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdiZWdpblRyYW5zYWN0aW9uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW5kVHJhbnNhY3Rpb24gPSBmdW5jdGlvbihkYk5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ2VuZFRyYW5zYWN0aW9uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VHJhbnNhY3Rpb25TdWNjZXNzZnVsID0gZnVuY3Rpb24oZGJOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdzZXRUcmFuc2FjdGlvblN1Y2Nlc3NmdWwnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRJblRhYmxlID0gZnVuY3Rpb24oZGJOYW1lLCB0YWJsZU5hbWUsIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ2luc2VydEluVGFibGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJblRhYmxlID0gZnVuY3Rpb24oZGJOYW1lLCB0YWJsZU5hbWUsIGRhdGEsd2hlcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ3VwZGF0ZUluVGFibGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVJblRhYmxlID0gZnVuY3Rpb24oZGJOYW1lLCB0YWJsZU5hbWUsd2hlcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ2RlbGV0ZUluVGFibGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRBY3RpdmVOZXR3b3JrTGlzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnZ2V0QWN0aXZlTmV0d29ya0xpc3QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRBdmFpbGFibGVOZXR3b3JrTGlzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnZ2V0QXZhaWxhYmxlTmV0d29ya0xpc3QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXN0TWV0aG9kMSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgndGVzdE1ldGhvZDEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXN0TWV0aG9kMiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgndGVzdE1ldGhvZDInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXN0TWV0aG9kMyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgndGVzdE1ldGhvZDMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcGVuVVJMaW5BcHBTdG9yZSA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTQVBJOiBvcGVuVVJMaW5BcHBTdG9yZSh1cmw6IFxcXCJcIitpbnB1dCtcIlxcXCIpIHVuYXZhaWxhYmxlIG9uIEFuZHJvaWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW5VUkxpbkJyb3dzZXIgPSBmdW5jdGlvbihsaW5rKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdvcGVuVVJMaW5Ccm93c2VyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHVzaEN1c3RvbUV2ZW50ID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ3B1c2hDdXN0b21FdmVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRvd25sb2FkRmlsZSA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTQVBJOiBkb3dubG9hZEZpbGUodXJsOiBcXFwiXCIraW5wdXQrXCJcXFwiKSB1bmF2YWlsYWJsZSBvbiBBbmRyb2lkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRMb2NhdGlvbkluZm8gPSBmdW5jdGlvbihsYXRpdHVkZSwgbG9uZ2l0dWRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdnZXRMb2NhdGlvbkluZm8nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW4tQXBwc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXJjaGFzZSA9IGZ1bmN0aW9uKHB1cmNoYXNlSWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgncHVyY2hhc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maXJtUmVjZWlwdCA9IGZ1bmN0aW9uKHJlY2VpcHRJZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdjb25maXJtUmVjZWlwdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlcXVlc3RQcm9kdWN0RGF0YSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdyZXF1ZXN0UHJvZHVjdERhdGEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWZyZXNoUHVyY2hhc2VzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoJ3JlZnJlc2hQdXJjaGFzZXMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmFubmVyIEFkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZUNyb3NzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBicmlkZ2UoJ2VuYWJsZUNyb3NzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzYWJsZUFkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBicmlkZ2UoJ2Rpc2FibGVBZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQWREaXNhYmxlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGJyaWRnZSgnaXNBZERpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ID09IFwidHJ1ZVwiKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFByb2plY3RGaWxlID0gZnVuY3Rpb24oZmlsZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignTm90IGF2YWlsYWJsZSBpbiBhbmRyb2lkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICog0J/RgNC+0LLQtdGA0LrQsCDQvdCw0LvQuNC40Y8g0LrQsNC80LXRgNGLINGDINC00LXQstCw0LnRgdCwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHRydWUsINC10YHQu9C4INC60LDQvNC10YDQsCDQtdGB0YLRjCDQuCBmYWxzZSwg0LXRgdC70Lgg0LXRkSDQvdC10YJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNEZXZpY2VDYW1lcmEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBicmlkZ2UoXCJoYXNEZXZpY2VDYW1lcmFcIikgPT0gXCJ0cnVlXCIgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vINCR0YvQu9C+INGC0L7Qu9GM0LrQviDQsiDQsNC90LTRgNC+0LjQtCAhISFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tHcHMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBicmlkZ2UoJ2NoZWNrR3BzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ID09IFwidHJ1ZVwiKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0dQU0VuYWJsZWQ9ZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdpc0dQU0VuYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc05ldHdvcmtFbmFibGVkPWZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnaXNOZXR3b3JrRW5hYmxlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldElzQWxsb3dPZmZTY3JlZW49ZnVuY3Rpb24oaXNBbGxvdyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnJpZGdlKCdzZXRJc0FsbG93T2ZmU2NyZWVuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRBdWRpb1JlY29yZD1mdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnc3RhcnRBdWRpb1JlY29yZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3BBdWRpb1JlY29yZD1mdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnc3RvcEF1ZGlvUmVjb3JkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRMaXN0ZW5TY3JlZW5Qb3dlcj1mdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnc3RhcnRMaXN0ZW5TY3JlZW5Qb3dlcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3BMaXN0ZW5TY3JlZW5Qb3dlcj1mdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJyaWRnZSgnc3RvcExpc3RlblNjcmVlblBvd2VyJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuSlNBUEkgPSBuZXcgSlNBUEkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKHdpbmRvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocGxhdGZvcm0gPT0gXCJpb3NcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIEpTQVBJID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBKU0FQSSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zb2xlKSBjb25zb2xlLmxvZyhcIkpTQVBJOiB0ZXN0KCkgaW52b2tlZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIE15SlMgIT0gXCJ1bmRlZmluZWRcIikgTXlKUy50ZXN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNBUEk6IGxvZyhcIiArIGlucHV0ICsgXCIpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIE15SlMubG9nKFwiSlNBUEk6IFwiKyBpbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMua2VlcFNjcmVlbk9uID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zb2xlKSBjb25zb2xlLmxvZyhcIkpTQVBJOiBrZWVwU2NyZWVuT24oKSBpbnZva2VkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSBNeUpTLnNldExvY2tEaXNhYmxlZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVuc2V0U2NyZWVuT24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IHVuc2V0U2NyZWVuT24oKSBpbnZva2VkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSBNeUpTLnNldExvY2tFbmFibGVkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RnVsbFNjcmVlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uc29sZSkgY29uc29sZS5sb2coXCJKU0FQSTogc2V0RnVsbFNjcmVlbigpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIE15SlMuaGlkZVN0YXR1c0JhcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVuc2V0RnVsbFNjcmVlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uc29sZSkgY29uc29sZS5sb2coXCJKU0FQSTogdW5zZXRGdWxsU2NyZWVuKCkgaW52b2tlZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIE15SlMgIT0gXCJ1bmRlZmluZWRcIikgTXlKUy5zaG93U3RhdHVzQmFyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdHVzQmFyQ29sb3IgPSBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uc29sZSkgY29uc29sZS5sb2coXCJKU0FQSTogc2V0U3RhdHVzQmFyQ29sb3IoXFxcIlwiK2lucHV0K1wiXFxcIikgaW52b2tlZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIE15SlMgIT0gXCJ1bmRlZmluZWRcIikgTXlKUy5zZXRTdGF0dXNCYXJDb2xvcihpbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QnV0dG9uSGFuZGxlciA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTQVBJOiBzZXRCdXR0b25IYW5kbGVyKCkgdW5hdmFpbGFibGUgb24gaU9TLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51bnNldEJ1dHRvbkhhbmRsZXIgPSBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogdW5zZXRCdXR0b25IYW5kbGVyKCkgdW5hdmFpbGFibGUgb24gaU9TLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IHJlbG9hZCgpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIE15SlMucmVsb2FkVmlldygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhblZpYnJhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IGNhblZpYnJhdGUoKSBpbnZva2VkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSByZXR1cm4gKE15SlMuY2FuVmlicmF0ZSgpID09IFwidHJ1ZVwiKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aWJyYXRlID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IHZpYnJhdGUoXCIgKyBpbnB1dCArIFwiKSBpbnZva2VkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSBNeUpTLnZpYnJhdGUoaW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldERldmljZUlkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zb2xlKSBjb25zb2xlLmxvZyhcIkpTQVBJOiBnZXREZXZpY2VJZCgpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIHJldHVybiBNeUpTLmdldERldmljZUlkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zb2xlKSBjb25zb2xlLmxvZyhcIkpTQVBJOiBzaG93QWQoKSBpbnZva2VkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSBNeUpTLnNob3dBZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVVuaXROb3RpZiA9IGZ1bmN0aW9uKG5vdGlmaWNhdGlvbk1vZGUsIG5vdFRpbWUsIG5vdGlmaWVySWQsIHRvcFRleHQsIHN0YXR1c0JhciwgZnVsbFRleHQsIHZpYnJhdGlvblRpbWUsIHNvdW5kTGluaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uc29sZSkgY29uc29sZS5sb2coXCJKU0FQSTogY3JlYXRlVW5pdE5vdGlmKG1vZGU6IFxcXCJcIitub3RpZmljYXRpb25Nb2RlK1wiXFxcIiwgdGltZTogXFxcIlwiK25vdFRpbWUrXCJcXFwiLCBJRDogXFxcIlwiK25vdGlmaWVySWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICtcIlxcXCIsIHRleHQ6IFxcXCJcIit0b3BUZXh0K1wiXFxcIiwgc3RhdHVzQmFyOiBcXFwiXCIrc3RhdHVzQmFyK1wiXFxcIiwgZnVsbFRleHQ6IFxcXCJcIitmdWxsVGV4dCtcIlxcXCIsIHZpYnJhdGlvblRpbWU6IFxcXCJcIit2aWJyYXRpb25UaW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArXCJcXFwiLCBzb3VuZDogXFxcIlwiK3NvdW5kTGluaytcIlxcXCIpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5vVGltZSA9IG5vdFRpbWUvMTAwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSBNeUpTLmNyZWF0ZU5vdGlmaWNhdGlvbndpdGhJZHdpdGhEYXRlKGZ1bGxUZXh0LCBub3RpZmllcklkLCBub1RpbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVJlcGVhdE5vdGlmID0gZnVuY3Rpb24obm90aWZpY2F0aW9uTW9kZSwgbm90VGltZSwgaW50ZXJ2YWwsIG5vdGlmaWVySWQsIHRvcFRleHQsIHN0YXR1c0JhciwgZnVsbFRleHQsIHZpYnJhdGlvblRpbWUsIHNvdW5kTGluaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uc29sZSkgY29uc29sZS5sb2coXCJKU0FQSTogY3JlYXRlVW5pdE5vdGlmKG1vZGU6IFxcXCJcIitub3RpZmljYXRpb25Nb2RlK1wiXFxcIiwgdGltZTogXFxcIlwiK25vdFRpbWUrXCJcXFwiLCBpbnRlcnZhbDogXFxcIlwiK2ludGVydmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArXCJcXFwiLCBJRDogXFxcIlwiK25vdGlmaWVySWQrXCJcXFwiLCB0ZXh0OiBcXFwiXCIrdG9wVGV4dCtcIlxcXCIsIHN0YXR1c0JhcjogXFxcIlwiK3N0YXR1c0JhcitcIlxcXCIsIGZ1bGxUZXh0OiBcXFwiXCIrZnVsbFRleHQrXCJcXFwiLCB2aWJyYXRpb25UaW1lOiBcXFwiXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICt2aWJyYXRpb25UaW1lK1wiXFxcIiwgc291bmQ6IFxcXCJcIitzb3VuZExpbmsrXCJcXFwiKSBpbnZva2VkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBub1RpbWUgPSBub3RUaW1lLzEwMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIE15SlMgIT0gXCJ1bmRlZmluZWRcIikgTXlKUy5jcmVhdGVSZXBlYXROb3RpZmljYXRpb253aXRoSWR3aXRoRGF0ZXdpdGhSZXBlYXRJbnRlcnZhbChmdWxsVGV4dCwgbm90aWZpZXJJZCwgbm9UaW1lLCBpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FuY2VsTm90aWYgPSBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uc29sZSkgY29uc29sZS5sb2coXCJKU0FQSTogY2FuY2VsTm90aWYoXCIgKyBpbnB1dCArIFwiKSBpbnZva2VkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSBNeUpTLmNhbmNlbE5vdGlmaWNhdGlvbihpbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0U2V0dGluZ3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IGdldE5vdGlmaWNhdGlvblNldHRpbmdzKCkgaW52b2tlZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIE15SlMgIT0gXCJ1bmRlZmluZWRcIikgTXlKUy5nZXROb3RpZmljYXRpb25TZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNoYXJpbmcgPSBmdW5jdGlvbiAodGV4dCwgaW1nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW1nQm9vbCA9IFwiZmFsc2VcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbWcpIGltZ0Jvb2wgPSBcInRydWVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IHNoYXJlKHRleHQ6IFxcXCJcIiArIHRleHQgKyBcIlxcXCIsIGltZzogXFxcIlwiICsgaW1nQm9vbCArIFwiXFxcIilcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIE15SlMgIT0gXCJ1bmRlZmluZWRcIikgTXlKUy5zaGFyaW5nd2l0aEltZyh0ZXh0LCBpbWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNhdmVJbWFnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogc2F2ZUltYWdlKCkgdW5hdmFpbGFibGUgb24gaU9TLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0ZW5Mb2NhdGlvbiA9IGZ1bmN0aW9uKG1pbkRlbGF5LCBtaW5EaXN0YW5jZSwgbG9jYXRpb25Qcm92aWRlcil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zb2xlKSBjb25zb2xlLmxvZyhcIkpTQVBJOiBsaXN0ZW5Mb2NhdGlvbihkZWxheTogXFxcIlwiK21pbkRlbGF5K1wiXFxcIiwgZGlzdGFuY2U6IFxcXCJcIittaW5EaXN0YW5jZStcIlxcXCIsIHByb3ZpZGVyOiBcXFwiXCIrbG9jYXRpb25Qcm92aWRlcitcIlxcXCIpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIE15SlMubGlzdGVuTG9jYXRpb24obG9jYXRpb25Qcm92aWRlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcExpc3RlbkxvY2F0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zb2xlKSBjb25zb2xlLmxvZyhcIkpTQVBJOiBzdG9wTGlzdGVuTG9jYXRpb24oKSBpbnZva2VkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSBNeUpTLnN0b3BMaXN0ZW5Mb2NhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxpc3RlbkFjY2VsZXJvbWV0ZXIgPSBmdW5jdGlvbihkZWxheU1pY3Jvc2VjKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zb2xlKSBjb25zb2xlLmxvZyhcIkpTQVBJOiBsaXN0ZW5BY2NlbGVyb21ldGVyKFwiK2RlbGF5TWljcm9zZWMrXCIpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIE15SlMubGlzdGVuQWNjZWxlcm9tZXRlcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3BMaXN0ZW5BY2NlbGVyb21ldGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zb2xlKSBjb25zb2xlLmxvZyhcIkpTQVBJOiBzdG9wTGlzdGVuQWNjZWxlcm9tZXRlcigpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIE15SlMuc3RvcExpc3RlbkFjY2VsZXJvbWV0ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0ZW5NYWduZXRpY0ZpZWxkID0gZnVuY3Rpb24oZGVsYXlNaWNyb3NlYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogbGlzdGVuTWFnbmV0aWNGaWVsZCgpIHVuYXZhaWxhYmxlIG9uIGlPUy5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcExpc3Rlbk1hZ25ldGljRmllbGQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNBUEk6IHN0b3BMaXN0ZW5NYWduZXRpY0ZpZWxkKCkgdW5hdmFpbGFibGUgb24gaU9TLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5waWNrUGhvdG8gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IHBpY2tQaG90bygpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIE15SlMuc2hvd1Bob3RvVmlldygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRha2VQaG90byA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uc29sZSkgY29uc29sZS5sb2coXCJKU0FQSTogdGFrZVBob3RvKCkgaW52b2tlZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIE15SlMgIT0gXCJ1bmRlZmluZWRcIikgTXlKUy50YWtlUGhvdG8oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdNZWRpYSA9IGZ1bmN0aW9uKGxpbmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IG5ld01lZGlhKFwiICsgbGluayArIFwiKSBpbnZva2VkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSByZXR1cm4gTXlKUy5uZXdTb3VuZChsaW5rKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tZWRpYVBsYXkgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uc29sZSkgY29uc29sZS5sb2coXCJKU0FQSTogbWVkaWFQbGF5KFwiK2lkK1wiKSBpbnZva2VkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSBNeUpTLnBsYXlNZWRpYShpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWVkaWFTdG9wID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IG1lZGlhU3RvcChcIitpZCtcIikgaW52b2tlZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIE15SlMgIT0gXCJ1bmRlZmluZWRcIikgTXlKUy5zdG9wU291bmQoaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1lZGlhUGF1c2UgPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uc29sZSkgY29uc29sZS5sb2coXCJKU0FQSTogbWVkaWFQYXVzZShcIitpZCtcIikgaW52b2tlZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIE15SlMgIT0gXCJ1bmRlZmluZWRcIikgTXlKUy5wYXVzZVNvdW5kKGlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tZWRpYVNldFZvbHVtZSA9IGZ1bmN0aW9uKGlkLCB2b2x1bWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IG1lZGlhU2V0Vm9sdW1lKFwiK3ZvbHVtZStcIiwgXCIraWQrXCIpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIE15SlMuY2hhbmdlVm9sdW1lKHZvbHVtZSwgaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1lZGlhU2Vla1RvID0gZnVuY3Rpb24oaWQsIHBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zb2xlKSBjb25zb2xlLmxvZyhcIkpTQVBJOiBtZWRpYVNlZWtUbyhcIitpZCtcIiwgXCIrcG9zaXRpb24rXCIpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIE15SlMuc2V0UG9zaXRpb24oaWQsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tZWRpYUxvb3AgPSBmdW5jdGlvbihpZCwgc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IG1lZGlhTG9vcChcIitpZCtcIiwgXCIrc3RhdGUrXCIpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIE15SlMuc2V0TG9vcChpZCwgc3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1lZGlhR2V0RHVyYXRpb24gPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uc29sZSkgY29uc29sZS5sb2coXCJKU0FQSTogbWVkaWFHZXREdXJhdGlvbihcIitpZCtcIikgaW52b2tlZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIE15SlMgIT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIE15SlMuZ2V0RHVyYXRpb24oaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1lZGlhR2V0UG9zaXRpb24gPSBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uc29sZSkgY29uc29sZS5sb2coXCJKU0FQSTogbWVkaWFHZXRQb3NpdGlvbihcIitpZCtcIikgaW52b2tlZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIE15SlMgIT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIE15SlMuZ2V0UG9zaXRpb24oaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1lZGlhUmVsZWFzZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTQVBJOiBtZWRpYVJlbGVhc2UoKSB1bmF2YWlsYWJsZSBvbiBpT1MuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5ld1NvdW5kID0gZnVuY3Rpb24obGluaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uc29sZSkgY29uc29sZS5sb2coXCJKU0FQSTogbmV3U291bmQoXCIgKyBsaW5rICsgXCIpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIHJldHVybiBNeUpTLm5ld1NvdW5kKGxpbmspO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXlTb3VuZCA9IGZ1bmN0aW9uKGlkLCB2b2x1bWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IHBsYXlTb3VuZChcIitpZCtcIiwgXCIrdm9sdW1lK1wiKSBpbnZva2VkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSBNeUpTLnBsYXlTb3VuZHdpdGhWb2x1bWUoaWQsIHZvbHVtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0Vm9sdW1lID0gZnVuY3Rpb24oaWQsIHZvbHVtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uc29sZSkgY29uc29sZS5sb2coXCJKU0FQSTogc2V0Vm9sdW1lKFwiK2lkK1wiLCBcIit2b2x1bWUrXCIpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIE15SlMuY2hhbmdlVm9sdW1lKGlkLCB2b2x1bWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXlMb29wZWRTb3VuZCA9IGZ1bmN0aW9uKGlkLCB2b2x1bWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IHBsYXlMb29wZWRTb3VuZChcIitpZCtcIiwgXCIrdm9sdW1lK1wiKSBpbnZva2VkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSBNeUpTLnBsYXlMb29wZWRTb3VuZHdpdGhWb2x1bWUoaWQsIHZvbHVtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RvcFNvdW5kID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IHN0b3BTb3VuZChcIiArIGlkICsgXCIpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIE15SlMuc3RvcFNvdW5kKGlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0ZsYXNoTGlnaHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IGlzRmxhc2hMaWdodCgpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIHJldHVybiAoTXlKUy5pc0ZsYXNoTGlnaHQoKSA9PSBcInRydWVcIikgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmxhc2hMaWdodE9uID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zb2xlKSBjb25zb2xlLmxvZyhcIkpTQVBJOiBmbGFzaExpZ2h0T24oKSBpbnZva2VkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSBNeUpTLmZsYXNoTGlnaHRPbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZsYXNoTGlnaHRPZmYgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IGZsYXNoTGlnaHRPZmYoKSBpbnZva2VkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSBNeUpTLmZsYXNoTGlnaHRPZmYoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mbGFzaExpZ2h0TGV2ZWwgPSBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uc29sZSkgY29uc29sZS5sb2coXCJKU0FQSTogZmxhc2hMaWdodExldmVsKFwiICsgaW5wdXQgKyBcIikgaW52b2tlZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIE15SlMgIT0gXCJ1bmRlZmluZWRcIikgTXlKUy5mbGFzaExpZ2h0TGV2ZWwoaW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFNjcmVlbkJyaWdodG5lc3MgPSBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uc29sZSkgY29uc29sZS5sb2coXCJKU0FQSTogc2V0U2NyZWVuQnJpZ2h0bmVzcyhcIiArIGlucHV0ICsgXCIpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIE15SlMuc2V0U2NyZWVuQnJpZ2h0bmVzcyhpbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0U2NyZWVuQnJpZ2h0bmVzcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uc29sZSkgY29uc29sZS5sb2coXCJKU0FQSTogZ2V0U2NyZWVuQnJpZ2h0bmVzcygpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIHJldHVybiBwYXJzZUludChNeUpTLmdldFNjcmVlbkJyaWdodG5lc3MoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0QmF0dGVyeUxldmVsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zb2xlKSBjb25zb2xlLmxvZyhcIkpTQVBJOiBnZXRCYXR0ZXJ5TGV2ZWwoKSBpbnZva2VkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSByZXR1cm4gcGFyc2VJbnQoTXlKUy5nZXRCYXR0ZXJ5TGV2ZWwoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRCYXR0ZXJ5TGV2ZWxDaGFuZ2VkTGlzdGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zb2xlKSBjb25zb2xlLmxvZyhcIkpTQVBJOiBzdGFydEJhdHRlcnlMZXZlbENoYW5nZWRMaXN0ZW4oKSBpbnZva2VkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSBNeUpTLnN0YXJ0QmF0dGVyeUxldmVsQ2hhbmdlZExpc3RlbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3BCYXR0ZXJ5TGV2ZWxDaGFuZ2VkTGlzdGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zb2xlKSBjb25zb2xlLmxvZyhcIkpTQVBJOiBzdG9wQmF0dGVyeUxldmVsQ2hhbmdlZExpc3RlbigpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIE15SlMuc3RvcEJhdHRlcnlMZXZlbENoYW5nZWRMaXN0ZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhckNvb2tpZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IGNsZWFyQ29va2llcygpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIE15SlMuY2xlYXJDb29raWVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG9hc3QgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTQVBJOiB0b2FzdChtZXNzYWdlOiBcXFwiXCIgKyBtZXNzYWdlICsgXCJcXFwiKSB1bmF2YWlsYWJsZSBvbiBpT1MuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZU9yaWVudGF0aW9uID0gZnVuY3Rpb24ob3JpZW50YXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNBUEk6IGNoYW5nZU9yaWVudGF0aW9uKG9yaWVudGF0aW9uOiBcXFwiXCIgKyBvcmllbnRhdGlvbiArIFwiXFxcIikgdW5hdmFpbGFibGUgb24gaU9TLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDb250YWN0TGlzdCA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogZ2V0Q29udGFjdExpc3QocGFyYW1zOiBcXFwiXCIgKyBwYXJhbXMgKyBcIlxcXCIpIHVuYXZhaWxhYmxlIG9uIGlPUy5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q2FsbExpc3QgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNBUEk6IGdldENhbGxMaXN0KHBhcmFtczogXFxcIlwiICsgcGFyYW1zICsgXCJcXFwiKSB1bmF2YWlsYWJsZSBvbiBpT1MuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldEluU21zTGlzdCA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogZ2V0SW5TbXNMaXN0KHBhcmFtczogXFxcIlwiICsgcGFyYW1zICsgXCJcXFwiKSB1bmF2YWlsYWJsZSBvbiBpT1MuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldE91dFNtc0xpc3QgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNBUEk6IGdldE91dFNtc0xpc3QocGFyYW1zOiBcXFwiXCIgKyBwYXJhbXMgKyBcIlxcXCIpIHVuYXZhaWxhYmxlIG9uIGlPUy5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFrZVBob25lQ2FsbCA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogbWFrZVBob25lQ2FsbChwYXJhbXM6IFxcXCJcIiArIHBhcmFtcyArIFwiXFxcIikgdW5hdmFpbGFibGUgb24gaU9TLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZW5kU21zID0gZnVuY3Rpb24obnVtYmVyLCBtc2cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNBUEk6IHNlbmRTbXMobnVtYmVyOiBcXFwiXCIgKyBudW1iZXIgKyBcIlxcXCIsIG1zZzogXFxcIlwiICsgbXNnICsgXCJcXFwiKSB1bmF2YWlsYWJsZSBvbiBpT1MuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVVuaXRBbGFybSA9IGZ1bmN0aW9uKHR5cGUsdGltZSxhbGFybUlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTQVBJOiBjcmVhdGVVbml0QWxhcm0odHlwZTogXFxcIlwiICsgdHlwZSArIFwiXFxcIiwgdGltZTogXFxcIlwiICsgdGltZSArIFwiXFxcIiwgYWxhcm1JZDogXFxcIlwiICsgYWxhcm1JZCArIFwiXFxcIikgdW5hdmFpbGFibGUgb24gaU9TLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVSZXBlYXRBbGFybSA9IGZ1bmN0aW9uKHR5cGUsdGltZSx0aW1lSW50ZXJ2YWwsYWxhcm1JZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogY3JlYXRlUmVwZWF0QWxhcm0odHlwZTogXFxcIlwiICsgdHlwZSArIFwiXFxcIiwgdGltZTogXFxcIlwiICsgdGltZSArIFwiXFxcIiwgdGltZUludGVydmFsOiBcXFwiXCIgKyB0aW1lSW50ZXJ2YWwgKyBcIlxcXCIsIGFsYXJtSWQ6IFxcXCJcIiArIGFsYXJtSWQgKyBcIlxcXCIpIHVuYXZhaWxhYmxlIG9uIGlPUy5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FuY2VsQWxhcm0gPSBmdW5jdGlvbihhbGFybUlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTQVBJOiBjYW5jZWxBbGFybShhbGFybUlkOiBcXFwiXCIgKyBhbGFybUlkICsgXCJcXFwiKSB1bmF2YWlsYWJsZSBvbiBpT1MuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldEZpbGVMaXN0Rm9yRGlyID0gZnVuY3Rpb24oZGlyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTQVBJOiBnZXRGaWxlTGlzdEZvckRpcihkaXI6IFxcXCJcIiArIGRpciArIFwiXFxcIikgdW5hdmFpbGFibGUgb24gaU9TLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRTZERpciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogZ2V0U2REaXIoKSB1bmF2YWlsYWJsZSBvbiBpT1MuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldFJvb3REaXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNBUEk6IGdldFJvb3REaXIoKSB1bmF2YWlsYWJsZSBvbiBpT1MuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcHkgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogY29weShmcm9tOiBcXFwiXCIgKyBmcm9tICsgXCJcXFwiLCB0bzogXFxcIlwiICsgdG8gKyBcIlxcXCIpIHVuYXZhaWxhYmxlIG9uIGlPUy5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlRGlyID0gZnVuY3Rpb24oZm9sZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTQVBJOiBjcmVhdGVEaXIoZm9sZGVyOiBcXFwiXCIgKyBmb2xkZXIgKyBcIlxcXCIpIHVuYXZhaWxhYmxlIG9uIGlPUy5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlRmlsZSA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNBUEk6IGNyZWF0ZUZpbGUocGF0aDogXFxcIlwiICsgcGF0aCArIFwiXFxcIikgdW5hdmFpbGFibGUgb24gaU9TLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVGaWxlID0gZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogZGVsZXRlRmlsZShwYXRoOiBcXFwiXCIgKyBwYXRoICsgXCJcXFwiKSB1bmF2YWlsYWJsZSBvbiBpT1MuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmUgPSBmdW5jdGlvbihmcm9tLCB0bykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogbW92ZShmcm9tOiBcXFwiXCIgKyBmcm9tICsgXCJcXFwiLCB0bzogXFxcIlwiICsgdG8gKyBcIlxcXCIpIHVuYXZhaWxhYmxlIG9uIGlPUy5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0RmlsZVNpemUgPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTQVBJOiBnZXRGaWxlU2l6ZShwYXRoOiBcXFwiXCIgKyBwYXRoICsgXCJcXFwiKSB1bmF2YWlsYWJsZSBvbiBpT1MuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0TGlzdGVuR2VzdHVyZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogc3RhcnRMaXN0ZW5HZXN0dXJlKCkgdW5hdmFpbGFibGUgb24gaU9TLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9wTGlzdGVuR2VzdHVyZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogc3RvcExpc3Rlbkdlc3R1cmUoKSB1bmF2YWlsYWJsZSBvbiBpT1MuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0TGlzdGVuUGVkb21ldHJQZXJpb2RpYyA9IGZ1bmN0aW9uKGludGVydmFsLCBpc1NlbmRVbmlxT25seSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogc3RhcnRMaXN0ZW5QZWRvbWV0clBlcmlvZGljKGludGVydmFsOiBcXFwiXCIgKyBpbnRlcnZhbCArIFwiXFxcIiwgaXNTZW5kVW5pcU9ubHk6IFxcXCJcIiArIGlzU2VuZFVuaXFPbmx5ICsgXCJcXFwiKSB1bmF2YWlsYWJsZSBvbiBpT1MuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3BMaXN0ZW5QZWRvbWV0ciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogc3RvcExpc3RlblBlZG9tZXRyKCkgdW5hdmFpbGFibGUgb24gaU9TLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydExpc3RlbkNhbGxNb3ZlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTQVBJOiBzdGFydExpc3RlbkNhbGxNb3ZlKCkgdW5hdmFpbGFibGUgb24gaU9TLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9wTGlzdGVuQ2FsbE1vdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNBUEk6IHN0b3BMaXN0ZW5DYWxsTW92ZSgpIHVuYXZhaWxhYmxlIG9uIGlPUy5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTRE1vdW50ZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNBUEk6IGlzU0RNb3VudGVkKCkgdW5hdmFpbGFibGUgb24gaU9TLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53cml0ZUZpbGVTRCA9IGZ1bmN0aW9uKGZpbGVQYXRoLCB0ZXh0LCBpc0FwcGVuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogd3JpdGVGaWxlU0QoZmlsZVBhdGg6IFxcXCJcIiArIGZpbGVQYXRoICsgXCJcXFwiLCB0ZXh0OiBcXFwiXCIgKyB0ZXh0ICsgXCJcXFwiLCBpc0FwcGVuZDogXFxcIlwiICsgaXNBcHBlbmQgKyBcIlxcXCIpIHVuYXZhaWxhYmxlIG9uIGlPUy5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0VGV4dEZyb21GaWxlU0QgPSBmdW5jdGlvbihmaWxlUGF0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogZ2V0VGV4dEZyb21GaWxlU0QoZmlsZVBhdGg6IFxcXCJcIiArIGZpbGVQYXRoICsgXCJcXFwiKSB1bmF2YWlsYWJsZSBvbiBpT1MuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndyaXRlRmlsZUludGVybmFsID0gZnVuY3Rpb24oZmlsZVBhdGgsIHRleHQsIGlzQXBwZW5kICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogd3JpdGVGaWxlSW50ZXJuYWwoZmlsZVBhdGg6IFxcXCJcIiArIGZpbGVQYXRoICsgXCJcXFwiLCB0ZXh0OiBcXFwiXCIgKyB0ZXh0ICsgXCJcXFwiLCBpc0FwcGVuZDogXFxcIlwiICsgaXNBcHBlbmQgKyBcIlxcXCIpIHVuYXZhaWxhYmxlIG9uIGlPUy5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0VGV4dEZyb21GaWxlSW50ZXJuYWwgPSBmdW5jdGlvbihmaWxlUGF0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogZ2V0VGV4dEZyb21GaWxlSW50ZXJuYWwoZmlsZVBhdGg6IFxcXCJcIiArIGZpbGVQYXRoICsgXCJcXFwiKSB1bmF2YWlsYWJsZSBvbiBpT1MuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4aXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNBUEk6IGV4aXQoKSB1bmF2YWlsYWJsZSBvbiBpT1MuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW5EYXRhYmFzZSA9IGZ1bmN0aW9uKGRiTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogb3BlbkRhdGFiYXNlKGRiTmFtZTogXFxcIlwiICsgZGJOYW1lICsgXCJcXFwiKSB1bmF2YWlsYWJsZSBvbiBpT1MuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlRGF0YWJhc2UgPSBmdW5jdGlvbihkYk5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNBUEk6IGNsb3NlRGF0YWJhc2UoZGJOYW1lOiBcXFwiXCIgKyBkYk5hbWUgKyBcIlxcXCIpIHVuYXZhaWxhYmxlIG9uIGlPUy5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlRGF0YWJhc2UgPSBmdW5jdGlvbihkYk5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNBUEk6IGRlbGV0ZURhdGFiYXNlKGRiTmFtZTogXFxcIlwiICsgZGJOYW1lICsgXCJcXFwiKSB1bmF2YWlsYWJsZSBvbiBpT1MuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJhd1F1ZXJ5ID0gZnVuY3Rpb24oZGJOYW1lLCBxdWVyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogcmF3UXVlcnkoZGJOYW1lOiBcXFwiXCIgKyBkYk5hbWUgKyBcIlxcXCIsIHF1ZXJ5OiBcXFwiXCIgKyBxdWVyeSArIFwiXFxcIikgdW5hdmFpbGFibGUgb24gaU9TLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5iZWdpblRyYW5zYWN0aW9uID0gZnVuY3Rpb24oZGJOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTQVBJOiBiZWdpblRyYW5zYWN0aW9uKGRiTmFtZTogXFxcIlwiICsgZGJOYW1lICsgXCJcXFwiKSB1bmF2YWlsYWJsZSBvbiBpT1MuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZFRyYW5zYWN0aW9uID0gZnVuY3Rpb24oZGJOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTQVBJOiBlbmRUcmFuc2FjdGlvbihkYk5hbWU6IFxcXCJcIiArIGRiTmFtZSArIFwiXFxcIikgdW5hdmFpbGFibGUgb24gaU9TLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRUcmFuc2FjdGlvblN1Y2Nlc3NmdWwgPSBmdW5jdGlvbihkYk5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNBUEk6IHNldFRyYW5zYWN0aW9uU3VjY2Vzc2Z1bChkYk5hbWU6IFxcXCJcIiArIGRiTmFtZSArIFwiXFxcIikgdW5hdmFpbGFibGUgb24gaU9TLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnNlcnRJblRhYmxlID0gZnVuY3Rpb24oZGJOYW1lLCB0YWJsZU5hbWUsIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNBUEk6IGluc2VydEluVGFibGUoZGJOYW1lOiBcXFwiXCIgKyBkYk5hbWUgKyBcIlxcXCIsIGRiTmFtZTogXFxcIlwiICsgZGJOYW1lICsgXCJcXFwiLCBkYk5hbWU6IFxcXCJcIiArIGRiTmFtZSArIFwiXFxcIikgdW5hdmFpbGFibGUgb24gaU9TLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJblRhYmxlID0gZnVuY3Rpb24oZGJOYW1lLCB0YWJsZU5hbWUsIGRhdGEsIHdoZXJlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTQVBJOiB1cGRhdGVJblRhYmxlKGRiTmFtZTogXFxcIlwiICsgZGJOYW1lICsgXCJcXFwiLCB0YWJsZU5hbWU6IFxcXCJcIiArIHRhYmxlTmFtZSArIFwiXFxcIiwgZGF0YTogXFxcIlwiICsgZGF0YSArIFwiXFxcIiwgd2hlcmU6IFxcXCJcIiArIHdoZXJlICsgXCJcXFwiKSB1bmF2YWlsYWJsZSBvbiBpT1MuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUluVGFibGUgPSBmdW5jdGlvbihkYk5hbWUsIHRhYmxlTmFtZSwgd2hlcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNBUEk6IGRlbGV0ZUluVGFibGUoZGJOYW1lOiBcXFwiXCIgKyBkYk5hbWUgKyBcIlxcXCIsIHRhYmxlTmFtZTogXFxcIlwiICsgdGFibGVOYW1lICsgXCJcXFwiLCB3aGVyZTogXFxcIlwiICsgd2hlcmUgKyBcIlxcXCIpIHVuYXZhaWxhYmxlIG9uIGlPUy5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0QWN0aXZlTmV0d29ya0xpc3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNBUEk6IGdldEFjdGl2ZU5ldHdvcmtMaXN0KCkgdW5hdmFpbGFibGUgb24gaU9TLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRBdmFpbGFibGVOZXR3b3JrTGlzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogZ2V0QXZhaWxhYmxlTmV0d29ya0xpc3QoKSB1bmF2YWlsYWJsZSBvbiBpT1MuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRlc3RNZXRob2QxID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkpTQVBJOiB0ZXN0TWV0aG9kMSgpIHVuYXZhaWxhYmxlIG9uIGlPUy5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGVzdE1ldGhvZDIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSlNBUEk6IHRlc3RNZXRob2QyKCkgdW5hdmFpbGFibGUgb24gaU9TLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXN0TWV0aG9kMyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJKU0FQSTogdGVzdE1ldGhvZDMoKSB1bmF2YWlsYWJsZSBvbiBpT1MuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW5VUkxpbkFwcFN0b3JlID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IG9wZW5VUkxpbkFwcFN0b3JlKHVybDogXFxcIlwiICsgaW5wdXQgKyBcIlxcXCIpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIE15SlMub3BlblVSTGluQXBwU3RvcmUoaW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW5VUkxpbkJyb3dzZXIgPSBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uc29sZSkgY29uc29sZS5sb2coXCJKU0FQSTogb3BlblVSTGluQnJvd3Nlcih1cmw6IFxcXCJcIiArIGlucHV0ICsgXCJcXFwiKSBpbnZva2VkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSBNeUpTLm9wZW5VUkxpbkJyb3dzZXIoaW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnB1c2hDdXN0b21FdmVudCA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zb2xlKSBjb25zb2xlLmxvZyhcIkpTQVBJOiBwdXNoQ3VzdG9tRXZlbnQoZXZlbnROYW1lOiBcXFwiXCIgKyBpbnB1dCArIFwiXFxcIikgaW52b2tlZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIE15SlMgIT0gXCJ1bmRlZmluZWRcIikgTXlKUy5wdXNoQ3VzdG9tRXZlbnQoaW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRvd25sb2FkRmlsZSA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zb2xlKSBjb25zb2xlLmxvZyhcIkpTQVBJOiBkb3dubG9hZEZpbGUodXJsOiBcXFwiXCIgKyBpbnB1dCArIFwiXFxcIikgaW52b2tlZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIE15SlMgIT0gXCJ1bmRlZmluZWRcIikgTXlKUy5kb3dubG9hZEZpbGUoaW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldExvY2F0aW9uSW5mbyA9IGZ1bmN0aW9uIChsYXRpdHVkZSwgbG9uZ2l0dWRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zb2xlKSBjb25zb2xlLmxvZyhcIkpTQVBJOiBnZXRMb2NhdGlvbkluZm8obGF0aXR1ZGU6IFxcXCJcIiArIGxhdGl0dWRlICsgXCJcXFwiLCBsb25naXR1ZGU6IFxcXCJcIiArIGxvbmdpdHVkZSArIFwiXFxcIikgaW52b2tlZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIE15SlMgIT0gXCJ1bmRlZmluZWRcIikgTXlKUy5nZXRMb2NhdGlvbkluZm9CeUxhdGl0dWRld2l0aExvbmdpdHVkZShsYXRpdHVkZSwgbG9uZ2l0dWRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW4tQXBwc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wdXJjaGFzZSA9IGZ1bmN0aW9uKHB1cmNoYXNlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IHB1cmNoYXNlKHB1cmNoYXNlSWQ6IFxcXCJcIiArIHB1cmNoYXNlSWQgKyBcIlxcXCIpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIE15SlMucHVyY2hhc2UocHVyY2hhc2VJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlybVJlY2VpcHQgPSBmdW5jdGlvbihyZWNlaXB0SWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IGNvbmZpcm1SZWNlaXB0KHJlY2VpcHRJZDogXFxcIlwiICsgcmVjZWlwdElkICsgXCJcXFwiKSBpbnZva2VkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSBNeUpTLmNvbmZpcm1SZWNlaXB0KHJlY2VpcHRJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVxdWVzdFByb2R1Y3REYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zb2xlKSBjb25zb2xlLmxvZyhcIkpTQVBJOiByZXF1ZXN0UHJvZHVjdERhdGEoKSBpbnZva2VkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSBNeUpTLnJlcXVlc3RQcm9kdWN0RGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2hQdXJjaGFzZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IHJlZnJlc2hQdXJjaGFzZXMoKSBpbnZva2VkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSBNeUpTLnJlZnJlc2hQdXJjaGFzZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmFubmVyIEFkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZUNyb3NzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zb2xlKSBjb25zb2xlLmxvZyhcIkpTQVBJOiBlbmFibGVDcm9zcygpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIE15SlMuZW5hYmxlQ3Jvc3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNhYmxlQWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnNvbGUpIGNvbnNvbGUubG9nKFwiSlNBUEk6IGRpc2FibGVBZCgpIGludm9rZWQuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBNeUpTICE9IFwidW5kZWZpbmVkXCIpIE15SlMuZGlzYWJsZUFkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNBZERpc2FibGVkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zb2xlKSBjb25zb2xlLmxvZyhcIkpTQVBJOiBkaXNhYmxlQWQoKSBpbnZva2VkLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTXlKUyAhPSBcInVuZGVmaW5lZFwiKSB2YXIgcmVzdWx0ID0gTXlKUy5pc0FkRGlzYWJsZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PSBcInRydWVcIikgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRQcm9qZWN0RmlsZSA9IGZ1bmN0aW9uKGZpbGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zb2xlKSBjb25zb2xlLmxvZyhcIkpTQVBJOiBnZXRQcm9qZWN0RmlsZShcXFwiXCIgKyBmaWxlTmFtZSArIFwiXFxcIikgaW52b2tlZC5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIE15SlMgIT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIE15SlMuZ2V0UHJvamVjdEZpbGUoZmlsZU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LkpTQVBJID0gbmV3IEpTQVBJKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9KSh3aW5kb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4vKlxuICogU291bmQgaW5pdGlhbGl6YXRpb25cbiAqL1xuXG5mdW5jdGlvbiBTb3VuZChsaW5rKSB7XG4gICAgXG4gICAgdGhpcy5pZCA9IEpTQVBJLm5ld1NvdW5kKGxpbmspO1xuICAgIHRoaXMubXZvbHVtZSA9IFwiMVwiO1xuICAgIFxuICAgIHRoaXMudm9sdW1lID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdGhpcy5tdm9sdW1lID0gXCJcIiArIGlucHV0O1xuICAgIH1cbiAgICBcbiAgICB0aGlzLnBsYXkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgSlNBUEkucGxheVNvdW5kKHRoaXMuaWQsIHRoaXMubXZvbHVtZSk7XG4gICAgfVxuICAgIFxuICAgIHRoaXMucGxheUxvb3BlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBKU0FQSS5wbGF5TG9vcGVkU291bmQodGhpcy5pZCwgdGhpcy5tdm9sdW1lKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5zdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIEpTQVBJLnN0b3BTb3VuZCh0aGlzLmlkKTtcbiAgICB9XG4gICAgXG59XG5cbi8qXG4gKiBNZWRpYSBpbml0aWFsaXphdGlvblxuICovXG5cbmZ1bmN0aW9uIE1lZGlhKGxpbmspIHtcbiAgICBcbiAgICB0aGlzLmlkID0gXCJcIiArIEpTQVBJLm5ld01lZGlhKGxpbmspO1xuICAgIHRoaXMuaXNQbGF5ZWQgPSBmYWxzZTtcbiAgICBcbiAgICB0aGlzLnBsYXkgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgSlNBUEkubWVkaWFQbGF5KHRoaXMuaWQpO1xuICAgICAgICB0aGlzLmlzUGxheWVkID0gdHJ1ZTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5sb29wID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgSlNBUEkubWVkaWFMb29wKHRoaXMuaWQsIHN0YXRlKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5zdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmlzUGxheWVkKSBKU0FQSS5tZWRpYVN0b3AodGhpcy5pZCk7XG4gICAgICAgIHRoaXMuaXNQbGF5ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5wYXVzZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5pc1BsYXllZCkgSlNBUEkubWVkaWFQYXVzZSh0aGlzLmlkKTtcbiAgICAgICAgdGhpcy5pc1BsYXllZCA9IGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLnZvbHVtZSA9IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgICAgIEpTQVBJLm1lZGlhU2V0Vm9sdW1lKFwiXCIrY291bnQsIHRoaXMuaWQpO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLnNlZWt0byA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICAgICAgSlNBUEkubWVkaWFTZWVrVG8odGhpcy5pZCwgXCJcIit0aW1lKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5kdXJhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gSlNBUEkubWVkaWFHZXREdXJhdGlvbih0aGlzLmlkKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5wb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gSlNBUEkubWVkaWFHZXRQb3NpdGlvbih0aGlzLmlkKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5yZWxlYXNlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIEpTQVBJLm1lZGlhUmVsZWFzZSh0aGlzLmlkKTtcbiAgICB9XG59XG5cbiJdfQ==
