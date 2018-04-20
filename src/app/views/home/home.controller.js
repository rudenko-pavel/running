(function() {
  'use strict';

  angular
    .module('running')
    .controller('HomeController', MainController);

  /** @ngInject */
  function MainController( $facebook, $scope, $http,  $resource) {
    var vm = this;

    $scope.$on('fb.auth.authResponseChange', function() {
      $scope.status = $facebook.isConnected();
      if($scope.status) {
        $facebook.api('/me').then(function(user) {
          $scope.user = user;
        });
      }
    });

    $scope.loginToggle = function() {
      if($scope.status) {
        console.log('wdwdwdwd');
        $facebook.logout();
      } else {
        $facebook.login();
      }
    };

    $scope.getFriends = function() {
      if(!$scope.status) return;
      $facebook.cachedApi('/me/friends').then(function(friends) {
        $scope.friends = friends.data;
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
        console.log("senderNewRow",data);
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
