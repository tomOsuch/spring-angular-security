'use strict';

angular.module('app', ['ngRoute', 'ngResource'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'AuthenticationController',
                controllerAs: 'authController'
            })
            .when('/list', {
                templateUrl: 'partials/list.html',
                controller: 'ListController',
                controllerAs: 'listCtrl'
            })
            .when('/details/:id', {
                templateUrl: 'partials/details.html',
                controller: 'DetailsController',
                controllerAs: 'detailsCtrl'
            })
            .when('/new', {
                templateUrl: 'partials/new.html',
                controller: 'NewController',
                controllerAs: 'newCtrl'
            })
            .otherwise({
                redirectTo: '/list'
            });
    })
    .constant('BOOK_ENDPOINT', '/api/books/:id')
    .constant('LOGIN_ENDPOINT', '/login')
    .factory('Book', function($resource, BOOK_ENDPOINT) {
        return $resource(BOOK_ENDPOINT);
    })
    .service('Books', function(Book) {
        this.getAll = function() {
            return Book.query();
        }
        this.get = function(index) {
            return Book.get({id: index});
        }
        this.add = function(book) {
            book.$save();
        }
    })
    .constant('LOGOUT_ENDPOINT', '/logout')
    .service('AuthenticationService', function($http, LOGIN_ENDPOINT, LOGOUT_ENDPOINT) {
        this.authenticate = function(credentials, successCallback) {
            var authHeader = {Authorization: 'Basic ' + btoa(credentials.username+':'+credentials.password)};
            var config = {headers: authHeader};
            $http
                .post(LOGIN_ENDPOINT, {}, config)
                .then(function success(value) {
                    successCallback();
                }, function error(reason) {
                    console.log('Login error');
                    console.log(reason);
                });
        }
        this.logout = function(successCallback) {
            $http.post(LOGOUT_ENDPOINT)
                .then(successCallback());
        }
    })
    .controller('ListController', function(Books) {
        var vm = this;
        vm.books = Books.getAll();
    })
    .controller('DetailsController', function($routeParams, Books) {
        var vm = this;
        var bookIndex = $routeParams.id;
        vm.book = Books.get(bookIndex);
    })
    .controller('NewController', function(Books, Book) {
        var vm = this;
        vm.book = new Book();
        vm.saveBook = function() {
            Books.add(vm.book);
            vm.book = new Book();
        }
    })
    .controller('AuthenticationController', function($rootScope, $location, AuthenticationService) {
        var vm = this;
        vm.credentials = {};
        var loginSuccess = function() {
            $rootScope.authenticated = true;
            $location.path('/new');
        }
        vm.login = function() {
            AuthenticationService.authenticate(vm.credentials, loginSuccess);
        }
        var logoutSuccess = function() {
            $rootScope.authenticated = false;
            $location.path('/');
        }
        vm.logout = function() {
            AuthenticationService.logout(logoutSuccess);
        }
    });