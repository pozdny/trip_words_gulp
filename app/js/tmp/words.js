/**
 * Created by user on 25.03.16.
 */
'use strict';
//задание языка
var LN;
LN = navigator.language.substr(0, 2);
if(LN !== "en" && LN !== "ru"){
    LN = "en";
}

var _w = {
    "global":{
        flashscreen:{
            title:{
                en:"Trip Words",
                ru:"Trip Words"
            },
            text:{
                en:"",
                ru:""
            }
        },
        pages_title:{
            en:{
                index:{
                    title: "Trip Words",
                    toolbar: "Home"
                },
                photo: "Quick Photo",
                statistics: "Statistics",
                settings: "Settings"
            },
            ru:{
                index:{
                    title: "Trip Words",
                    toolbar: "Главная"
                },
                photo: "Фото",
                statistics: "Статистика",
                settings: "Настройки"
            }
        },
        buttons:{
            back:{
                en:"Back",
                ru:"Назад"
            },
            cancel:{
                en:"Cancel",
                ru:"Отмена"
            }
        }
    },
    "dif_filds":{
        en:{
            name:"Name",
            filter: "Filter",
            search: "Search",
            cancel: "Cancel",
            version: "version 1.0",
            nothing_found: "Nothing found",
            date: "Date",
            done: "Done",
            days:{
                mn:"days",
                ed:"day"
            },
            hours:{
                mn:"hours",
                ed:"hour"
            },
            minutes:{
                mn:"minutes",
                ed:"minute"
            },
            seconds:{
                mn:"seconds",
                ed:"second"
            },
            month:"August"
        },
        ru:{
            name:"Название тренировки",
            filter: "Фильтр",
            search: "Поиск",
            cancel: "Отмена",
            version: "версия 1.0",
            nothing_found: "Ничего не найдено",
            date: "Дата",
            done: "Готово",
            days:{
                mn:"дней",
                ed:"день"
            },
            hours:{
                mn:"часов",
                ed:"час"
            },
            minutes:{
                mn:"минут",
                ed:"минута"
            },
            seconds:{
                mn:"секунд",
                ed:"секунда"
            } ,
            month:"Август"
        }
    },

    "notification": {
        en: {
            title: "Summer Games 2016",
            text: "Summer Games 2016",
            ticker_text: "Summer Games 2016"
        },
        ru: {
            title: "Летние Игры 2016",
            text: "Летние Игры 2016",
            ticker_text: "Летние Игры 2016"
        }
    },
    "settings":{
        en:{
            sounds: "Sounds",
            notifications:"Notifications",
            currency: "Currency"
        },
        ru:{
            sounds: "Звуки",
            notifications:"Напоминания",
            currency: "Валюта"
        }
    },
    "messages":{
        complete:{
            en:"Exercise finished",
            ru:"Упражнение закончено"
        },
        stop:{
            en:{
                title:"Finish exercise",
                content:"Are you sure?"
            },
            ru:{
                title:"Закончить упражнения",
                content:"Вы уверены?"
            }
        },
        select:{
            en:"Please, select at least one exercise!",
            ru:"Пожалуйста, выберите хотя бы одно упражнение!"
        },
        choose:{
            en:"Select planks",
            ru:"Выбор планок"
        },
        delete_statistic:{
            en:{
                title:"Delete all statistics",
                content:"Are you sure?"
            },
            ru:{
                title:"Удалить статистику",
                content:"Вы уверены?"
            }
        },
        default_settings:{
            en:{
                title:"Reset to defaults",
                content:"Are you sure?"
            },
            ru:{
                title:"Сброс настроек",
                content:"Вы уверены?"
            }
        },
        empty:{
            en:"No data",
            ru:"Нет данных"
        },
        delete:{
            en:"Delete",
            ru:"Удалить"
        },
        no_statistics:{
            en:"No Statistics",
            ru:"Нет статистики"
        }


    },
    "categories":{
        en:[
            {
                name:"Travel"
            },
            {
                name:"Hotel"
            },
            {
                name:"Food"
            },
            {
                name:"Vehicles"
            },
            {
                name:"Others"
            }
        ],
        ru:[
            {
                name:"Путешествие"
            },
            {
                name:"Отель"
            },
            {
                name:"Еда"
            },
            {
                name:"Локальный транспорт"
            },
            {
                name:"Прочие расходы"
            }
        ]
    }

};
