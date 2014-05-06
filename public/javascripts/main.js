var teamCityMonitor = angular.module('teamCityMonitor', [])
    .config(function($locationProvider) {
        $locationProvider.html5Mode(true);
    });

function buildMonitorController($scope, $http, $timeout, $location) {

    function updateScreen(data) {
        try {
            $scope.buildInformation = data;
        } finally {
            $scope.refreshInProgress = false;
            waitThenUpdateScreen();
        }
    }

    function waitThenUpdateScreen() {
        //$timeout(refresh, 10000);
    }

    function refresh() {
        var projectName =  $location.search().projectname;
        if (!projectName) {
            projectName = "E-Subs";
        }

        $scope.refreshInProgress = true;
        $http.get('/buildstatus/' + projectName)
                .success(updateScreen)
                .error(waitThenUpdateScreen);
    };

    refresh();
}

buildMonitorController.$inject = ['$scope', '$http', '$timeout', '$location'];

function buildController($scope,  $http, $timeout) {

    function updateScreen(data) {
        try {
            $scope.build = data;
        } finally {
            $scope.refreshInProgress = false;
        }
    }

    function refresh() {
        if ($scope.build.id) {
            $http.get('/build/' + $scope.build.id)
                    .success(updateScreen);
            $timeout(refresh, 10000);
        }
    }
    refresh();
}