/**
 * Created by Zhou on 7/26/16.
 */
angular.module('myApp.view2')
    .controller('conversionCtrl', ["$scope", "config", "constants",
    function ($scope, config, constants) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, window.document.body]);
        $scope.config = config;
        config.enablePolynomialCompute = false;
        constants.degree = "n";
        config.pageConfig = constants.PAGE_CONFIGURATIONS[0];
        $scope.poly = new PolynomialField(42, config, $scope, "poly");
        $scope.getDecimalToCoefficient = function (value) {
            if (isNaN(value) || value == null)
                return "";
            var str = "\\begin{array}{conv}", power = 0, tmpValue = value;
            while (config.field <= value) {
                var currentXPower_1 = power != 0 ? "* x^{" + power + "}" : "";
                str += value + " & = & " + config.field + "* " + Math.floor(value / config.field) + " + \n                    " + value % config.field + " & \u2026\u2026 " + value % config.field + " " + currentXPower_1 + " \\\\";
                value = Math.floor(value / config.field);
                power++;
            }
            var currentXPower = power != 0 ? "* x^{" + power + "}" : "";
            str += value + " & = & " + value + " & \u2026\u2026 " + value + " " + currentXPower + "\\\\ ";
            str += "\\end{array} \\\\";
            str += "Final Polynomial: \\ " + $scope.getPolynomial(tmpValue);
            return str;
        };
        $scope.getPolynomial = function (value) {
            return Utility.polynomialInTexNoPadding(new PolynomialField(value, config));
        };
        $scope.$on("$destroy", function () {
            $scope.poly.remove();
        });
    }]);
//# sourceMappingURL=conversionCtrl.js.map