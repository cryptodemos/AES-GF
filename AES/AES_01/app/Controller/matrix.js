/**
 * Created by f81602d on 2/6/2017.
 */

myApp.controller('matrixCtrl', function($scope,$location,consts) {
    $scope.preset = consts.default;
    $scope.con = [
        "02",
        "02 & 03 & 01 & 01",
        "01 & 02 & 03 & 01",
        "01 & 01 & 02 & 03",
        "03 & 01 & 01 & 02"
    ];

    $scope.toBin = function(val){
        return ("00000000" + parseInt(val,16).toString(2)).substring(("00000000" + parseInt(val,16).toString(2)).length - 8);
    };


});




