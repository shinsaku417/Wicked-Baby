describe('StudentCtrl', function(){

  var $scope, $rootScope, $location, $window, $httpBackend, createController, socket;	
  
  beforeEach(module('wickedBaby'));
  
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $window = $injector.get('$window');
    $httpBackend = $injector.get('$httpBackend');
    LoginFactory = $injector.get('LoginFactory');
    socket = $injector.get('socket');
    $scope = $rootScope.$new();
    var $controller = $injector.get('$controller');

    // used to create our StudentCtrl for testing
    createController = function () {
      return $controller('StudentCtrl', {
        $scope: $scope,
        $window: $window,
        $location: $location,
        socket: socket
      });
    };
  }));

  it('should have a confused method on the $scope', function(){
    createController();
    expect(typeof $scope.confused).toEqual('function');
  });

  it('should have a cancel method on the $scope', function(){
    createController();
    expect(typeof $scope.cancel).toEqual('function');
  });

  it('should disable the confused button when the button is clicked', function(){
    createController();
    var confused = document.getElementsbyClassName('confused')[0];
    var cancel = document.getElementsByClassName('cancel')[0];
    confused.click();
    expect(confused.className).toEqual('disabled');
    expect(confused.disabled).toBe(true);
  });  


  it('should enable the cancel button when the confused button is clicked', function(){
    createController();
    var confused = document.getElementsbyClassName('confused')[0];
    var cancel = document.getElementsByClassName('cancel')[0];
    confused.click();
    expect(cancel.disabled).toEqual(false);
  });

  it('should emit "confused" event when the confused button is clicked', function(){
    createController();
    expect(socket.emit).toHaveBeenCalledWith('confused');
  });

  it('should reset confused button every 60 seconds', function(){
    createController();
    var confused = document.getElementsbyClassName('confused')[0];
    var cancel = document.getElementsByClassName('cancel')[0];
    confused.click();
    //not sure how to write code for this - still working on it
  });

  it('should disable the cancel button when the button is clicked', function(){
    createController();
    var confused = document.getElementsbyClassName('confused')[0];
    var cancel = document.getElementsByClassName('cancel')[0];
    cancel.click();
    expect(cancel.disabled).toBe(true);
  });  


  it('should enable the confused button when the cancel button is clicked', function(){
    createController();
    var confused = document.getElementsbyClassName('confused')[0];
    var cancel = document.getElementsByClassName('cancel')[0];
    cancel.click();
    expect(confused.className).toEqual('confused');
    expect(confused.disabled).toEqual(false);
  });

  it('should emit "not confused" event to the server when the cancel button is clicked', function(){
    createController();
    expect(socket.emit).toHaveBeenCalledWith('not confused');
  });
});