/**
 * Created by user on 29.01.16.
 */

Framework7.prototype.plugins.settings = function (app, globalPluginParams) {
    'use strict';

    var $$ = Dom7,
        t7 = Template7,
        Settings_loc;
    Settings_loc = function (options) {
        this.data = {
            currentCurrency: 0,
            currencyArr: getCurrency()
        };

        var self = this,
            defaultTemplate,
            template,
            container,
            parentContainer,
            mainPagesContainer,
            storage,
            soundsBlock,
            notificationsBlock,
            currencyBlock,
            iconSounds,
            iconNotifications,
            checkBoxSounds,
            checkBoxNotifications,
            defaults = { };
        function getStorage(){
            if(storageGet(n.key_storage.categories)){
                storage = storageGet(n.key_storage.categories);
            }
            self.data.currentCurrency = storage.settings.currency;
        }
        function getSettings(){
            getStorage();
            var storageSettings = storage.settings;
            var obj = [];
            obj.push({
                title: "sounds",
                name: _w.settings[LN].sounds,
                status: storage.settings.sounds,
                icon: "sounds"
            });
            obj.push({
                title: "notifications",
                name: _w.settings[LN].notifications,
                status: storage.settings.notifications,
                icon: "notifications"
            });

            return obj;
        }
        function getCurrency(){
            var arr = [];
            $$.each(_w.currency[LN], function(i, val){
                arr.push({
                    name:val.name,
                    letter:val.letter
                });
            });
            return arr;
        }
        function initFirstStatusForSettings(status, icon, checkbox){
            if(status){
                icon.addClass('active');
            }else{
                icon.removeClass('active');
            }
            if(checkbox !== undefined){
                checkbox.prop('checked', status);
            }
            //$$('#ch-sounds').prop('checked', false);
        }
        function onChangeButtonAction(){
            checkBoxSounds.on('change', function(){
                storage = storageGet(n.key_storage.categories);
                storage.settings.sounds = $$(this).prop('checked');
                initFirstStatusForSettings(storage.settings.sounds, iconSounds);
                storageSet(n.key_storage.categories, storage);
            });
            checkBoxNotifications.on('change', function(){
                storage = storageGet(n.key_storage.categories);

                storage.settings.notifications = $$(this).prop('checked');
                if($$(this).prop('checked')){
                    createNotification();
                }
                else{
                    deleteNotification();
                }
                initFirstStatusForSettings(storage.settings.notifications, iconNotifications);
                storageSet(n.key_storage.categories, storage);
            });

        }
        function drowView(){
            getStorage();
            var storageSettings = storage.settings;
            initFirstStatusForSettings(storageSettings.sounds, iconSounds, checkBoxSounds);
            initFirstStatusForSettings(storageSettings.notifications, iconNotifications, checkBoxNotifications);

        }
        function initSettingsBlocks(){
            soundsBlock = $$('.li-sounds');
            notificationsBlock = $$('.li-notifications');
            currencyBlock = $$('.li-currency');
            iconSounds = soundsBlock.find('.icon-sounds');
            iconNotifications = notificationsBlock.find('.icon-notifications');
            checkBoxSounds = soundsBlock.find('input');
            checkBoxNotifications = notificationsBlock.find('input');
            drowView();
            onChangeButtonAction();
        }
        function ClickLiAction(){
            /*var that = $$(this);
            console.log('click li');
            //that.off('click', ClickLiAction);
            var virtual_list = mainPagesContainer.find('.virtual-list');
            var formData = myApp.formToJSON('.virtual-list');
            console.log(formData);*/
        }
        function initVirtualListClick(pageContainer){
            /*pageContainer = $$(pageContainer);
            var list_block;
            list_block = pageContainer.find('.list-block');
            console.log(list_block);*/
            //pageContainer.off('click','.virtual-list li', ClickLiAction);
            //pageContainer.on('click', '.virtual-list li', ClickLiAction);

        }
        function getCurrentCurrency(){
            var str = '';
            $$.each(self.data.currencyArr, function(i, val){
                if(i === storage.settings.currency){
                    str = val.name + " (" + val.letter + ")";
                }
            });
            return str;

        }
        function initClickDefaultSettings(){
            var button_block = $$('#clear-settings');
            button_block.on('click', InitClickDSettings);

        }
        function InitClickDSettings(){
            $$(this).off('click', InitClickDSettings);
            myApp.confirm(_w.messages.default_settings[LN].content, _w.messages.default_settings[LN].title,
                function (){
                    storage.settings.notifications = true;
                    storage.settings.sounds = true;
                    storage.settings.currency = 0;
                    storageSet(n.key_storage.categories, storage);
                    self.init();
                },
                function (){
                    console.log('cancel');
                    initClickDefaultSettings();
                }
            );
        }
        self.smartSelectCustomChange = function(pageContainer){
            pageContainer = $$(pageContainer);
            var inputs,
                value;
            inputs = pageContainer.find('.list-block li input');
            console.log(inputs);
            inputs.on('change', function(){
                console.log($$(this));
                value = Number($$(this).val());
                storage.settings.currency = value;
                storageSet(n.key_storage.categories, storage);
            });

        };
        self.init = function(){
            var context;
            var activeView = myApp.getCurrentView(3);
            parentContainer = $$(activeView.container).find('.page-settings');
            mainPagesContainer = $$(activeView.container).find('.pages');
            clearParentContainer(parentContainer);
            context = getSettings();
            var options_list = generateArray(1000);
            var cCur = getCurrentCurrency();
            container = $$(template({options: options, li:context, options_list:options_list, currentCurrency:cCur}));
            parentContainer.append(container);
            initSettingsBlocks();
            initClickDefaultSettings();
        };

        function generateArray() {
            var arr = [];
            var selected = '';
            var str;
            $$.each(self.data.currencyArr, function(i, val){
                selected = '';
                if(i === storage.settings.currency){
                    selected = 'selected';
                    str = "<option value="+i+" selected >"+ val.name + " (" + val.letter + ")" + "</option>";
                }
                else{
                    str = "<option value="+i+" >"+ val.name + " (" + val.letter + ")" + "</option>";
                }

                arr.push(str);
            });
            return arr.join("");
        }


        /**
         * Sets the default template
         *
         * @private
         */
        function defineDefaultTemplate() {
                defaultTemplate = '<div class="content-block-title">' + _w.global.pages_title[LN].index.title + ' <span>' + _w.dif_filds[LN].version + '</span></div>' +
                    '<div class="list-block">' +
                    '<ul>' +
                    '{{#each li}}' +
                        '<li class="li-{{title}}">' +
                            '<div class="item-content">' +
                                '<div class="item-inner">' +
                                    '<div class="item-title label">{{name}}</div>' +
                                    '<div class="item-input">' +
                                        '<label class="label-switch">' +
                                            '<input type="checkbox" id="ch-{{title}}">' +
                                                '<div class="checkbox"></div>' +
                                        '</label>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</li>' +
                    '{{/each}}' +
                        '<li>' +
                            '<a href="#" class="item-link smart-select" data-virtual-list="true" data-back-text=" " data-back-on-select="true">' +
                                '<select name="numbers">' +
                                    '{{options_list}}' +
                                '</select>' +
                                '<div class="item-content">' +
                                    '<div class="item-inner">' +
                                        '<div class="item-title">' + _w.settings[LN].currency + '</div>' +
                                        '<div class="item-after">{{currentCurrency}}</div>' +
                                    '</div>' +
                                '</div>' +
                            '</a>' +
                        '</li>' +
                    '</ul>' +
                '</div>' +
                '<p id="clear-settings"><a class="button" href="#">' + _w.global.buttons.clear[LN] + '</a></p>';

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
                if (!app._compiledTemplates.settings) {
                    app._compiledTemplates.settings = t7.compile(defaultTemplate);
                }
                template = app._compiledTemplates.settings;

            } else {
                template = t7.compile(options.template);
            }

        }


        (function () {
            applyOptions();
            defineDefaultTemplate();
            compileTemplate();
            self.init();
        }());

        return self;
    };

    app.settings = function (options) {
        return new Settings_loc(options);
    };
};

