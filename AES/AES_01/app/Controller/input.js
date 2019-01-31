/**
 * Created by shannon_z on 6/9/16.
 */

myApp.controller('AppCtrl', function($scope,$location,$cookies, $cookieStore,consts) {
    $scope.input = consts.output[0];
    $scope.key =  consts.output[1];
    $cookieStore.remove('AES');

    /* $scope.outputTrans = function(arr){
     for (var l = 0; l < 4; l ++){
     output01
     }
     };*/
});


