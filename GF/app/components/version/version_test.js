'use strict';
describe('myApp.version module', function () {
    beforeEach(angular.mock.module('myApp.version'));
    describe('version service', function () {
        it('should return current version', inject(function (version) {
            expect(version).toEqual('0.9');
        }));
    });
});
//# sourceMappingURL=version_test.js.map