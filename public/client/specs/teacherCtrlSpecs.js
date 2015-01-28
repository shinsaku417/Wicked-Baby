describe('TeacherCtrl', function(){

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

    // used to create our TeacherCtrl for testing
    createController = function () {
      return $controller('TeacherCtrl', {
        $scope: $scope,
        $window: $window,
        $location: $location,
        socket: socket
      });
    };
  }));

  it('should have a confusionCalculator method on the $scope', function(){
    createController();
    expect(typeof $scope.confusionCalculator).toEqual('function');
  });

  it('should have a counter property on the $scope that\'s initially set to 0', function(){
    createController();
    expect($scope.counter).toEqual(0);
  });

  it('should have a threshold property with a default value on the $scope', function(){
    createController();
    expect($scope.threshold).not.toBeUndefined();
    expect($scope.threshold).not.toBeNull();
  });

  it('should listen for "add" event emitted by server', function(){
    //still working on it

  });

  it('should correctly increment the counter in response to "add" event', function(){
    createController();
    // client receives add event
    expect($scope.counter).toEqual(1);
    // client receives another add event
    expect($scope.counter).toEqual(2);
    // client receives another add event
    expect($scope.counter).toEqual(3);
    // client receives another add event
    expect($scope.counter).toEqual(4);
  });

  it('should listen for "subtract" event emitted by server', function(){

  });

  it('should correctly decrement the counter in response to "subtract" event', function(){
    createController();
    // client receives add event
    expect($scope.counter).toEqual(1);
    // client receives another add event
    expect($scope.counter).toEqual(2);
    // client receives another add event
    expect($scope.counter).toEqual(3);
    // client receives another add event
    expect($scope.counter).toEqual(4);
    // client receives subtract event
    expect($scope.counter).toEqual(3);
    // client receives another subtract event
    expect($scope.counter).toEqual(2);
    // client receives another subtract event
    expect($scope.counter).toEqual(1);
  });

  it('should alert the teacher if the confusion rate is greater than 0.5', function(){
    createController();
    $scope.percentage = 51;
    expect(
      swal({
        title: "Confused!",
        text: "Students are confused!",
        confirmButtonText: "Help them!"
      })
    ).toHaveBeenCalled(); 

  });
});