/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var restApp = angular.module('restApp', ['ngMaterial','ngMessages','jsonFormatter']);
restApp.controller('restController',restControllerFunction);
function restControllerFunction($scope, restService){
  $scope.showProgress = false
  $scope.showResultBanner = false
    $scope.user = {
                url : 'services.odata.org/V3/Northwind/Northwind.svc/Employees'
  }
  $scope.history= []
  $scope.abort = function(){
                restService.abort(1001);
  }
  $scope.checkWIP = function(){
                return restService.checkWIP(1002)
  }
  $scope.makeRequest = function( protocol, url, method){
                if($scope.checkWIP()){
                                restService.showToast('Request In Progress...!','bottom right')
                }else{
                                $scope.showProgress = true
                $scope.showResultBanner = false
    var url_stub = protocol+"://"+url;
      $scope.history.push({
        protocol : protocol,
        url:url,
        method:method
      })
      var headers =  {
        "Content-Type": "application/json"
      }
      var requestData ={
        method: method,
        url: url_stub,
        headers:headers
      }
      if(method == 'post'){
        requestData['data'] = angular.toJson($scope.postData)
      }
                  restService.service(requestData)
                  .then(function(response){
                                  if(response == 1001){
                                                $scope.showProgress = false
                                                restService.showToast('User Cancelled...!','bottom right')
                                  }else if(response == 1002){
                                                $scope.showProgress = false
                                                restService.showToast('Made Another Request...!','bottom right')
                                  }else{
                                                restService.showToast('Success Response...!','bottom right')
                                                $scope.showProgress = false
                                                $scope.showResultBanner = true
                                                $scope.resultData = [];
                                                $scope.config = [];
                                                $scope.resultData = angular.fromJson(response.data.value)
                                                $scope.config = angular.fromJson(response.config)
                                  }
                  },function(error){
                                restService.showToast('Error Response...!','bottom right')
                                $scope.showProgress = false
        $scope.showResultBanner = false
                  })
                }
  }
}
restApp.service('restService', function( $q, $http, $mdToast){
                var D = $q.defer();
                var promiseCompleted = true;
                this.service = function(requestData){
                  D = $q.defer();
                  promiseCompleted = false
                  requestData['timeout'] = D.promise
                  var promise = $http(requestData)
				  .then(function successCallback(response) {
                  promiseCompleted = true
                                D.resolve(response);
      }, function errorCallback(error) {
                                  promiseCompleted = true
                                D.reject(error);
      });
                  return D.promise;
                }
                this.checkWIP = function(reason){
                                if(!promiseCompleted){
                                                //D.resolve(reason);
                                                return true
                                }else{
                                                return false
                                }
                }
                this.abort = function(reason){
                                return D.resolve(reason);
                }
                this.showToast = function(message, position){
    $mdToast.show(
       $mdToast.simple()
         .textContent(message)
         .position(position)
         .hideDelay(3000)
     );
  }
});

/***/ })
/******/ ]);