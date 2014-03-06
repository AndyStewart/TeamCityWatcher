var teamCityMonitor = angular.module('teamCityMonitor', [])
    .config(function($locationProvider) {
        $locationProvider.html5Mode(true);
    });


function parseDefectString(defects) {
    var defectString = '';

    for(var i =0; i < defects.length; i++) {
        defectString = defectString + defects[i] + ", ";
    }

    return defectString.substring(0, defectString.length - 2);
}

var refreshBuildData = function(data) {
    for (var i = data.length - 1; i >= 0; i--) {
        var buildResults = data[i];
        //buildResults.defects = parseDefectString(buildResults.defects);
    };
   
    return data;
}

function buildController($scope, $http, $timeout, $location) {
    var refresh = function () {
        $scope.refreshInProgress = true;
        $http.get('/buildstatus' + $location.path()).success(function (data) {
            try {
                $scope.buildInformation = refreshBuildData(data);
            } finally {
                $scope.refreshInProgress = false;
                //$timeout(refresh, 10000);
            }
        })
        .error(function () {
            $timeout(refresh, 10000);
        });
    };
    refresh();
}

buildController.$inject = ['$scope', '$http', '$timeout', '$location'];