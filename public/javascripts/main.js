var teamCityMonitor = angular.module('teamCityMonitor', [])
    .config(function($locationProvider) {
        $locationProvider.html5Mode(true);
    });

function buildController($scope, $http, $timeout, $location) {

    function updateScreen(data) {
        try {
            $scope.buildInformation = data;
        } finally {
            $scope.refreshInProgress = false;
            waitThenUpdateScreen();
        }
    }

    function waitThenUpdateScreen() {
        $timeout(refresh, 10000);
    }

    function refresh() {
        $scope.refreshInProgress = true;
        $http.get('/buildstatus' + $location.path())
                .success(updateScreen)
                .error(waitThenUpdateScreen);
    };

    refresh();
}

buildController.$inject = ['$scope', '$http', '$timeout', '$location'];