/**
 * Created by f81602d on 9/26/2016.
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


/*AES Controller*/
myApp.controller('numCtrl',function($scope, consts, aseencrypt, toTwoDigit) {
    $scope.Math=Math;
    $scope.constant1 = consts;
    consts.roundresult[0] = [];
    $scope.roundkey = consts.finalkey;
    $scope.mixc = consts.mixcolcon;

    $scope.two = toTwoDigit.two;
    $scope.toBin = toTwoDigit.toBin;

    input01 = $scope.constant1.output[0];
    key01 = $scope.constant1.output[1];
    input_amend = [input01[0],input01[4],input01[8],input01[12],
        input01[1],input01[5],input01[9],input01[13],
        input01[2],input01[6],input01[10],input01[14],
        input01[3],input01[7],input01[11],input01[15]
    ];
    key_amend = [key01[0],key01[4],key01[8],key01[12],
        key01[1],key01[5],key01[9],key01[13],
        key01[2],key01[6],key01[10],key01[14],
        key01[3],key01[7],key01[11],key01[15]
    ];

    $scope.new_input = input_amend;
    $scope.new_key = key_amend;

    for (var i = 0 ; i < 16; i++){
        temp = PolynomialField.AESAdd(input_amend[i], key_amend[i]);
        consts.roundresult[0].push(temp);
    }

    aseencrypt.aes_encrypt(input01.join(''), key01.join(''));

    testResult = aseencrypt.result;
    testSub = aseencrypt.subbytes;
    testShift = aseencrypt.shiftrows;
    testMix = aseencrypt.mixcolumns;

    $scope.subbytesresult = [[],[],[],[],[],[],[],[],[],[]];
    $scope.shiftrowsresult = [[],[],[],[],[],[],[],[],[],[]];
    $scope.mixcolumnsresult = [[],[],[],[],[],[],[],[],[]];
    $scope.finalresult = [[],[],[],[],[],[],[],[],[],[],[],[]];

    for (var j = 0; j<aseencrypt.subbytes.length; j++){
        for (var k = 0; k<16; k++){
            temp = testSub[j][k].toString(16);
            $scope.subbytesresult[j].push(temp);
        }
    }
    for (var j = 0; j<aseencrypt.shiftrows.length; j++){
        for (var k = 0; k<16; k++){
            temp = testShift[j][k].toString(16);
            $scope.shiftrowsresult[j].push(temp);
        }
    }
    for (var j = 0; j<aseencrypt.mixcolumns.length; j++){
        for (var k = 0; k<16; k++){
            temp = testMix[j][k].toString(16);
            $scope.mixcolumnsresult[j].push(temp);
        }
    }
    for (var j = 0; j<aseencrypt.result.length; j++){
        for (var k = 0; k<16; k++){
            temp = testResult[j][k].toString(16);
            $scope.finalresult[j].push(temp);
        }
    }

    $scope.parse_mul = function(val1, val2){
        var a = (2*parseInt(val2,16)).toString(2);
        var b = parseInt(val2,16).toString(2);
        var a1 = ("00000000" + a).substring(("00000000" + a).length - 8);
        var b1 = ("00000000" + b).substring(("00000000" + b).length - 8);
        var xor = [];
        var results = 0;

        for (i=0; i < 8; i++){
            xor[i] = ( parseInt(a1[i]) || parseInt(b1[i]) ) && !( parseInt(a1[i]) && parseInt(b1[i]) )? 1 : 0;
        }

        if(parseInt(val1,16)<3){
            return (parseInt(val1, 16) * parseInt(val2, 16)).toString(16);
        }else{
            return parseInt(xor.join(""),2).toString(16);
        }
    };

    PolynomialField.updateAllMath();
});


/*S-Box Controller*/
myApp.controller('sBoxCtrl', function($scope, $http, $cookies, $cookieStore, $window, consts) {
    if(angular.isDefined($cookieStore.get('AES'))){
        var tempoutput = $cookieStore["get"]('AES');
        consts.output[0] = tempoutput[0];
        consts.output[1] = tempoutput[1];
    }

    $scope.s_enc = consts.s_enc;
    $scope.constant1 = consts;

    $window.onbeforeunload = function(){
        $cookieStore.put('AES',consts.output);
    };
    PolynomialField.updateAllMath();
});

/*Mix Col Controller*/
myApp.controller('mixColCtrl', function($scope, consts) {
    $scope.constant1 = consts;
    PolynomialField.updateAllMath();
    //MathJax.Hub.Queue(["Typeset",MathJax.Hub])();
});