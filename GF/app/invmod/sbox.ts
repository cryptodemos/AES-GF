/**
 * Created by Zhou on 10/1/16.
 */

angular.module('myApp.sbox', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/sbox', {
            templateUrl: 'invmod/sbox.html',
            controller: 'sboxCtrl'
        });
    }])
    .controller("sboxCtrl", ["$scope","config", "constants","$timeout","$location",
        function ($scope, config: Configuration,
                                      constants, $timeout: ITimeoutService,
                                      $location: ILocationService) {
        config.pageConfig = constants.PAGE_CONFIGURATIONS[3];

        $scope.config = config;
        config.displayOption = 16;

        $scope.constants = constants;

        var urlData = $location.search();
        if (constants.urlLiteral in urlData) {
            var obj = {url: urlData[constants.urlLiteral]};
            if (constants.internalLiteral in urlData) {
                obj[constants.internalLiteral] = true;
            }
            constants.urlStack.push(obj);
            urlData[constants.urlLiteral] = null;
        }
        constants.inverseModulus = ($location.search()["val"] == void 0) ?
            constants.inverseModulus : parseInt($location.search()["val"]);

        $scope.poly = new PolynomialField(constants.inverseModulus, config, $scope, "poly",false);
        $scope.result = new PolynomialField(0, config, $scope, "result",false);

        let oldValue = $scope.poly.decimal;
        let timer;
        const recursiveCalculate = function () {
            let delay = 0;
            if (oldValue!=$scope.poly.decimal){
                oldValue = $scope.poly.decimal;
                $scope.calc();
                delay = constants.RENDERING_DELAY;
            }
            timer = $timeout(recursiveCalculate,constants.RECALCULATION_TIMEOUT+delay);
        };
        timer = $timeout(recursiveCalculate,constants.RECALCULATION_TIMEOUT);


        $scope.$on("$destroy", function () {
            $scope.poly.remove();
            $scope.result.remove();
            $timeout.cancel(timer);
        });
        $scope.matrixProduct = "";
        $scope.finalProcess = "";
        function matrixTex() {
                var content = "";
                constants.AES_AFFINE_MATRIX.forEach(function (value: number[]) {
                    content += value.join(" & ") + "\\\\"
                });
                content = `\\left[ \\begin{matrix} ${content} \\end{matrix}\\right]`;
                var s = $scope.result.decimal.toString(2);
                while (s.length < 8) s = "0" + s;
                s = Array.from(s).reverse();
                content += `\\left[ \\begin{matrix} 
            ${s.join(" \\\\ ")}
         \\end{matrix}\\right] = `;
                var result = [];
                constants.AES_AFFINE_MATRIX.forEach(function (value) {
                    var ans = 0;
                    value.forEach(function (value2, index) {
                        ans = ans ^ (value2 & s[index]);
                    });
                    result.push(ans)
                });
                var intermediateResult = `\\left[ \\begin{matrix} 
            ${Array.from(result).join(" \\\\ ")}
         \\end{matrix}\\right]`;
                content += intermediateResult;
                $scope.matrixProduct = content;
                $scope.intermediateResult = parseInt(Array.from(result).join(""), 2);
                result.forEach(function (value, index, array) {
                    result[index] ^= constants.AES_FINAL_VECTOR[index];
                });


                $scope.finalProcess = `${intermediateResult} \\oplus 
                \\left[ \\begin{matrix} 
                    ${Array.from(constants.AES_FINAL_VECTOR).join(" \\\\ ")}
                 \\end{matrix}\\right] = 
                 \\left[ \\begin{matrix} 
                    ${Array.from(result).join(" \\\\ ")}
                 \\end{matrix}\\right]`;

                $scope.sboxResult = parseInt(Array.from(result).reverse().join(""), 2)
        }
        $scope.calc = function () {
            config.field = 2;
            constants.degree = 8;
            constants.modulus = constants.irreduciblePolynomials[6];
            constants.modulusTex = constants.irreduciblePolynomialsTex[6];
            config.enablePolynomialCompute = true;
            config.enableDivision = true;

            $scope.steps = [];
            $scope.result.numberValue = PolynomialField.modulusInverse(
                new PolynomialField(constants.modulus, config),
                $scope.poly, $scope.steps)[1].toString(config.displayOption);
            matrixTex();

            $scope.padding = "";

            switch (config.displayOption){
                case 2: case "2":
                    for (var i = $scope.sboxResult.toString(2).length;i<8;i++) $scope.padding = "0" + $scope.padding;
                    break;
                case 16: case "16":
                    if ($scope.sboxResult.toString(16).length == 1) $scope.padding = "0";

            }

            PolynomialField.updateAllMath();
        };
        $scope.calc();
        $scope.formatNumber = function (number: number, reverse = false) {
            let s = number.toString(2);
            while (s.length < 8) s = "0" + s;
            if (reverse) s = Array.from(s).reverse().join("");
            return `(${s.slice(0, 4)},${s.slice(4, 8)})_2`;
        };


        $scope.redirect = function () {
            $location.url(`/view2?url=sbox%3fval%3d${$scope.poly.decimal}&internal&val=${$scope.poly.decimal}`)
        }

    }]);