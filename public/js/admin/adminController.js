var adminApp = angular.module('adminApp', [], function ($interpolateProvider) {
                $interpolateProvider.startSymbol('[[');
                $interpolateProvider.endSymbol(']]');
            	});

adminApp.controller('AdminCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.contacts = {};
  $scope.view = {};
  $scope.view.contacts = true;
  $scope.transactions = {};
  $scope.newTransaction = {};
  $scope.brokerTestimonials = {};
  $scope.borrowerTestimonials = {};
	$http.get('/api/contacts')
  .success(function(data) {
		console.log(data.contacts);
  	$scope.contacts.list = data.contacts;
	})
  .error(function (message) {
    console.log('failed to load contacts' + message);
  });

  $http.get('/api/transactions')
  .success(function(data) {
    console.log(data);
    $scope.transactions.list = data;
    for (var i = 0; i < $scope.transactions.list.length; i++) {
      var transaction = $scope.transactions.list[i];
      transaction.nameTemp = transaction.name;
      transaction.addTemp = transaction.address;
      transaction.monTemp = transaction.money;
    }
  })
  .error(function (message) {
    console.log('failed to load transactions' + message);
  });


  $http.get('/api/testimonials/broker')
  .success(function(data) {
    console.log(data);
    $scope.brokerTestimonials.list = data;
    for (var i = 0; i < $scope.brokerTestimonials.list.length; i++) {
      var testimonial = $scope.brokerTestimonials.list[i];
      testimonial.nameTemp = testimonial.name;
      testimonial.quoteTemp = testimonial.quote;
    }
  })
  .error(function (message) {
    console.log('failed to load contacts' + message);
  });


  $http.get('/api/testimonials/borrower')
  .success(function(data) {
    console.log(data);
    $scope.borrowerTestimonials.list = data;
    for (var i = 0; i < $scope.borrowerTestimonials.list.length; i++) {
      var testimonial = $scope.borrowerTestimonials.list[i];
      testimonial.nameTemp = testimonial.name;
      testimonial.quoteTemp = testimonial.quote;
    }
  })
  .error(function (message) {
    console.log('failed to load contacts' + message);
  });


  ///////////////////////////////////////////////////////////////////////
  //                   CRUD Operations for Transactions                //
  ///////////////////////////////////////////////////////////////////////
  $scope.uploadFile = function(files) {
    console.log("uploading");
    var fd = new FormData();
    var date = files[0].lastModified;
    fd.append("file", files[0]);
    fd.append("date", date);
    $http.post('/api/transaction/uploadImage', fd, {
        withCredentials: true,
        headers: {'Content-Type': undefined },
        transformRequest: angular.identity
    })
    .success(function(data) {
      console.log("returned");
      $scope.newTransaction.imgName = date + '-' + files[0].name;
    }).error(function() {
      console.log("error");
    });

  };

	$scope.createNewTransaction = function (newTransaction) {
		// console.log(newTransaction);
    console.log(newTransaction);
    $http.post('/api/transaction/create', newTransaction)
    .success(function(data) {
      console.log(data);
      data.nameTemp = data.name;
      data.addTemp = data.address;
      data.monTemp = data.money;
      $scope.transactions.list.push(data);
      $scope.newTransaction = {};
      $('#transactionUploader').val(null);
    })
    .error(function (message) {
      console.log(message)
    })
	}

  $scope.deleteTransaction = function (transaction) {
    console.log(transaction);
    var id = transaction._id;
    $http.post('/api/transaction/delete', transaction)
    .success(function(data) {
      console.log(data);
      for (var i = 0; i < $scope.transactions.list.length; i++) {
        if ($scope.transactions.list[i]._id === id) {
          console.log(id)
          $scope.transactions.list.splice(i, 1);
          break;
        }
      }
    })
    .error(function (message) {
      console.log(message)
    })
  }

  $scope.updateTransaction = function (transaction) {
    console.log(transaction);
    var id = transaction._id;
    delete transaction.update;
    $http.post('/api/transaction/update', transaction)
    .success(function(data) {
      console.log(data);
      for (var i = 0; i < $scope.transactions.list.length; i++) {
        if ($scope.transactions.list[i]._id === id) {
          console.log(id)
          $scope.transactions.list.splice(i, 1);
          break;
        }
      }
      data.nameTemp = data.name;
      data.addTemp = data.address;
      data.monTemp = data.money;
      $scope.transactions.list.push(data);
    })
    .error(function (message) {
      console.log(message)
    })
  }

///////////////////////////////////////////////////////////////////////
//                   CRUD Operations for Testimonials                //
///////////////////////////////////////////////////////////////////////

  $scope.createNewTestimonial = function (testimonial, type) {
    // console.log(newTransaction);
    testimonial.type = type;
    console.log(testimonial);
    $http.post('/api/testimonial/create', testimonial)
    .success(function(data) {
      console.log(data);
      data.nameTemp = data.name;
      data.quoteTemp = data.quote;
      if (data.type === 'broker') {
        $scope.brokerTestimonials.list.push(data);
        $scope.newBrokerTestimonial = {};
      } else {
        $scope.borrowerTestimonials.list.push(data);
        $scope.newBorrowerTestimonial = {};
      }
     })
    .error(function (message) {
      console.log(message)
    })
  }

  $scope.deleteBrokerTestimonial = function (testimonial) {
    console.log(testimonial);
    var id = testimonial._id;
    $http.post('/api/testimonial/delete', testimonial)
    .success(function(data) {
      console.log(data);
      for (var i = 0; i < $scope.brokerTestimonials.list.length; i++) {
        if ($scope.brokerTestimonials.list[i]._id === id) {
          console.log(id)
          $scope.brokerTestimonials.list.splice(i, 1);
          break;
        }
      }
    })
    .error(function (message) {
      console.log(message)
    })
  }

  $scope.updateBrokerTestimonial = function (testimonial) {
    console.log(testimonial);
    var id = testimonial._id;
    delete testimonial.update;
    $http.post('/api/testimonial/update', testimonial)
    .success(function(data) {
      console.log(data);
      for (var i = 0; i < $scope.brokerTestimonials.list.length; i++) {
        if ($scope.brokerTestimonials.list[i]._id === id) {
          console.log(id)
          $scope.brokerTestimonials.list.splice(i, 1);
          break;
        }
      }
      data.nameTemp = data.name;
      data.quoteTemp = data.quote;
      $scope.brokerTestimonials.list.push(data);
    })
    .error(function (message) {
      console.log(message)
    })
  }


  $scope.deleteBorrowerTestimonial = function (testimonial) {
    console.log(testimonial);
    var id = testimonial._id;
    $http.post('/api/testimonial/delete', testimonial)
    .success(function(data) {
      console.log(data);
      for (var i = 0; i < $scope.brokerTestimonials.list.length; i++) {
        if ($scope.brokerTestimonials.list[i]._id === id) {
          console.log(id)
          $scope.borrowerTestimonials.list.splice(i, 1);
          break;
        }
      }
    })
    .error(function (message) {
      console.log(message)
    })
  }

  $scope.updateBorrowerTestimonial = function (testimonial) {
    console.log(testimonial);
    var id = testimonial._id;
    delete testimonial.update;
    $http.post('/api/testimonial/update', testimonial)
    .success(function(data) {
      console.log(data);
      for (var i = 0; i < $scope.borrowerTestimonials.list.length; i++) {
        if ($scope.brokerTestimonials.list[i]._id === id) {
          console.log(id)
          $scope.borroweTestimonials.list.splice(i, 1);
          break;
        }
      }
      data.nameTemp = data.name;
      data.quoteTemp = data.quote;
      $scope.borrowerTestimonials.list.push(data);
    })
    .error(function (message) {
      console.log(message)
    })
  }



}]);