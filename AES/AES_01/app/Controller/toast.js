/**
 * Created by shannon_z on 20/11/16.
 */

//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//               佛祖保佑         永无BUG
//
//
//

myApp.controller('toastCtrl',function($scope, ngToast, $mdToast) {
    function toast(){
        ngToast.create('a toast message...');
    }

    var last = {
        bottom: true,
        top: false,
        left: true,
        right: false
    };


    $scope.toastPosition = angular.extend({},last);

    $scope.getToastPosition = function() {
        sanitizePosition();

        return Object.keys($scope.toastPosition)
            .filter(function(pos) { return $scope.toastPosition[pos]; })
            .join(' ');
    };

    function sanitizePosition() {
        var current = $scope.toastPosition;

        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;

        last = angular.extend({},current);
    }

    $scope.showActionToast = function() {
        var pinTo = $scope.getToastPosition();
        var toast = $mdToast.simple()
            .textContent('Hint: Click on w4 to see conversion step.')
            .position('bottom center')
            .action('Okay, I got it!')
            .highlightAction(true)
            .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
            .hideDelay(2000);


        $mdToast.show(toast).then(function(response) {
        });

    };

    $scope.showActionToast2 = function() {
        var pinTo = $scope.getToastPosition();
        var toast = $mdToast.simple()
            .textContent('Hint: Click on w5 to see the next step.')
            .position('bottom center')
            .action('Okay, I got it!')
            .highlightAction(true)
            .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
            .hideDelay(2000);


        $mdToast.show(toast).then(function(response) {
        });

    };

    $scope.showActionToast3 = function() {
        var pinTo = $scope.getToastPosition();
        var toast = $mdToast.simple()
            .textContent('Hint: Click on w6 to see the next step.')
            .position('bottom center')
            .action('Okay, I got it!')
            .highlightAction(true)
            .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
            .hideDelay(2000);


        $mdToast.show(toast).then(function(response) {
        });

    };

    $scope.showActionToast4 = function() {
        var pinTo = $scope.getToastPosition();
        var toast = $mdToast.simple()
            .textContent('Hint: Click on w7 to see the next step.')
            .position('bottom center')
            .action('Okay, I got it!')
            .highlightAction(true)
            .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
            .hideDelay(2000);


        $mdToast.show(toast).then(function(response) {
        });

    };

    $scope.showActionToast5 = function() {
        var pinTo = $scope.getToastPosition();
        var toast = $mdToast.simple()
            .textContent('Now you have gone through the transformation of Round 1 Key. Proceed to the next section to see all scheduled key results.')
            .position('bottom center')
            .action('Okay, I got it!')
            .highlightAction(true)
            .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
            .hideDelay(2000);

        $mdToast.show(toast).then(function(response) {
        });

    };

    $scope.closeToast = function() {
        $mdToast.hide();
    };
    /*
    $scope.openClickToClose = function () {
        ngToast.open({
            template: '<div>Click to close</div>',
            clickToClose: true
        });
    };
    */

});