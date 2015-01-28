describe('MainCtrl', function(){

  var $scope, $rootScope, $location, $window, $httpBackend, createController, LoginFactory, socket;	
  
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

    // used to create our MainCtrl for testing
    createController = function () {
      return $controller('MainCtrl', {
        $scope: $scope,
        $window: $window,
        $location: $location,
        LoginFactory: LoginFactory,
        socket: socket
      });
    };

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $window.localStorage.removeItem('com.wickedBaby');
  });

  it('should have a emitMessage method on the $scope', function(){
    createController();
    expect(typeof $scope.emitMessage).toEqual('function');
  });

  it('should have a studentLogin method on the $scope', function(){
    createController();
    expect(typeof $scope.studentLogin).toEqual('function');
  });

  it('should call emitMessage() with the correct argument when studentLogin() is called', function(){
    createController();
    $scope.studentLogin();
    expect($scope.emitMessage).toHaveBeenCalledWith('student'); 
  });

  it('should store token in localStorage after studentLogin', function() {
    // create a fake JWT for auth
    createController();
    var token = 'sjj232hwjhr3urw90rof';
    // make a 'fake' reques to the server, not really going to our server
    $httpBackend.expectPOST().respond({token: token});
    $scope.studentLogin();
    $httpBackend.flush();
    expect($window.localStorage.getItem('com.wickedBaby')).toBe(token);
  });

  it('should have a teacherLogin method on the $scope', function(){
    createController();
    expect(typeof $scope.teacherLogin).toEqual('function');
  });

  it('should call emitMessage() with the correct argument when teacherLogin() is called', function(){
    createController();
    $scope.teacherLogin();
    expect($scope.emitMessage).toHaveBeenCalledWith('teacher'); 
  });

  it('should store token in localStorage after teacherLogin', function() {
    // create a fake JWT for auth
    createController();
    var token = 'sjj232hwjhr3urw90rof';

    // make a 'fake' reques to the server, not really going to our server
    $httpBackend.expectPOST().respond({token: token});
    $scope.teacherLogin();
    $httpBackend.flush();
    expect($window.localStorage.getItem('com.wickedBaby')).toBe(token);
  });

  // if we're only having one "Login with Github" button on index.html, then we wouldn't need the tests above. The remainder of the tests below focus on the "Login with Github" button
  it('should send a POST request when "Login with Github" button is clicked', function(){
  	createController();
  	$httpBackend.flush();
  	document.getElementsByClassName('login')[0].click();
  	//INCOMPLETE
  });
  
  it('should store token in localStorage after login', function() {
    // create a fake JWT for auth
    createController();
    var token = 'sjj232hwjhr3urw90rof';
    // make a 'fake' reques to the server, not really going to our server
    $httpBackend.expectPOST().respond({token: token});
  	document.getElementsByClassName('login')[0].click();
    $httpBackend.flush();
    expect($window.localStorage.getItem('com.wickedBaby')).toBe(token);
  });


});