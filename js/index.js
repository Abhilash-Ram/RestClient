angular.module('ws', ['ui.router', 'jsonFormatter','toastr']);

angular.module('ws')
  .config(['$urlRouterProvider','$stateProvider', '$locationProvider', 'toastrConfig',
      function($urlRouterProvider, $stateProvider, $locationProvider, toastrConfig){
    $stateProvider
      .state("app",{
        url:"/app",
        templateUrl:"partials/app.html",
        controller:"wsController",
        controllerAs:"vm"
      });
    $urlRouterProvider.otherwise("/app");
    $locationProvider.hashPrefix("");
    angular.extend(toastrConfig, {
      autoDismiss: true,
      containerId: 'toast-container',
      maxOpened: 0,    
      newestOnTop: true,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      target: 'body'
    });
  }]);
angular.module('ws')
  .run(['$rootScope', function($rootScope){
    $rootScope.theme = "inverse";
  }]);
angular.module('ws')
  .controller('wsController',wsControllerFunction);

function wsControllerFunction( restService, $rootScope, toastr){
  var vm = this;
  vm.history = [];
  vm.theme = $rootScope.theme;
  vm.fileOptions = [{
    title:"New"
  },{
    title:"Save"
  },{
    title:"Share"
  },{
    title:"Print"
  }];
  vm.themes = [{
    title:"Black",
    theme:"inverse"
  },{
    title: "Light",
    theme:"default"
  },{
    title: "Dark",
    theme:"dark"
  }]
  vm.showProgress = false;
  vm.showResultBanner = false;
  vm.user = {
    url : 'services.odata.org/V3/Northwind/Northwind.svc/Employees'
  };
  vm.history= [];
  vm.abort = function(){
    restService.abort(1001);
  };
  vm.checkWIP = function(){
    return restService.checkWIP(1002)
  };
  vm.makeRequest = function( protocol, url, method){
    if(vm.checkWIP()){
      toastr.warning('Request In Progress...!');
    }else{
      vm.showProgress = true
      vm.resultData = undefined;
      var url_stub = protocol+"://"+url;
      vm.history.push({
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
          vm.showProgress = false
          toastr.warning('User Cancelled...!','bottom right')
        }else if(response == 1002){
          vm.showProgress = false
          toastr.info('Made Another Request...!','bottom right')
        }else{
          toastr.success('Success Response...!','bottom right')
          vm.showProgress = false
          vm.showResultBanner = true
          vm.resultData = [];
          vm.config = [];
          vm.resultData = angular.fromJson(response.data.value)
          vm.config = angular.fromJson(response.config)
        }
      },function(error){
        toastr.error('Error Response...!','bottom right')
        vm.showProgress = false
        vm.showResultBanner = false
      });
    }
  }
};
angular.module('ws')
  .service('restService', function( $q, $http){
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
  }); 