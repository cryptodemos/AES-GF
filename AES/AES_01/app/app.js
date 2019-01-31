// app.js

// define our application and pull in ngRoute and ngAnimate
var myApp = angular.module('myApp', [
  'ngRoute',
  'ngAnimate',
  'myApp.view1',
  'myApp.view2',
  //'myApp.version',
  'ngMaterial',
  'ngMessages',
  'ngCookies',
  'ngToast'
   // 'material.svgAssetsCache'
]);

// ROUTING ===============================================
// set our routing for this application
// each route will pull in a different controller
myApp.config(function($routeProvider) {

  $routeProvider

  // home page
      .when('/', {
        templateUrl: 'page-home.html',
        controller: 'mainController'
      })

      // input page
      .when('/input', {
        templateUrl: 'view1/page-input.html',
        controller: 'inputController'

      })

      //display page
      .when('/display',{
          templateUrl: 'page-display.html',
          //controller: 'insuredCtrl'
      })

})
    .config(['$mdIconProvider', function ($mdIconProvider) {
        $mdIconProvider.icon('md-close', 'img/icons/ic_close_24px.svg', 24);
    }]);


// CONTROLLERS ============================================
// home page controller
myApp.controller('mainController', function($scope) {
  $scope.pageClass = 'page-home';
});

// about page controller
myApp.controller('inputController', function($scope) {
  $scope.pageClass = 'page-input';
});

// contact page controller
myApp.controller('overviewController', function($scope) {
  $scope.pageClass = 'page-overview';
}).directive("mathjaxAutobind", function () {
    return {
        restrict: "A",
        controller: ["$scope", "$element", "$attrs",
            function ($scope, $element, $attrs) {
                $scope.$watch($attrs.mathjaxAutobind, function (texExpression) {
                    var texScript = angular.element("<script type='math/tex'>")
                        .html(texExpression ? texExpression : "");
                    $element.html("");
                    $element.append(texScript);
                    MathJax.Hub.Queue(["Update", MathJax.Hub, $element[0]]);
                });
            }]
    };
});

myApp.controller('resultController', function($scope) {
    $scope.pageClass = 'page-result';
});

myApp.controller('sideNavCtrl', function($scope, $mdSidenav, $log, $location, $anchorScroll) {
    $scope.toggleRightNav = buildToggler('right');
    $scope.isOpenRight = function(){
        return $mdSidenav('right').isOpen();
    };

    function buildToggler(navID) {
        return function() {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                    $log.debug("toggle " + navID + " is done");
                });
        }
    }
});

myApp.controller('jumpCtrl', function($scope, $mdSidenav, $log, $location, $anchorScroll) {
    $scope.scrollTo = function(div) {
        $location.hash(div);
        $anchorScroll();
        $mdSidenav('right').close()
            .then(function () {
                $log.debug("close RIGHT is done");
            });
    };
    $scope.gotoBottom = function() {
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash('bottom');
        console.log("I am called");

        // call $anchorScroll()
        $anchorScroll();
    };
});

myApp.controller('BasicDemoCtrl', function($scope, consts){

    $scope.number=16;
    $scope.getNumber = function(num) {
        return new Array(num);
    };


    $scope.removable = false;

    $scope.input = consts.output[0];
    $scope.key = consts.output[1];
    $scope.editableinput  = angular.copy($scope.input);
    $scope.editablekey  = angular.copy($scope.key);

    $scope.ctrl = {
        add: function ($chip) {
            var a  = 'error';
            if (parseInt($chip,16) < 256) {
                return $chip;
            }
            return a;
        }
    };
});

