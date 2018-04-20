(function() {
  'use strict';

  angular
    .module('running')
    .directive('acmeNavbar', acmeNavbar);

  /** @ngInject */
  function acmeNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      controller: NavbarController,
      controllerAs: 'navbar',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController($http, $location) {
      var vm = this;
      vm.isMobileShow     = false;

      $http.get('assets/data.json').success(function(data) {
        vm.remoteData           = data;
        vm.itemsInTopMenu       = vm.remoteData.itemsInTopMenu;
      });

    // FUNCTION DESCRIPTION
    vm.goTo                    = goTo;                           // check $location(path)
    vm.mobileMenu              = mobileMenu;

  // IMPLEMENTATION
    function goTo(page) {
      vm.isMobileShow==true? vm.isMobileShow=false:'';
      $location.path(page);
    }

    function mobileMenu(){
      vm.isMobileShow = !vm.isMobileShow;
    }

    }
  }
})();
