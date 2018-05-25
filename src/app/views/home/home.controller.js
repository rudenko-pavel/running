(function() {
  'use strict';

  angular
    .module('running')
    .controller('HomeController', MainController);

  /** @ngInject */
  function MainController( $facebook, $scope, $http,  $resource, $log) {
    var vm = this;

    $scope.$on('fb.auth.authResponseChange', function() {
      vm.status = $facebook.isConnected();
      if($scope.status) {
        $facebook.api('/me').then(function(user) {
          vm.user = user;
        });
      }
    });

    vm.loginToggle = function() {
      if($scope.status) {
        $log.info('wdwdwdwd');
        $facebook.logout();
      } else {
        $facebook.login();
      }
    };

    vm.getFriends = function() {
      if(!$scope.status) return;
      $facebook.cachedApi('/me/friends').then(function(friends) {
        vm.friends = friends.data;
      });
    }


    // Read here https://docs.angularjs.org/api/ngResource/service/$resource
    var Article = $resource('https://jsonplaceholder.typicode.com/posts/:id', {id:'@id'});


    vm.data = Article.query();

    // FUNCTION DESCRIPTION
    vm.senderNewRow   = senderNewRow;

    // IMPLEMENTATION
    function senderNewRow(article){

     var success = function(data) {
        $log.info("senderNewRow",data);
        vm.data.unshift(data);
        article.title = article.body = null;
        vm.data[2].$remove();
      };

    // Article.save(article, success);

     var art = new Article(article);
     art.$save(success);
    }
  }
})();
