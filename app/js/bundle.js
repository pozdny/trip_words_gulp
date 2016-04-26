(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint browser: true*/
/*global console*/


var myapp = myapp || {};
myapp.pages = myapp.pages || {};

myapp.pages.IndexPageController = function (myapp, $$) {
    'use strict';

    // Welcomscreen method
    (function () {
           var options = {
                'bgcolor': '#fff',
                'fontcolor': '#589001',

                'onOpened': function () {
                },
                'onClosed': function () {
                }
            },
            welcomescreen_slides,
            welcomescreen;

        welcomescreen_slides = [
            {
                id: 'slide0',
                picture: '<div class="welcome-icon"><i class="icon icon-welcome"></i></div>',
                text: '',
                title: ''
            }

        ];

        welcomescreen = myapp.welcomescreen(welcomescreen_slides, options);
        $$(document).on('click', '.tutorial-close-btn', function () {
            welcomescreen.close();
        });

        $$('.tutorial-open-btn').click(function () {
            welcomescreen.open();
        });

        $$(document).on('click', '.tutorial-next-link', function (e) {
            welcomescreen.next();
        });

        $$(document).on('click', '.tutorial-previous-slide', function (e) {
            welcomescreen.previous();
        });

        // скрываем флеш скрин
        var welcom = $$('.welcomescreen-container');
        var hide_animation = function(){
            welcom.addClass('hideAnimation');
            var hide_welcomescreen = function(){
                welcomescreen.close();
            };
            delyed(hide_welcomescreen, 1000);
        };
        delyed(hide_animation,1500);


    }());



};

module.exports = {
    page_index : myapp.pages.IndexPageController
};
},{}],2:[function(require,module,exports){
/**
 * Created by user on 25.03.16.
 */
//var settings  = require('./settings');

function createArrayStorage(n){
    var storage = {};
    if(storageGet(n.key_storage.categories)) {
        storage = storageGet(n.key_storage.categories);
    }
    var emptyStorage = isEmptyObject(storage);
    if(emptyStorage){
        var categories = _w.categories;
        var cat = {},
            category_arr = [],
            language_arr = ["en", "ru"];
        $$.each(language_arr, function(i, val){
            category_arr = [];
            /*$$.each(categories, function(z, val1){
                category_arr.push({
                    id: z,
                    name:_w.categories[val][z].name,
                    icon:z
                });
            });
            cat[val] = category_arr;*/
        });
        storage = {
            "settings":{
                "lenguage": n.language,
                "notifications": true,
                "sounds": true,
                "currency": true
            },
            "categories":{},
            "data":{

            }
        };
        storageSet(n.key_storage.categories, storage);
        //n.settings = myApp.settings({});
    }
}

function closeSettings(){

}

module.exports = {
    createArrayStorage: createArrayStorage,
    closeSettings: closeSettings
};




},{}],3:[function(require,module,exports){
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


},{}],4:[function(require,module,exports){
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



},{"./IndexPageController":1,"./MyApp":2,"./config":3,"./welcomescreen":5,"framework7":"framework7"}],5:[function(require,module,exports){
/*jslint browser: true*/
/*global console, Framework7, alert, Dom7, Swiper, Template7*/

/**
 * A plugin for Framework7 to show a slideable welcome screen
 *
 * @module Framework7/prototype/plugins/welcomescreen
 * @author www.timo-ernst.net
 * @license MIT
 */

//console.log(Framework7.prototype);
Framework7.prototype.plugins.welcomescreen = function (app, globalPluginParams) {
    'use strict';
      // Variables in module scope
    var $$ = Dom7,
        t7 = Template7,
        Welcomescreen;

    // Click handler to close welcomescreen
    $$(document).on('click', '.close-welcomescreen', function (e) {
        e.preventDefault();
        var $wscreen = $$(this).parents('.welcomescreen-container');
        if ($wscreen.length > 0 && $wscreen[0].f7Welcomescreen) { $wscreen[0].f7Welcomescreen.close(); }
    });

    /*
     * Represents the welcome screen
     *
     * @class
     * @memberof module:Framework7/prototype/plugins/welcomescreen
     */
    Welcomescreen = function (slides, options) {

        // Private properties
        var self = this,
            defaultTemplate,
            template,
            container,
            swiper,
            swiperContainer,
            defaults = {
                closeButton: false,        // enabled/disable close button
                closeButtonText : 'Skip', // close button text
                cssClass: '',             // additional class on container
                pagination: false,         // swiper pagination
                loop: false,              // swiper loop
                open: true                // open welcome screen on init
            };

        /**
         * Initializes the swiper
         *
         * @private
         */
        function initSwiper() {
            swiper = new Swiper('.swiper-container', {
                direction: 'horizontal',
                loop: options.loop,
                pagination: options.pagination ? swiperContainer.find('.swiper-pagination') : undefined
            });
        }

        /**
         * Sets colors from options
         *
         * @private
         */
        function setColors() {
            if (options.bgcolor) {
                container.css({
                    'background-color': options.bgcolor,
                    'color': options.fontcolor
                });
            }
        }

        /**
         * Sets the default template
         *
         * @private
         */
        function defineDefaultTemplate() {
            defaultTemplate = '<div class="welcomescreen-container {{#if options.cssClass}}{{options.cssClass}}{{/if}}">' +
                '{{#if options.closeButton}}' +
                '<div class="welcomescreen-closebtn close-welcomescreen">{{options.closeButtonText}}</div>' +
                '{{/if}}' +
                '<div class="welcomescreen-swiper">' +
                '<div class="swiper-wrapper">' +
                '{{#each slides}}' +
                '<div class="swiper-slide flex-row align-main-start" {{#if id}}id="{{id}}"{{/if}}>' +
                '{{#if content}}' +
                '<div class="welcomescreen-content">{{content}}</div>' +
                '{{else}}' +
                '{{#if title}}' +
                '<div class="welcomescreen-title">{{title}}</div>' +
                '{{/if}}' +
                '{{#if picture}}' +
                '<div class="welcomescreen-picture">{{picture}}</div>' +
                '{{/if}}' +
                '{{#if text}}' +
                '<div class="welcomescreen-text">{{text}}</div>' +
                '{{/if}}' +
                '{{/if}}' +
                '</div>' +
                '{{/each}}' +
                '</div>' +
                '{{#if options.pagination}}' +
                '<div class="welcomescreen-pagination swiper-pagination"></div>' +
                '{{/if}}' +
                '</div>' +
                '</div>';
        }


        /**
         * Sets the options that were required
         *
         * @private
         */
        function applyOptions() {
            var def;
            options = options || {};
            for (def in defaults) {
                if (typeof options[def] === 'undefined') {
                    options[def] = defaults[def];
                }
            }
        }

        /**
         * Compiles the template
         *
         * @private
         */
        function compileTemplate() {
            if (!options.template) {
                // Cache compiled templates
                if (!app._compiledTemplates.welcomescreen) {
                    app._compiledTemplates.welcomescreen = t7.compile(defaultTemplate);
                }
                template = app._compiledTemplates.welcomescreen;
            } else {
                template = t7.compile(options.template);
            }
        }

        /**
         * Shows the welcome screen
         *
         * @public
         * @memberof module:Framework7/prototype/plugins/welcomescreen
         */
        self.open = function () {
            container = $$(template({options: options, slides: slides}));
            swiperContainer = container.find('.swiper-container');
            setColors();
            $$('body').append(container);
            //initSwiper();
            container[0].f7Welcomescreen = self;
            if (typeof options.onOpened === 'function') { options.onOpened(); }
        };

        /**
         * Hides the welcome screen
         *
         * @public
         * @memberof module:Framework7/prototype/plugins/welcomescreen
         */
        self.close = function () {
            if (swiper) {
                swiper.destroy(true); }
            if (container) { container.remove(); }
            container = swiperContainer = swiper = undefined;
            if (typeof options.onClosed === 'function') { options.onClosed(); }
        };

        /**
         * Shows the next slide
         *
         * @public
         * @memberof module:Framework7/prototype/plugins/welcomescreen
         */
        self.next = function () {
            if (swiper) { swiper.slideNext(); }
        };

        /**
         * Shows the previous slide
         *
         * @public
         * @memberof module:Framework7/prototype/plugins/welcomescreen
         */
        self.previous = function () {
            if (swiper) { swiper.slidePrev(); }
        };

        /**
         * Goes to the desired slide
         *
         * @param {number} index The slide to show
         * @public
         * @memberof module:Framework7/prototype/plugins/welcomescreen
         */
        self.slideTo = function (index) {
            if (swiper) { swiper.slideTo(index); }
        };

        /**
         * Initialize the instance
         *
         * @method init
         */
        (function () {
            defineDefaultTemplate();
            compileTemplate();
            applyOptions();

            // Open on init
            if (options.open) {
                self.open();
            }

        }());

        // Return instance
        return self;
    };


    app.welcomescreen = function (slides, options) {
        return new Welcomescreen(slides, options);
    };

};

module.exports = {
    welcomescreen_plugin : Framework7.prototype.plugins.welcomescreen
};
},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvc2NyaXB0cy9JbmRleFBhZ2VDb250cm9sbGVyLmpzIiwiYXBwL2pzL3NjcmlwdHMvTXlBcHAuanMiLCJhcHAvanMvc2NyaXB0cy9jb25maWcuanMiLCJhcHAvanMvc2NyaXB0cy9pbml0LmpzIiwiYXBwL2pzL3NjcmlwdHMvd2VsY29tZXNjcmVlbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qanNsaW50IGJyb3dzZXI6IHRydWUqL1xuLypnbG9iYWwgY29uc29sZSovXG5cblxudmFyIG15YXBwID0gbXlhcHAgfHwge307XG5teWFwcC5wYWdlcyA9IG15YXBwLnBhZ2VzIHx8IHt9O1xuXG5teWFwcC5wYWdlcy5JbmRleFBhZ2VDb250cm9sbGVyID0gZnVuY3Rpb24gKG15YXBwLCAkJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIFdlbGNvbXNjcmVlbiBtZXRob2RcbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAnYmdjb2xvcic6ICcjZmZmJyxcbiAgICAgICAgICAgICAgICAnZm9udGNvbG9yJzogJyM1ODkwMDEnLFxuXG4gICAgICAgICAgICAgICAgJ29uT3BlbmVkJzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ29uQ2xvc2VkJzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3ZWxjb21lc2NyZWVuX3NsaWRlcyxcbiAgICAgICAgICAgIHdlbGNvbWVzY3JlZW47XG5cbiAgICAgICAgd2VsY29tZXNjcmVlbl9zbGlkZXMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6ICdzbGlkZTAnLFxuICAgICAgICAgICAgICAgIHBpY3R1cmU6ICc8ZGl2IGNsYXNzPVwid2VsY29tZS1pY29uXCI+PGkgY2xhc3M9XCJpY29uIGljb24td2VsY29tZVwiPjwvaT48L2Rpdj4nLFxuICAgICAgICAgICAgICAgIHRleHQ6ICcnLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnJ1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIF07XG5cbiAgICAgICAgd2VsY29tZXNjcmVlbiA9IG15YXBwLndlbGNvbWVzY3JlZW4od2VsY29tZXNjcmVlbl9zbGlkZXMsIG9wdGlvbnMpO1xuICAgICAgICAkJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy50dXRvcmlhbC1jbG9zZS1idG4nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB3ZWxjb21lc2NyZWVuLmNsb3NlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQkKCcudHV0b3JpYWwtb3Blbi1idG4nKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB3ZWxjb21lc2NyZWVuLm9wZW4oKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcudHV0b3JpYWwtbmV4dC1saW5rJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHdlbGNvbWVzY3JlZW4ubmV4dCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy50dXRvcmlhbC1wcmV2aW91cy1zbGlkZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB3ZWxjb21lc2NyZWVuLnByZXZpb3VzKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vINGB0LrRgNGL0LLQsNC10Lwg0YTQu9C10Ygg0YHQutGA0LjQvVxuICAgICAgICB2YXIgd2VsY29tID0gJCQoJy53ZWxjb21lc2NyZWVuLWNvbnRhaW5lcicpO1xuICAgICAgICB2YXIgaGlkZV9hbmltYXRpb24gPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgd2VsY29tLmFkZENsYXNzKCdoaWRlQW5pbWF0aW9uJyk7XG4gICAgICAgICAgICB2YXIgaGlkZV93ZWxjb21lc2NyZWVuID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB3ZWxjb21lc2NyZWVuLmNsb3NlKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZGVseWVkKGhpZGVfd2VsY29tZXNjcmVlbiwgMTAwMCk7XG4gICAgICAgIH07XG4gICAgICAgIGRlbHllZChoaWRlX2FuaW1hdGlvbiwxNTAwKTtcblxuXG4gICAgfSgpKTtcblxuXG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHBhZ2VfaW5kZXggOiBteWFwcC5wYWdlcy5JbmRleFBhZ2VDb250cm9sbGVyXG59OyIsIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDI1LjAzLjE2LlxuICovXG4vL3ZhciBzZXR0aW5ncyAgPSByZXF1aXJlKCcuL3NldHRpbmdzJyk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUFycmF5U3RvcmFnZShuKXtcbiAgICB2YXIgc3RvcmFnZSA9IHt9O1xuICAgIGlmKHN0b3JhZ2VHZXQobi5rZXlfc3RvcmFnZS5jYXRlZ29yaWVzKSkge1xuICAgICAgICBzdG9yYWdlID0gc3RvcmFnZUdldChuLmtleV9zdG9yYWdlLmNhdGVnb3JpZXMpO1xuICAgIH1cbiAgICB2YXIgZW1wdHlTdG9yYWdlID0gaXNFbXB0eU9iamVjdChzdG9yYWdlKTtcbiAgICBpZihlbXB0eVN0b3JhZ2Upe1xuICAgICAgICB2YXIgY2F0ZWdvcmllcyA9IF93LmNhdGVnb3JpZXM7XG4gICAgICAgIHZhciBjYXQgPSB7fSxcbiAgICAgICAgICAgIGNhdGVnb3J5X2FyciA9IFtdLFxuICAgICAgICAgICAgbGFuZ3VhZ2VfYXJyID0gW1wiZW5cIiwgXCJydVwiXTtcbiAgICAgICAgJCQuZWFjaChsYW5ndWFnZV9hcnIsIGZ1bmN0aW9uKGksIHZhbCl7XG4gICAgICAgICAgICBjYXRlZ29yeV9hcnIgPSBbXTtcbiAgICAgICAgICAgIC8qJCQuZWFjaChjYXRlZ29yaWVzLCBmdW5jdGlvbih6LCB2YWwxKXtcbiAgICAgICAgICAgICAgICBjYXRlZ29yeV9hcnIucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGlkOiB6LFxuICAgICAgICAgICAgICAgICAgICBuYW1lOl93LmNhdGVnb3JpZXNbdmFsXVt6XS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBpY29uOnpcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2F0W3ZhbF0gPSBjYXRlZ29yeV9hcnI7Ki9cbiAgICAgICAgfSk7XG4gICAgICAgIHN0b3JhZ2UgPSB7XG4gICAgICAgICAgICBcInNldHRpbmdzXCI6e1xuICAgICAgICAgICAgICAgIFwibGVuZ3VhZ2VcIjogbi5sYW5ndWFnZSxcbiAgICAgICAgICAgICAgICBcIm5vdGlmaWNhdGlvbnNcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcInNvdW5kc1wiOiB0cnVlLFxuICAgICAgICAgICAgICAgIFwiY3VycmVuY3lcIjogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiY2F0ZWdvcmllc1wiOnt9LFxuICAgICAgICAgICAgXCJkYXRhXCI6e1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHN0b3JhZ2VTZXQobi5rZXlfc3RvcmFnZS5jYXRlZ29yaWVzLCBzdG9yYWdlKTtcbiAgICAgICAgLy9uLnNldHRpbmdzID0gbXlBcHAuc2V0dGluZ3Moe30pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY2xvc2VTZXR0aW5ncygpe1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNyZWF0ZUFycmF5U3RvcmFnZTogY3JlYXRlQXJyYXlTdG9yYWdlLFxuICAgIGNsb3NlU2V0dGluZ3M6IGNsb3NlU2V0dGluZ3Ncbn07XG5cblxuXG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyNi4wNC4xNi5cbiAqL1xuY29uc29sZS5sb2coJzU1NTUnKTtcbnZhciBteWFwcCA9IG15YXBwIHx8IHt9O1xuXG53aW5kb3cubXlBcHAgPSBuZXcgRnJhbWV3b3JrNyhcbiAgICB7XG4gICAgICAgIC8vcHVzaFN0YXRlOnRydWUsXG4gICAgICAgIGluaXQ6ZmFsc2UsXG4gICAgICAgIC8vdGFwSG9sZDogdHJ1ZSwgLy9lbmFibGUgdGFwIGhvbGQgZXZlbnRzXG4gICAgICAgIHJvdXRlcjogdHJ1ZSxcbiAgICAgICAgcmVsb2FkUGFnZXM6dHJ1ZSxcbiAgICAgICAgLy9hbmltYXRlTmF2QmFja0ljb246IHRydWUsXG4gICAgICAgIHN3aXBlQmFja1BhZ2U6IGZhbHNlLFxuICAgICAgICAvLyBFbmFibGUgdGVtcGxhdGVzIGF1dG8gcHJlY29tcGlsYXRpb25cbiAgICAgICAgcHJlY29tcGlsZVRlbXBsYXRlczogdHJ1ZSxcbiAgICAgICAgLy8gRW5hYmxlZCBwYWdlcyByZW5kZXJpbmcgdXNpbmcgVGVtcGxhdGU3XG4gICAgICAgIHRlbXBsYXRlN1BhZ2VzOiB0cnVlLFxuICAgICAgICAvLyBTcGVjaWZ5IFRlbXBsYXRlNyBkYXRhIGZvciBwYWdlc1xuICAgICAgICBtb2RhbEJ1dHRvbkNhbmNlbDogX3cuZ2xvYmFsLmJ1dHRvbnMuY2FuY2VsW0xOXVxuICAgIH0pO1xuY29uc29sZS5sb2coJzc4OScpO1xuLy8gRXhwb3J0IHNlbGVjdG9ycyBlbmdpbmVcbndpbmRvdy4kJCA9IERvbTc7XG4gICAgdmFyIGZ3N1ZpZXdPcHRpb25zID0ge1xuICAgICAgICBkeW5hbWljTmF2YmFyOiB0cnVlLFxuICAgICAgICBkb21DYWNoZTogdHJ1ZSxcbiAgICAgICAgcmVsb2FkUGFnZTogdHJ1ZVxuICAgIH07XG5cbnZhciBtYWluVmlldyA9IG15QXBwLmFkZFZpZXcoJy52aWV3LW1haW4nLCBmdzdWaWV3T3B0aW9ucyksXG4gICAgcGhvdG9WaWV3ID0gbXlBcHAuYWRkVmlldygnLnZpZXctcGhvdG8nLCBmdzdWaWV3T3B0aW9ucyksXG4gICAgaW5mb1ZpZXcgPSBteUFwcC5hZGRWaWV3KCcudmlldy1zZXR0aW5ncycsIGZ3N1ZpZXdPcHRpb25zKTtcblxuLy8gZ2xvYmFsXG53aW5kb3cubiA9IHtcbiAgICBsYW5ndWFnZTonZW4nLFxuICAgIHBsYXRmb3JtOiBcImlPU1wiLFxuICAgIEpTQVBJOiBudWxsLFxuICAgIGZyZWU6IGZhbHNlLFxuICAgIHNldHRpbmdzOiBudWxsLFxuICAgIHNvdW5kczp7fSxcbiAgICBwaWNrZXJJbmxpbmU6IG51bGwsXG4gICAga2V5X3N0b3JhZ2U6e1xuICAgICAgICBjYXRlZ29yaWVzOlwidHJpcF9vYmpcIixcbiAgICAgICAgbGFuZ3VhZ2U6XCJ0cmlwX2xhbmd1YWdlXCJcbiAgICB9XG59O1xuXG4vLyDRg9GB0YLQsNC90L7QstC60LAg0Y/Qt9GL0LrQsFxudmFyIExOID0gbmF2aWdhdG9yLmxhbmd1YWdlLnN1YnN0cigwLCAyKTtcbm4ubGFuZ3VhZ2UgPSBMTjtcbmlmKExOICE9PSBcImVuXCIgJiYgTE4gIT09IFwicnVcIil7XG4gICAgTE4gPSBcImVuXCI7XG4gICAgbi5sYW5ndWFnZSA9IFwiZW5cIjtcbn1cbm15QXBwLm9uUGFnZUluaXQoJ2luZGV4JywgZnVuY3Rpb24gKHBhZ2UpIHtcbiAgICAvL3N0b3JhZ2VDbGVhcigpO1xufSk7XG5cbm15QXBwLmluaXQoKTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMS4wNC4xNi5cbiAqL1xucmVxdWlyZSgnZnJhbWV3b3JrNycpO1xudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJyk7XG52YXIgbXlfYXBwID0gcmVxdWlyZSgnLi9NeUFwcCcpO1xudmFyIHdlbGNvbWVzY3JlZW5fcCA9IHJlcXVpcmUoJy4vd2VsY29tZXNjcmVlbicpO1xudmFyIHBhZ2VzICA9IHJlcXVpcmUoJy4vSW5kZXhQYWdlQ29udHJvbGxlcicpO1xudmFyIG15YXBwID0gbXlhcHAgfHwge307XG5cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBzdG9yYWdlQ2xlYXIoKTtcbiAgICAvLyBJbml0IG1ldGhvZFxuICAgIGlmKCFzdG9yYWdlR2V0KG4ua2V5X3N0b3JhZ2UuY2F0ZWdvcmllcykpe1xuICAgICAgICAvLyDQt9Cw0L3QvtGB0LjQvCDQutCw0YLQtdCz0L7RgNC40Lgg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cbiAgICAgICAgbXlfYXBwLmNyZWF0ZUFycmF5U3RvcmFnZShuKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgICAgY29uc29sZS5sb2coJ2luaXQnKTtcbiAgICB9XG5cbiAgICBuLkpTQVBJID0gSlNBUEk7XG4gICAgbi5KU0FQSS5rZWVwU2NyZWVuT24oKTtcbiAgICBuLkpTQVBJLnNldFN0YXR1c0JhckNvbG9yKFwiYmxhY2tcIik7XG5cbiAgICBpZihuLmZyZWUpe1xuICAgICAgICBhZGRQYWRkaW5nQnVubmVyKCk7XG4gICAgfVxuICAgIC8vc2V0SW50ZXJ2YWwodXBkYXRlRGF0YSwgMTAwMCk7XG5cbiAgICBjb25zb2xlLmxvZygnZW5kIHJlYWR5Jyk7XG4gICAgLy8gSW5pdGlhbGl6ZSBhcHBcblxuICAgIHZhciBmdzdBcHAgPSBteUFwcCxcbiAgICAgICAgJCQgPSBEb203LFxuICAgICAgICBpcGMgPSBuZXcgcGFnZXMucGFnZV9pbmRleChmdzdBcHAsICQkKTtcblxuICAgICQkKGRvY3VtZW50LmJvZHkpLm9uKCdjbGljaycsJy50b29sYmFyIC5saW5rJywgZnVuY3Rpb24oZSl7XG4gICAgICAgIC8vY2xvc2VTZXR0aW5ncygpO1xuICAgIH0pO1xuXG59KTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlUmVhZHlFdmVudFwiLCBmdW5jdGlvbihldmVudCkge1xuICAgIG4uc291bmRzLnRhcCA9IG5ldyBTb3VuZCgnc291bmRzL3RhcC5tcDMnKTtcbiAgICBuLnNvdW5kcy50YXAudm9sdW1lKDAuNSk7XG4gICAgJCQoZG9jdW1lbnQuYm9keSkub24oJ2NsaWNrJywgJy5uYXZiYXIgLmxpbmssIC50b29sYmFyIC5saW5rLCAuc3VibmF2YmFyIC50YWItbGluaycsIGZ1bmN0aW9uKGUpe1xuICAgICAgICB2YXIgdGhhdCA9ICQkKHRoaXMpO1xuICAgICAgICBwb2ludGVyRXZlbnQodGhhdCwgJ25vbmUnKTtcbiAgICAgICAgcGxheVNvdW5kKG4uc291bmRzLnRhcCk7XG4gICAgICAgIHBvaW50ZXJFdmVudCh0aGF0LCAnYXV0bycsIDMwMCk7XG4gICAgfSk7XG59KTtcblxuXG4iLCIvKmpzbGludCBicm93c2VyOiB0cnVlKi9cbi8qZ2xvYmFsIGNvbnNvbGUsIEZyYW1ld29yazcsIGFsZXJ0LCBEb203LCBTd2lwZXIsIFRlbXBsYXRlNyovXG5cbi8qKlxuICogQSBwbHVnaW4gZm9yIEZyYW1ld29yazcgdG8gc2hvdyBhIHNsaWRlYWJsZSB3ZWxjb21lIHNjcmVlblxuICpcbiAqIEBtb2R1bGUgRnJhbWV3b3JrNy9wcm90b3R5cGUvcGx1Z2lucy93ZWxjb21lc2NyZWVuXG4gKiBAYXV0aG9yIHd3dy50aW1vLWVybnN0Lm5ldFxuICogQGxpY2Vuc2UgTUlUXG4gKi9cblxuLy9jb25zb2xlLmxvZyhGcmFtZXdvcms3LnByb3RvdHlwZSk7XG5GcmFtZXdvcms3LnByb3RvdHlwZS5wbHVnaW5zLndlbGNvbWVzY3JlZW4gPSBmdW5jdGlvbiAoYXBwLCBnbG9iYWxQbHVnaW5QYXJhbXMpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgICAvLyBWYXJpYWJsZXMgaW4gbW9kdWxlIHNjb3BlXG4gICAgdmFyICQkID0gRG9tNyxcbiAgICAgICAgdDcgPSBUZW1wbGF0ZTcsXG4gICAgICAgIFdlbGNvbWVzY3JlZW47XG5cbiAgICAvLyBDbGljayBoYW5kbGVyIHRvIGNsb3NlIHdlbGNvbWVzY3JlZW5cbiAgICAkJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5jbG9zZS13ZWxjb21lc2NyZWVuJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB2YXIgJHdzY3JlZW4gPSAkJCh0aGlzKS5wYXJlbnRzKCcud2VsY29tZXNjcmVlbi1jb250YWluZXInKTtcbiAgICAgICAgaWYgKCR3c2NyZWVuLmxlbmd0aCA+IDAgJiYgJHdzY3JlZW5bMF0uZjdXZWxjb21lc2NyZWVuKSB7ICR3c2NyZWVuWzBdLmY3V2VsY29tZXNjcmVlbi5jbG9zZSgpOyB9XG4gICAgfSk7XG5cbiAgICAvKlxuICAgICAqIFJlcHJlc2VudHMgdGhlIHdlbGNvbWUgc2NyZWVuXG4gICAgICpcbiAgICAgKiBAY2xhc3NcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOkZyYW1ld29yazcvcHJvdG90eXBlL3BsdWdpbnMvd2VsY29tZXNjcmVlblxuICAgICAqL1xuICAgIFdlbGNvbWVzY3JlZW4gPSBmdW5jdGlvbiAoc2xpZGVzLCBvcHRpb25zKSB7XG5cbiAgICAgICAgLy8gUHJpdmF0ZSBwcm9wZXJ0aWVzXG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIGRlZmF1bHRUZW1wbGF0ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlLFxuICAgICAgICAgICAgY29udGFpbmVyLFxuICAgICAgICAgICAgc3dpcGVyLFxuICAgICAgICAgICAgc3dpcGVyQ29udGFpbmVyLFxuICAgICAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgY2xvc2VCdXR0b246IGZhbHNlLCAgICAgICAgLy8gZW5hYmxlZC9kaXNhYmxlIGNsb3NlIGJ1dHRvblxuICAgICAgICAgICAgICAgIGNsb3NlQnV0dG9uVGV4dCA6ICdTa2lwJywgLy8gY2xvc2UgYnV0dG9uIHRleHRcbiAgICAgICAgICAgICAgICBjc3NDbGFzczogJycsICAgICAgICAgICAgIC8vIGFkZGl0aW9uYWwgY2xhc3Mgb24gY29udGFpbmVyXG4gICAgICAgICAgICAgICAgcGFnaW5hdGlvbjogZmFsc2UsICAgICAgICAgLy8gc3dpcGVyIHBhZ2luYXRpb25cbiAgICAgICAgICAgICAgICBsb29wOiBmYWxzZSwgICAgICAgICAgICAgIC8vIHN3aXBlciBsb29wXG4gICAgICAgICAgICAgICAgb3BlbjogdHJ1ZSAgICAgICAgICAgICAgICAvLyBvcGVuIHdlbGNvbWUgc2NyZWVuIG9uIGluaXRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXRpYWxpemVzIHRoZSBzd2lwZXJcbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGluaXRTd2lwZXIoKSB7XG4gICAgICAgICAgICBzd2lwZXIgPSBuZXcgU3dpcGVyKCcuc3dpcGVyLWNvbnRhaW5lcicsIHtcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb246ICdob3Jpem9udGFsJyxcbiAgICAgICAgICAgICAgICBsb29wOiBvcHRpb25zLmxvb3AsXG4gICAgICAgICAgICAgICAgcGFnaW5hdGlvbjogb3B0aW9ucy5wYWdpbmF0aW9uID8gc3dpcGVyQ29udGFpbmVyLmZpbmQoJy5zd2lwZXItcGFnaW5hdGlvbicpIDogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIGNvbG9ycyBmcm9tIG9wdGlvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNldENvbG9ycygpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmJnY29sb3IpIHtcbiAgICAgICAgICAgICAgICBjb250YWluZXIuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiBvcHRpb25zLmJnY29sb3IsXG4gICAgICAgICAgICAgICAgICAgICdjb2xvcic6IG9wdGlvbnMuZm9udGNvbG9yXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgZGVmYXVsdCB0ZW1wbGF0ZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gZGVmaW5lRGVmYXVsdFRlbXBsYXRlKCkge1xuICAgICAgICAgICAgZGVmYXVsdFRlbXBsYXRlID0gJzxkaXYgY2xhc3M9XCJ3ZWxjb21lc2NyZWVuLWNvbnRhaW5lciB7eyNpZiBvcHRpb25zLmNzc0NsYXNzfX17e29wdGlvbnMuY3NzQ2xhc3N9fXt7L2lmfX1cIj4nICtcbiAgICAgICAgICAgICAgICAne3sjaWYgb3B0aW9ucy5jbG9zZUJ1dHRvbn19JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJ3ZWxjb21lc2NyZWVuLWNsb3NlYnRuIGNsb3NlLXdlbGNvbWVzY3JlZW5cIj57e29wdGlvbnMuY2xvc2VCdXR0b25UZXh0fX08L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAne3svaWZ9fScgK1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwid2VsY29tZXNjcmVlbi1zd2lwZXJcIj4nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInN3aXBlci13cmFwcGVyXCI+JyArXG4gICAgICAgICAgICAgICAgJ3t7I2VhY2ggc2xpZGVzfX0nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInN3aXBlci1zbGlkZSBmbGV4LXJvdyBhbGlnbi1tYWluLXN0YXJ0XCIge3sjaWYgaWR9fWlkPVwie3tpZH19XCJ7ey9pZn19PicgK1xuICAgICAgICAgICAgICAgICd7eyNpZiBjb250ZW50fX0nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIndlbGNvbWVzY3JlZW4tY29udGVudFwiPnt7Y29udGVudH19PC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJ3t7ZWxzZX19JyArXG4gICAgICAgICAgICAgICAgJ3t7I2lmIHRpdGxlfX0nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIndlbGNvbWVzY3JlZW4tdGl0bGVcIj57e3RpdGxlfX08L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAne3svaWZ9fScgK1xuICAgICAgICAgICAgICAgICd7eyNpZiBwaWN0dXJlfX0nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIndlbGNvbWVzY3JlZW4tcGljdHVyZVwiPnt7cGljdHVyZX19PC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJ3t7L2lmfX0nICtcbiAgICAgICAgICAgICAgICAne3sjaWYgdGV4dH19JyArXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJ3ZWxjb21lc2NyZWVuLXRleHRcIj57e3RleHR9fTwvZGl2PicgK1xuICAgICAgICAgICAgICAgICd7ey9pZn19JyArXG4gICAgICAgICAgICAgICAgJ3t7L2lmfX0nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAgICAgJ3t7L2VhY2h9fScgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAne3sjaWYgb3B0aW9ucy5wYWdpbmF0aW9ufX0nICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIndlbGNvbWVzY3JlZW4tcGFnaW5hdGlvbiBzd2lwZXItcGFnaW5hdGlvblwiPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICd7ey9pZn19JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xuICAgICAgICB9XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgb3B0aW9ucyB0aGF0IHdlcmUgcmVxdWlyZWRcbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGFwcGx5T3B0aW9ucygpIHtcbiAgICAgICAgICAgIHZhciBkZWY7XG4gICAgICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgICAgIGZvciAoZGVmIGluIGRlZmF1bHRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zW2RlZl0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbZGVmXSA9IGRlZmF1bHRzW2RlZl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvbXBpbGVzIHRoZSB0ZW1wbGF0ZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gY29tcGlsZVRlbXBsYXRlKCkge1xuICAgICAgICAgICAgaWYgKCFvcHRpb25zLnRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgLy8gQ2FjaGUgY29tcGlsZWQgdGVtcGxhdGVzXG4gICAgICAgICAgICAgICAgaWYgKCFhcHAuX2NvbXBpbGVkVGVtcGxhdGVzLndlbGNvbWVzY3JlZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgYXBwLl9jb21waWxlZFRlbXBsYXRlcy53ZWxjb21lc2NyZWVuID0gdDcuY29tcGlsZShkZWZhdWx0VGVtcGxhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IGFwcC5fY29tcGlsZWRUZW1wbGF0ZXMud2VsY29tZXNjcmVlbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgPSB0Ny5jb21waWxlKG9wdGlvbnMudGVtcGxhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNob3dzIHRoZSB3ZWxjb21lIHNjcmVlblxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6RnJhbWV3b3JrNy9wcm90b3R5cGUvcGx1Z2lucy93ZWxjb21lc2NyZWVuXG4gICAgICAgICAqL1xuICAgICAgICBzZWxmLm9wZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb250YWluZXIgPSAkJCh0ZW1wbGF0ZSh7b3B0aW9uczogb3B0aW9ucywgc2xpZGVzOiBzbGlkZXN9KSk7XG4gICAgICAgICAgICBzd2lwZXJDb250YWluZXIgPSBjb250YWluZXIuZmluZCgnLnN3aXBlci1jb250YWluZXInKTtcbiAgICAgICAgICAgIHNldENvbG9ycygpO1xuICAgICAgICAgICAgJCQoJ2JvZHknKS5hcHBlbmQoY29udGFpbmVyKTtcbiAgICAgICAgICAgIC8vaW5pdFN3aXBlcigpO1xuICAgICAgICAgICAgY29udGFpbmVyWzBdLmY3V2VsY29tZXNjcmVlbiA9IHNlbGY7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMub25PcGVuZWQgPT09ICdmdW5jdGlvbicpIHsgb3B0aW9ucy5vbk9wZW5lZCgpOyB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhpZGVzIHRoZSB3ZWxjb21lIHNjcmVlblxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6RnJhbWV3b3JrNy9wcm90b3R5cGUvcGx1Z2lucy93ZWxjb21lc2NyZWVuXG4gICAgICAgICAqL1xuICAgICAgICBzZWxmLmNsb3NlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHN3aXBlcikge1xuICAgICAgICAgICAgICAgIHN3aXBlci5kZXN0cm95KHRydWUpOyB9XG4gICAgICAgICAgICBpZiAoY29udGFpbmVyKSB7IGNvbnRhaW5lci5yZW1vdmUoKTsgfVxuICAgICAgICAgICAgY29udGFpbmVyID0gc3dpcGVyQ29udGFpbmVyID0gc3dpcGVyID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLm9uQ2xvc2VkID09PSAnZnVuY3Rpb24nKSB7IG9wdGlvbnMub25DbG9zZWQoKTsgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTaG93cyB0aGUgbmV4dCBzbGlkZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHVibGljXG4gICAgICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6RnJhbWV3b3JrNy9wcm90b3R5cGUvcGx1Z2lucy93ZWxjb21lc2NyZWVuXG4gICAgICAgICAqL1xuICAgICAgICBzZWxmLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoc3dpcGVyKSB7IHN3aXBlci5zbGlkZU5leHQoKTsgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTaG93cyB0aGUgcHJldmlvdXMgc2xpZGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHB1YmxpY1xuICAgICAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOkZyYW1ld29yazcvcHJvdG90eXBlL3BsdWdpbnMvd2VsY29tZXNjcmVlblxuICAgICAgICAgKi9cbiAgICAgICAgc2VsZi5wcmV2aW91cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChzd2lwZXIpIHsgc3dpcGVyLnNsaWRlUHJldigpOyB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdvZXMgdG8gdGhlIGRlc2lyZWQgc2xpZGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IFRoZSBzbGlkZSB0byBzaG93XG4gICAgICAgICAqIEBwdWJsaWNcbiAgICAgICAgICogQG1lbWJlcm9mIG1vZHVsZTpGcmFtZXdvcms3L3Byb3RvdHlwZS9wbHVnaW5zL3dlbGNvbWVzY3JlZW5cbiAgICAgICAgICovXG4gICAgICAgIHNlbGYuc2xpZGVUbyA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgaWYgKHN3aXBlcikgeyBzd2lwZXIuc2xpZGVUbyhpbmRleCk7IH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdGlhbGl6ZSB0aGUgaW5zdGFuY2VcbiAgICAgICAgICpcbiAgICAgICAgICogQG1ldGhvZCBpbml0XG4gICAgICAgICAqL1xuICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGVmaW5lRGVmYXVsdFRlbXBsYXRlKCk7XG4gICAgICAgICAgICBjb21waWxlVGVtcGxhdGUoKTtcbiAgICAgICAgICAgIGFwcGx5T3B0aW9ucygpO1xuXG4gICAgICAgICAgICAvLyBPcGVuIG9uIGluaXRcbiAgICAgICAgICAgIGlmIChvcHRpb25zLm9wZW4pIHtcbiAgICAgICAgICAgICAgICBzZWxmLm9wZW4oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KCkpO1xuXG4gICAgICAgIC8vIFJldHVybiBpbnN0YW5jZVxuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICB9O1xuXG5cbiAgICBhcHAud2VsY29tZXNjcmVlbiA9IGZ1bmN0aW9uIChzbGlkZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBXZWxjb21lc2NyZWVuKHNsaWRlcywgb3B0aW9ucyk7XG4gICAgfTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgd2VsY29tZXNjcmVlbl9wbHVnaW4gOiBGcmFtZXdvcms3LnByb3RvdHlwZS5wbHVnaW5zLndlbGNvbWVzY3JlZW5cbn07Il19
