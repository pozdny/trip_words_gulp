'use strict';

/**
 * Created by user on 21.04.16.
 */
require('framework7');
var config = require('./config');
var my_app = require('./MyApp');
var welcomescreen_p = require('./welcomescreen');
var pages  = require('./IndexPageController');
var myapp = myapp || {};


document.addEventListener("DOMContentLoaded", function(event) {
    storageClear();
    // Init method
    if(!storageGet(n.key_storage.categories)){
        // заносим категории по умолчанию
        my_app.createArrayStorage(n);
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
        ipc = new pages.page_index(fw7App, $$);

    $$(document.body).on('click','.toolbar .link', function(e){
        //closeSettings();
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


