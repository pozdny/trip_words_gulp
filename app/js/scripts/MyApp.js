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
        $$.each(language_arr, function(i, val){  console.log(i);
            category_arr = [];
            $$.each(categories, function(z, val1){    console.log(z);
                category_arr.push({
                    id: z,
                    name:_w.categories[val].name,
                    icon:z
                });
            });
            cat[val] = category_arr;
        });
        storage = {
            "settings":{
                "lenguage": n.language,
                "notifications": true,
                "sounds": true,
                "currency": 0
            },
            "categories":cat,
            "data":{
                 tripArr:[
                     {
                         "date_create": 1462437173681,
                         "name": "Trip 1",
                         "sum": 0
                     },
                     {
                         "date_create": 1462437175681,
                         "name": "Trip 2",
                         "sum": 2
                     },
                     {
                         "date_create": 1462437176681,
                         "name": "Trip 3",
                         "sum": 3
                     }]
            }
        };
        storageSet(n.key_storage.categories, storage);
        n.settings = myApp.settings({});
    }
}

function closeSettings(){
    var activeView = myApp.getCurrentView(3);
    switch(activeView.selector){
        case ".view-main":
            if(activeView.url === '#settings' || activeView.url === '#content-2'){
                clearPageSettings(activeView.selector);
                backPageForSettings('index', activeView);
            }
            break;
        case ".view-photo":
            if(activeView.url === '#settings' || activeView.url === '#content-2'){
                clearPageSettings(activeView.selector);
                backPageForSettings('photo', activeView);
            }
            break;
        case ".view-statistics":
            if(activeView.url === '#settings' || activeView.url === '#content-2'){
                clearPageSettings(activeView.selector);
                backPageForSettings('statistics', activeView);
            }
            break;
        default: '';

    }
}

function clearPageSettings(view){
    var page_settings = $$(view).find('.page-settings');
    if(page_settings.length > 0){
        page_settings.html('');
    }
}

module.exports = {
    createArrayStorage: createArrayStorage,
    closeSettings: closeSettings
};



