var app = angular.module('BlogApp', ["ngRoute"]);

app.config(function($locationProvider, $routeProvider){
    $locationProvider.html5Mode(true);
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

app.component('allPosts', {
            bindings: {},
            templateUrl: 'front/allPosts.html',
            controller: function() { }
})

app.component('singlePost', {
            bindings: {},
            templateUrl: 'front/singlePost.html',
            controller: function($window, $interval, $timeout, $location) {
                var mode = $location.search().mode;
                if (mode == 'r') {
                    var code = $location.search().code;
                    $timeout(()=>{
                        $window.location.href = `https://www.lyft.com/invite/${code}?route_key=invite&v=OUT`;
                    })
                }
            }
})