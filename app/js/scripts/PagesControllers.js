/*jslint browser: true*/
/*global console*/


var myapp = myapp || {};
myapp.pages = myapp.pages || {};

myapp.pages.IndexPageController = function (app, $$) {
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

        welcomescreen = app.welcomescreen(welcomescreen_slides, options);
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
myapp.pages.HomePageController = function (app, $$, options) {
    'use strict';

    var t7 = Template7;

    this.data = {

    };

    var self = this,
        defaultTemplate,
        defaultTemplateEmpty,
        template,
        templateEmpty,
        container,
        containerEmpty,
        storage,
        tripArr,
        parentContainer,
        defaults = { };
    function getStorage(){
        if(storageGet(n.key_storage.categories)){
            storage = storageGet(n.key_storage.categories);
        }
    }
    function getCurrentCurrency(){
        var str = '';
        $$.each(n.settings.data.currencyArr, function(i, val){
            if(i === storage.settings.currency){
                str = val.letter;
            }
        });
        return str;

    }
    function drowEmpty(){
        console.log('empty');
        containerEmpty = $$(templateEmpty({}));
        parentContainer.append(containerEmpty);
    }
    function drowTripBlocks(){
        var context = {
                li:[]
            },
            trips = storage.data.tripArr,
            letter = getCurrentCurrency();
        sortArrayAsc(trips);
        $$.each(trips, function(i, val){
            context.li.push({
                name: val.name,
                id: val.date_create,
                sum: val.sum,
                date_create: new Date(val.date_create).getShortDateM()
            });
        });
        container = $$(template({li:context.li, delete_text:_w.messages.delete[LN], letter_currency: letter}));
        parentContainer.append(container);

        // delete items
        deleteTraining();

    }
    function deleteTraining(){
        $$('.swipeout').on('deleted', function () {
            var id = this.dataset.id;
            for(var i = 0; i < storage.data.tripArr.length; i++){
                console.log(storage.data.tripArr[i].date_create, Number(id));
                if(storage.data.tripArr[i].date_create === Number(id)){
                    storage.data.tripArr.splice(i, 1);
                    storageSet(n.key_storage.categories, storage);
                    break;
                }
            }
            storage = storageGet(n.key_storage.categories);
            console.log(storage);
            if(storage.data.tripArr.length === 0){
                self.init();
            }
        });
    }
    self.init = function(){
        parentContainer = $$('#page-home');
        clearParentContainer(parentContainer);
        getStorage();
        tripArr = storage.data.tripArr;
        if(!tripArr.length){
            drowEmpty();
        }
        else{
            drowTripBlocks();
        }

    };


    /**
     * Sets the defaults templates
     *
     * @private
     */
    function defineDefaultTemplate() {
        defaultTemplate = '<div class="list-block" id="trip-list-block">' +
                '<ul id="ul-trip-list">' +
                    '{{#each li}}' +
                    '<li class="media-item swipeout" data-id="{{id}}">' +
                        '<a href="#add-trip?id={{id}}" class="swipeout-content item-content">' +
                            '<div class="item-inner">' +
                                '<div class="item-first">' +
                                    '<div class="item-title-row">{{name}}</div>' +
                                    '<div class="item-text">{{date_create}}</div>' +
                                '</div>' +
                                '<div class="item-after">{{sum}} {{../letter_currency}}</div>' +
                            '</div>' +
                        '</a>' +
                        '<div class="swipeout-actions-right">' +
                            '<a href="#" class="swipeout-delete">{{../delete_text}}</a>' +
                        '</div>' +
                    '</li>' +
                    '{{/each}}' +
                '</ul>' +
            '</div>';
    }
    function defineDefaultTemplateEmpty() {
        defaultTemplateEmpty = '<div id="main-empty">' +
            '<div class="top">' + _w.messages.add[LN] +
                '<div class="arrow-top"></div>' +
            '</div>' +
            '<div class="middle"></div>' +
            '<div class="bottom"></div>' +
         '</div>';

    }
    /* Sets the options that were required
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
            if (!app._compiledTemplates.home) {
                app._compiledTemplates.home = t7.compile(defaultTemplate);
            }
            template = app._compiledTemplates.home;

        } else {
            template = t7.compile(options.template);
        }
        if (!app._compiledTemplates.empty_block) {
            app._compiledTemplates.empty_block = t7.compile(defaultTemplateEmpty);

        }
        templateEmpty = app._compiledTemplates.empty_block;

    }


    (function () {
        applyOptions();
        defineDefaultTemplate();
        defineDefaultTemplateEmpty();
        compileTemplate();
        self.init();
    }());

    return self;

};
myapp.pages.TripPageController = function (app, $$, options) {
    'use strict';
    var t7 = Template7;
    this.data = {};

    var self = this,
        defaultTemplate,
        template,
        container,
        currentId,
        storage,
        parentContainer,
        titlePageAddEdit,
        defaults = { };
    function getStorage(){
        if(storageGet(n.key_storage.categories)){
            storage = storageGet(n.key_storage.categories);
        }
    }
    function drowEmptyForm(){
        container = $$(template({}));
        parentContainer.append(container);
    }
    function drowFormWithData(){

    }
    self.init = function(id){
        parentContainer = $$('#page-add-trip');
        clearParentContainer(parentContainer);
        getStorage();
        titlePageAddEdit = $$('#add-edit-title');
        if(id === undefined){
            titlePageAddEdit.html(_w.global.pages_title[LN].add_trip);
            drowEmptyForm();
        }
        else{
            currentId = id;
            titlePageAddEdit.html(_w.global.pages_title[LN].edit_trip);
            drowFormWithData();
        }
    };

    /**
     * Sets the defaults templates
     *
     * @private
     */
    function defineDefaultTemplate() {
        defaultTemplate = '<form id="form-trip" class="list-block store-data">' +
            '<div class="list-block" id="name-trip">' +
                '<ul>' +
                    '<li>' +
                        '<div class="item-content">' +
                            '<div class="item-inner">' +
                                '<div class="item-input">' +
                                    '<input type="text" placeholder="' + _w.dif_filds[LN].name + '" name="name" id="nameTrip" {{#if name}} value="{{name}}" {{/if}}>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</li>' +
                '</ul>' +
            '</div>' +

            '<div class="content-block-title">' + _w.dif_filds[LN].limit_spend_sum + '</div>' +
            '<div class="list-block">' +
                '<ul>' +
                    '<li disabled="disabled">' +
                        '<div class="item-content">' +
                            '<div class="item-inner">' +
                                '<div class="item-input">' +
                                    '<input type="text" placeholder="' + _w.dif_filds[LN].spend_sum + '" name="spend_sum" id="spend_sum" value="{{spend_sum}}">' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</li>' +
                    '<li>' +
                        '<div class="item-content">' +
                            '<div class="item-inner">' +
                                '<div class="item-input">' +
                                    '<input type="text" placeholder="' + _w.dif_filds[LN].limit_sum + '" name="limit_sum" id="limit_sum" value="{{limit_sum}}">' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</li>' +
                '</ul>' +
            '</div>' +
            '</form>' +
            '<div class="content-block-title">' + _w.dif_filds[LN].categories + '</div>' +
            '<div class="list-block" id="categories-list">' +
                '<ul>' +
                    '<li>' +
                        '<div class="item-content">' +
                            '<div class="item-media">' +
                                '<i class="icon icon-back"></i>' +
                            '</div>' +
                            '<div class="item-inner">' +
                                '<div class="item-input">' +
                                    '<input type="text" placeholder="' + _w.dif_filds[LN].spend_sum + '" name="spend_sum" id="spend_sum" value="{{spend_sum}}">' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</li>' +
                    '<li>' +
                        '<div class="item-content">' +
                            '<div class="item-media">' +
                                '<i class="icon icon-back "></i>' +
                            '</div>' +
                            '<div class="item-inner">' +
                                '<div class="item-input">' +
                                    '<input type="text" placeholder="' + _w.dif_filds[LN].limit_sum + '" name="limit_sum" id="limit_sum" value="{{limit_sum}}">' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</li>' +
                '</ul>' +
            '</div>'
        ;
    }

    /* Sets the options that were required
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
            if (!app._compiledTemplates.add_trip) {
                app._compiledTemplates.add_trip = t7.compile(defaultTemplate);
            }
            template = app._compiledTemplates.add_trip;

        } else {
            template = t7.compile(options.template);
        }


    }


    (function () {
        applyOptions();
        defineDefaultTemplate();
        compileTemplate();

    }());

    return self;

};
module.exports = {
    page_index : myapp.pages.IndexPageController,
    page_home: myapp.pages.HomePageController,
    page_trip: myapp.pages.TripPageController
};