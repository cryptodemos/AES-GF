/**
 * Created by f81602d on 9/29/2016.
 */

angular.module('myApp.view1', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/page-keyschedule.html',
            controller: 'insuredCtrl',
        })

            .when('/view1/result', {
                templateUrl: 'view1/page-keyScheduleResult.html',
                controller: 'keyCtrl',
            });
    }])

    .controller('View1Ctrl', function($scope, consts, $mdDialog){
        $scope.showAdvanced = function(ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: "../app/popwindows/bit-calculation.html",
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };

        $scope.showSteps = function(ev, val){
            $mdDialog.show({
                controller: DialogController,
                templateUrl: "../app/popwindows/mixcol-matrix.html",
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
            $scope.val= val;
            consts.default = $scope.val;
        };

        function DialogController($scope, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
        }
    })