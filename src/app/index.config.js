(function() {
  'use strict';

  angular
    .module('running')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, $translateProvider,$mdDateLocaleProvider, $facebookProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    //$mdDateLocaleProvider
    $mdDateLocaleProvider.firstDayOfWeek = 1;
    $mdDateLocaleProvider.formatDate = function(date) {
      return moment(date).format('DD/MM/YYYY');
    };

    //$facebookProvider
    $facebookProvider.setAppId('161160107819496');
    $facebookProvider.setPermissions("email,user_likes,user_friends");



    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;

    var preferredLng;
    preferredLng = localStorage.getItem("languageStorage");
    preferredLng===null ? preferredLng = 'ru':'' ;

    $translateProvider.useStaticFilesLoader({
      prefix: 'assets/languages/locale-',
      suffix: '.json'
    });
    // set default language

    $translateProvider.preferredLanguage(preferredLng);
    $translateProvider.fallbackLanguage(preferredLng);
      // Enable escaping of HTML
    $translateProvider.useSanitizeValueStrategy('escape');

    if (preferredLng=='ru'){
      $mdDateLocaleProvider.months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
      $mdDateLocaleProvider.shortMonths = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
      $mdDateLocaleProvider.days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
      $mdDateLocaleProvider.shortDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    }
    if (preferredLng=='uk'){
      $mdDateLocaleProvider.months = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
      $mdDateLocaleProvider.shortMonths = ['Січ', 'Лют', 'Бер', 'Квіт', 'Трав', 'Черв', 'Лип', 'Серп', 'Вер', 'Жовт', 'Лист', 'Груд'];
      $mdDateLocaleProvider.days = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятница', 'Субота'];
      $mdDateLocaleProvider.shortDays = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    }

  }

})();
