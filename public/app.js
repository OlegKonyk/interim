var app = angular.module('BlogApp', ["ngRoute"]);
app.config(function($locationProvider, $routeProvider){
    $locationProvider.html5Mode(true);
    // $mdThemingProvider.theme('default')
    //     .primaryPalette('green');

    $routeProvider
        .when("/", {
            template : "<all-posts></all-posts>"
        })
        .when("/posts/:postName", {
            template : "<single-post></single-post>"
        })
        .otherwise({
            template : "<all-posts></all-posts>"
        });
});

app.controller('AppCtrl', function($scope, $window, $interval){
    $scope.countdown = 5;
    console.log('------->>>')
    // $interval(()=>{
    //     $scope.countdown--;
    //     if($scope.countdown <= 0) {
    //         $window.location.href = 'https://www.lyft.com/invite/NICOLEW?route_key=invite&v=OUT';
    //     }
    // }, 1000)
});

app.component('allPosts', {
            bindings: {},
            templateUrl: 'front/allPosts.html',
            controller: function() {
                console.log('------->>>')
            }
})

app.component('singlePost', {
            bindings: {},
            templateUrl: 'front/singlePost.html',
            controller: function() {
                console.log('+++++>>>')
            }
})