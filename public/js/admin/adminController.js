var adminApp = angular.module('adminApp', [], function ($interpolateProvider) {
                $interpolateProvider.startSymbol('[[');
                $interpolateProvider.endSymbol(']]');
            	});

adminApp.controller('AdminCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.contacts = {};
  $scope.contacts.viewArchive = false;
  $scope.view = {};
  $scope.view.contacts = true;
  $scope.transactions = {};
  $scope.newTransaction = {};
  $scope.brokerTestimonials = {};
  $scope.borrowerTestimonials = {};
	$http.get('/api/contacts')
  .success(function(data) {
    for (var i = 0; i < data.contacts.length; i++) {
        var date = new Date(data.contacts[i].time)
        data.contacts[i].date = date.toString();
    }
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
      transaction.positionTemp = transaction.position;
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
      testimonial.positionTemp = testimonial.position;
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
      testimonial.positionTemp = testimonial.position;
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
    newTransaction.position = $scope.transactions.list.length;
    $http.post('/api/transaction/create', newTransaction)
    .success(function(data) {
      console.log(data);
      data.nameTemp = data.name;
      data.addTemp = data.address;
      data.monTemp = data.money;
      data.positionTemp = data.position;
      $scope.transactions.list.push(data);
      $scope.newTransaction = {};
      $('#transactionUploader').val(null);
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
      testimonial.name = testimonial.nameTemp;
      testimonial.address = testimonial.addTemp;
      testimonial.money = testimonial.monTemp;
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
    if (testimonial.type === 'broker') {
      testimonial.position = $scope.brokerTestimonials.list.length;
    } else {
      testimonial.position = $scope.borrowerTestimonials.list.length;
    }
    console.log(testimonial);
    $http.post('/api/testimonial/create', testimonial)
    .success(function(data) {
      console.log(data);
      data.nameTemp = data.name;
      data.quoteTemp = data.quote;
      data.positionTemp = data.position;
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


  $scope.deleteItem = function (item, itemType, section) {
    console.log(item);
    var id = item._id;
    var list = section.list;
    $http.post('/api/' + itemType + '/delete', item)
    .success(function(data) {
      console.log(data);
      for (var i = 0; i < list.length; i++) {
        if (list[i]._id === id) {
          console.log(id)
          var position = list[i].positionTemp;
          list.splice(i, 1);
          for (var j = 0; j < list.length; j++) {
            if (list[j].positionTemp > position) {
              list[j].positionTemp--;
            }
          }
          $scope.saveReorder(section);
          break;
        }
      }
    })
    .error(function (message) {
      console.log(message)
    })
  }

  $scope.updateTestimonial = function (testimonial) {
    console.log(testimonial);
    var id = testimonial._id;
    delete testimonial.update;
    $http.post('/api/testimonial/update', testimonial)
    .success(function(data) {
      console.log(data);
      testimonial.name = testimonial.nameTemp;
      testimonial.quote = testimonial.quoteTemp;
    })
    .error(function (message) {
      console.log(message)
    })
  }

  $scope.moveToTop = function (list, currentPosition) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].positionTemp < currentPosition) {
        list[i].positionTemp++;
      } else if (list[i].positionTemp == currentPosition) {
        list[i].positionTemp = 0;
      }
    }
  }

  $scope.moveUp = function (list, currentPosition) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].positionTemp == currentPosition - 1) {
        list[i].positionTemp++;
      } else if (list[i].positionTemp == currentPosition) {
        list[i].positionTemp--;
      }
    }
  }

  $scope.moveDown = function (list, currentPosition) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].positionTemp == currentPosition + 1) {
        list[i].positionTemp--;
      } else if (list[i].positionTemp == currentPosition) {
        list[i].positionTemp++;
      }
    }
  }

  $scope.moveToBottom = function (list, currentPosition) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].positionTemp > currentPosition) {
        list[i].positionTemp--;
      } else if (list[i].positionTemp == currentPosition) {
        list[i].positionTemp = list.length - 1;
      }
    }
  }

  $scope.cancelReorder = function (section) {
    var list = section.list
    for (var i = 0; i < list.length; i++) {
      list[i].positionTemp = list[i].position;
    }
    section.updateOrder = false;
  }

  $scope.saveReorder = function (section, itemType) {
    var list = section.list
    console.log(list);
    for (var i = 0; i < list.length; i++) {
      if (list[i].position != list[i].positionTemp) {
         var item = list[i];
         // update the position of this testimonial
         $http.post('/api/' + itemType + '/update', item)
          .success(function(data) {
            item.position = item.positionTemp;
        })
      }
    }
    section.updateOrder = false;
  }


  $scope.toggleArchive = function (contact) {
    contact.archived = !contact.archived;
    $http.post('/api/contact/toggleArchive', contact)
      .success(function(data) {
        contact._id = data._id;
      })
  }

  $scope.deleteContact = function (contact) {
    var id = contact._id;
    var list = $scope.contacts.list;
    $http.post('/api/contact/delete', contact)
    .success(function(data) {
      console.log(data);
      for (var i = 0; i < list.length; i++) {
        if (list[i]._id === id) {
          console.log(id)
          list.splice(i, 1);
          break;
        }
      }
    })
    .error(function (message) {
      console.log(message)
    })
  }



}]);