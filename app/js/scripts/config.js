/**
 * Created by user on 26.04.16.
 */
console.log('5555');
var myapp = myapp || {};

window.myApp = new Framework7(
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
console.log('789');
// Export selectors engine
window.$$ = Dom7;
    var fw7ViewOptions = {
        dynamicNavbar: true,
        domCache: true,
        reloadPage: true
    };

var mainView = myApp.addView('.view-main', fw7ViewOptions),
    photoView = myApp.addView('.view-photo', fw7ViewOptions),
    infoView = myApp.addView('.view-settings', fw7ViewOptions);

// global
window.n = {
    language:'en',
    platform: "iOS",
    JSAPI: null,
    free: false,
    settings: null,
    sounds:{},
    pickerInline: null,
    key_storage:{
        categories:"trip_obj",
        language:"trip_language"
    }
};

// установка языка
var LN = navigator.language.substr(0, 2);
n.language = LN;
if(LN !== "en" && LN !== "ru"){
    LN = "en";
    n.language = "en";
}
myApp.onPageInit('index', function (page) {
    //storageClear();
});

myApp.init();

