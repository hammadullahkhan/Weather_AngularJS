angular.module("Weather", ['ngResource']);

angular.module("Weather").constant('API_KEY','8caa3a62ba1f3b52d931888f38d1bc75');
angular.module("Weather").constant('API_URL','http://api.openweathermap.org/data/2.5/forecast/daily');
angular.module("Weather").directive("weatherData", function() {

    return {
        scope: {
            cw: '='
        },
        restrict: 'EA',
        templateUrl: 'weather.view.html'
    };
});
angular.module("Weather").factory('WeatherResource', [ '$resource', 'API_URL', 'API_KEY',function( $resource, API_URL, API_KEY ) {

    return $resource ( API_URL,
        {
            q: '@q',
            appid: API_KEY,
            units:'@units',
            cnt: 5
        },
        {
            'get':   {method:'GET'}
        }
    );
}]);
angular.module("Weather").service('WeatherService', [ '$resource', 'WeatherResource', function ( $resource, WeatherResource ) {

    var self = this;
    self.getWeather = function (cityName,unit) {
        var wp = WeatherResource.get({q:cityName,units:unit});
        return wp;
    };
}]);
angular.module("Weather").controller('WeatherController',[ 'WeatherService', function ( WeatherService ) {

    var self = this;
    self.cityName='TORONTO';
    self.unit = 'imperial';

    self.getCityWeather = function(cityName,unit){
        //console.log(cityName);
        WeatherService.getWeather(cityName,unit).$promise.then( function ( data ) {
                if ( data.cod && data.cod=='200' && data.list && data.list.length > 0 ) {
                    self.cityWeather = data.list;
                } else {
                    self.cityWeather = false;
                }
            },
            function ( error ) {
                self.cityWeather = false;
            });
    };

    self.getCityWeather(self.cityName,self.unit);
}]);