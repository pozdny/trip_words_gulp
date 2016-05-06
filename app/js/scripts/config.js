/**
 * Created by user on 26.04.16.
 */

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
        modalButtonCancel: _w.global.buttons.cancel[window.LN]
    });


//console.log(myApp);
// Export selectors engine
window.$$ = Dom7;
    var fw7ViewOptions = {
        dynamicNavbar: true,
        domCache: true,
        reloadPage: true
    };

var mainView = myApp.addView('.view-main', fw7ViewOptions),
    photoView = myApp.addView('.view-photo', fw7ViewOptions),
    infoView = myApp.addView('.view-statistics', fw7ViewOptions);

// global
window.n = {
    language:'en',
    platform: "iOS",
    JSAPI: null,
    free: false,
    settings: null,
    page_index:null,
    page_home:null,
    page_trip:null,
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
myApp.onPageReinit('index', function (page) {
    n.page_home.init();
});
myApp.onPageBack('add-trip', function(page){
    delete page.query.id;
});
myApp.onPageInit('add-trip', function (page) {
    console.log('pageinit');
    if(page.query.id){
        n.page_trip.init(page.query.id);
    }
    else{
        n.page_trip.init();
    }

});
myApp.onPageReinit('add-trip', function (page) {
    console.log('pagereinit');
    scrollToTop($$('#page-add-trip'));
    if(page.query.id){
        n.page_trip.init(page.query.id);
    }
    else{
        n.page_trip.init();
    }
});
$$('#view-main').on('show', function (page) {
    n.settings.init();
});
$$('#view-photo').on('show', function (page) {
    n.settings.init();
});
$$('#view-statistics').on('show', function (page) {
    n.settings.init();
});

myApp.onPageBeforeAnimation('*', function(page){
    if($$(page.container).hasClass('smart-select-page')){
        console.log('beforeAnimation');
        //console.log('smart-select');
        n.settings.smartSelectCustomChange(page.container);
    }
});
module.exports = {
    myApp: myApp

};