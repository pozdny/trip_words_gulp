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


