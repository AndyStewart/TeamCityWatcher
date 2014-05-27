var teamCityMonitor = angular.module('teamCityMonitor', [])
    .config(function($locationProvider) {
        $locationProvider.html5Mode(true);
    });

function buildMonitorController($scope, $http, $timeout, $location) {
    var projectName =  $location.search().projectname;
    if (!projectName) {
        projectName = "E-Subs";
    }
    $scope.projectName = projectName;

    function updateScreen(data) {
        try {
            if (!$scope.buildInformation) {
                $scope.buildInformation = data;
            } else {
                if ($scope.buildInformation[0].id !== data[0].id) {
                    $scope.buildInformation = data;
                }
            }
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
        $http.get('/buildstatus/' + projectName)
                .success(updateScreen)
                .error(waitThenUpdateScreen);
    };

    refresh();
}

buildMonitorController.$inject = ['$scope', '$http', '$timeout', '$location'];

function buildController($scope, $http, $timeout) {
    $scope.build.result = "UNKNOWN";

    function loadBuildInfo() {
        $scope.refreshInProgress = true;
        var buildUrl = "/project/" + $scope.projectName + "/pipelines/" + $scope.pipeline.id + "/builds/" + $scope.build.buildTypeId;
        $http.get(buildUrl)
                .success(function(data, status, headers) {
                            $scope.build = data;
                            if (data === null || data.result != "SUCCESS") {
                                $timeout(loadBuildInfo, 10000);    
                            }
                        })
                .error(function() {
                    $timeout(loadBuildInfo, 10000); 
                });
    }

    loadBuildInfo();
}

function changeController($scope, $http) {
    var buildUrl = "/project/" + $scope.projectName + "/pipelines/" + $scope.pipeline.id + "/changes";
    $http.get(buildUrl).success(function(data) {
        $scope.changes = data;
    });
}