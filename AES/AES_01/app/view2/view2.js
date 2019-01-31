/**
 * Created by f81602d on 9/27/2016.
 */

angular.module('myApp.view2', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/page-addroundkey.html',
            controller: 'View2Ctrl',
        })

            .when('/view2/step1', {
                templateUrl: 'view2/page-subbytes.html',
                controller: 'sBoxCtrl',
            })
            .when('/view2/step2', {
                templateUrl: 'view2/page-shiftrow.html'
            })
            .when('/view2/step3', {
                templateUrl: 'view2/page-mixcol.html',
                controller: 'mixColCtrl',
            })
            .when('/view2/step4', {
                templateUrl: 'view2/page-addroundkey.html'
            })
        ;

    }])

    .controller('View2Ctrl', function($scope, consts){

    });
