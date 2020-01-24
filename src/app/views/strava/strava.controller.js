(function() {
  'use strict';

  angular
    .module('running')
    .controller('StravaController', MainController);

  /** @ngInject */
  function MainController( $http, $mdDialog,$document) {
    var vm = this;
    vm.title = "strava.html";

    $http.get('assets/data.json').success(function(data) {
      vm.remoteData            = data;
      vm.strava                = vm.remoteData.strava;
    });
    
  /*  $http({ method: 'JSONP', url: 'https://www.strava.com/api/v3/athletes/36194446/stats?per_page=1&access_token=45a64174484e9e7b99c8d5343ecb25f0451a3581&callback=JSON_CALLBACK' })
      .success(function (data) {
            console.log('hello', data);
            vm.athlete = data; // response data 
        }).
        error(function (data) {
            console.log(data);
        });
*/

    // FUNCTION DESCRIPTION
    vm.timelineClass                 = timelineClass;
    vm.openModal                     = openModal;


    function timelineClass(item){
      var result;
      if (item.id%2!=0)result="js--fadeInLeft";
      else result="js--fadeInRight";
      
      return result;
    }

    function openModal(item){
      var alert = $mdDialog.alert({
        template: 
          '<md-dialog>' +
          '<div style="text-align:center; padding:0px; ">' +
            '<div><img src="../assets/images/strava/'+item+'.png" style="width:100%;  max-width: 400px; padding:10px;" /></div>'+
            '<div><hr style="border-top: 1px solid green;"/>'+
            '    <md-button ng-click="vm.hide()" class="md-primary">' +
            '      Close' +
            '    </md-button>' +
            '</div>' +
            '</div>'+
          '</md-dialog>',
          parent: angular.element($document.body),
          clickOutsideToClose:true,
          controller: DialogController,
          controllerAs: "vm"
      });     
      
      $mdDialog
      .show( alert )
      .finally(function() {
        alert = undefined;
      });

      function DialogController($scope, $mdDialog) {
        var vm = this;
        vm.hide = function() {
          $mdDialog.hide();
        };
      }
    }


  }
})();
