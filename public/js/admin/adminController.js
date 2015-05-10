var adminApp = angular.module('adminApp', [], function ($interpolateProvider) {
                $interpolateProvider.startSymbol('[[');
                $interpolateProvider.endSymbol(']]');
            	});

adminApp.controller('AdminCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.contacts = {};
  $scope.contacts.viewArchive = false;
  $scope.view = {};
  $scope.view.contacts = true;
  // $scope.currtype = 'team'; 
  // $scope.currtypeDisplay = 'Team';
  $scope.transactions = {};
  $scope.newTransaction = {};
  $scope.brokerTestimonials = {};
  $scope.borrowerTestimonials = {};
  // $scope.team = {};
  // $scope.team.list = [];
  // $scope.currlist = $scope.team.list;


  $scope.getContacts = function() {
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
  }
  $scope.getContacts();


  $scope.getTransactions = function() {
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
  }
  $scope.getTransactions();

  $scope.getEntities = function(type, cancel) {
    $http.get('/api/entities/' + type)
    .success(function(data) {
    console.log(data);
    $scope[type] = {};
    if (data.length > 0) {
      console.log(data[0]._id);
      $scope[type].id = data[0]._id
      $scope[type].list = data[0].list;
      $scope[type].type = data[0].type;
    } else {
      console.log(type + ": not found!")
      $scope[type].list = [[{"val": 'one'},{"val": 'two'}],[{"val": 'three'},{"val": 'four'}]];
      $scope[type].type = type;
    }

    if (cancel) {
      $scope.currlist = $scope[type].list
      $scope.currtype = $scope[type].type
    }
    console.log($scope[type]);
  })
  .error(function (message) {
    console.log('failed to load ' + type + ': ' + message);
  });
  }

  $scope.getEntities('team', false);
  $scope.getEntities('lawyers', false);
  $scope.getEntities('appraisers', false);
  $scope.getEntities('investment', false);
  $scope.getEntities('residential', false);
  $scope.getEntities('glossaryquestions', false);
  $scope.getEntities('glossaryterms', false);
  $scope.getEntities('credit', false);
  $scope.getEntities('massgov', false);
  $scope.getEntities('owner', false);
  $scope.getEntities('commercial', false);
  $scope.getEntities('construction', false);
  $scope.getEntities('about', false);


  $scope.getMeta = function() {
    $http.get('/api/meta')
    .success(function(data) {
    console.log(data);
    if (data.length > 0) {
      var id = data[0]._id
      delete data[0]._id
      $scope.meta = data[0]
      $scope.meta.id = id;
    } else {
      console.log("meta not found!")
      $scope.meta = {};
      $scope.meta.bannerTitle = "County Mortgage LLC";
      $scope.meta.bannerSubtextBig = "Residential and Commercial Lending in Eastern Massachusetts";
      $scope.meta.bannerSubtextSmall = "Appartments, Homes, Condos, Retail";
      $scope.meta.homeAboutHeader = "Who We Are";
      $scope.meta.homeAboutText = "Morbi eleifend congue elit nec sagittis. Praesent aliquam lobortis tellus, nec consequat vitae Morbi eleifend congue elit nec sagittis. Praesent aliquam lobortis tellus, nec consequat vitae Morbi eleifend congue elit nec sagittis. Praesent aliquam lobortis tellus, nec consequat vitae Morbi eleifend congue";
      $scope.meta.homeSectionsHeader = "Need A Loan? Let Us Help You";
      $scope.meta.homeSection1Header = "Loan Parameters";
      $scope.meta.homeSection2Header = "Payment Portal";
      $scope.meta.homeSection3Header = "Contact Us";
      $scope.meta.homeSection1Text = "Find out the details of the different loans we offer.";
      $scope.meta.homeSection2Text = "Already recieved a loan? Try out our Payment Portal to pay your bills online.";
      $scope.meta.homeSection3Text = "Need more information? Feel free to contact us with any questions or concers.";
      $scope.meta.homeSection1Icon = "list-ol";
      $scope.meta.homeSection2Icon = "money";
      $scope.meta.homeSection3Icon = "envelope";
      $scope.meta.homeSection1Link = "loan-criteria";
      $scope.meta.homeSection2Link = "https://ssl.selectpayment.com/cpp/countymortgage/Login.aspx";
      $scope.meta.homeSection3Link = "contact";
      $scope.meta.nmlsNumber = "2162";
      $scope.meta.address = "123 Fake Street, LN1 2ST, London, United Kingdom";
      $scope.meta.phone = "+44 123 654321";
      $scope.meta.fax = "+44 123 654321";
      $scope.meta.email = "getintoutch@yourcompanydomain.com";
      $scope.meta.paymentLink = "https://ssl.selectpayment.com/cpp/countymortgage/Login.aspx";
    }
  })
  .error(function (message) {
    console.log('failed to load meta: ' + message);
  });
  }

  $scope.getMeta();




  // $http.get('/api/testimonials/broker')
  // .success(function(data) {
  //   console.log(data);
  //   $scope.brokerTestimonials.list = data;
  //   for (var i = 0; i < $scope.brokerTestimonials.list.length; i++) {
  //     var testimonial = $scope.brokerTestimonials.list[i];
  //     testimonial.nameTemp = testimonial.name;
  //     testimonial.quoteTemp = testimonial.quote;
  //     testimonial.positionTemp = testimonial.position;
  //   }
  // })
  // .error(function (message) {
  //   console.log('failed to load contacts' + message);
  // });


  // $http.get('/api/testimonials/borrower')
  // .success(function(data) {
  //   console.log(data);
  //   $scope.borrowerTestimonials.list = data;
  //   for (var i = 0; i < $scope.borrowerTestimonials.list.length; i++) {
  //     var testimonial = $scope.borrowerTestimonials.list[i];
  //     testimonial.nameTemp = testimonial.name;
  //     testimonial.quoteTemp = testimonial.quote;
  //     testimonial.positionTemp = testimonial.position;
  //   }
  // })
  // .error(function (message) {
  //   console.log('failed to load contacts' + message);
  // });


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
      transaction.name = transaction.nameTemp;
      transaction.address = transaction.addTemp;
      transaction.money = transaction.monTemp;
    })
    .error(function (message) {
      console.log(message)
    })
  }

///////////////////////////////////////////////////////////////////////
//                   CRUD Operations for Testimonials                //
///////////////////////////////////////////////////////////////////////

  // $scope.createNewTestimonial = function (testimonial, type) {
  //   // console.log(newTransaction);
  //   testimonial.type = type;
  //   if (testimonial.type === 'broker') {
  //     testimonial.position = $scope.brokerTestimonials.list.length;
  //   } else {
  //     testimonial.position = $scope.borrowerTestimonials.list.length;
  //   }
  //   console.log(testimonial);
  //   $http.post('/api/testimonial/create', testimonial)
  //   .success(function(data) {
  //     console.log(data);
  //     data.nameTemp = data.name;
  //     data.quoteTemp = data.quote;
  //     data.positionTemp = data.position;
  //     if (data.type === 'broker') {
  //       $scope.brokerTestimonials.list.push(data);
  //       $scope.newBrokerTestimonial = {};
  //     } else {
  //       $scope.borrowerTestimonials.list.push(data);
  //       $scope.newBorrowerTestimonial = {};
  //     }
  //    })
  //   .error(function (message) {
  //     console.log(message)
  //   })
  // }

  // <div class="btn btn-default" ng-click="deleteTerm('team', '$parent.$index', '$index')">Delete Term</div>
  //   </div>
  //   <div class="btn btn-default" ng-click="addTerm('team', '$parent.$index')">Add Term</div>
  //   <div class="btn btn-default" ng-click="deleteEntity('team', '$parent.$index')">Delete Entity</div>
  // </div>
  // <div class="btn btn-default" ng-click="addEntity('team')">Add Entity</div>


  $scope.deleteTerm = function (type, parentIndex, termIndex) {
    console.log($scope[type].list)
    console.log(parentIndex, termIndex)
    $scope[type].list[parentIndex].splice(termIndex, 1);
  }  

  $scope.addTerm = function (type, parentIndex) {
    console.log(parentIndex)
    console.log($scope[type].list)
    $scope[type].list[parentIndex].push({"val":""});
  }  

  $scope.deleteEntity = function (type, parentIndex) {
    $scope[type].list.splice(parentIndex, 1);
  }  

  $scope.addEntity = function (type) {
    $scope[type].list.push([{"val":""}])
  }  

  // <div class="btn btn-default" ng-click="saveEntities('team')">Save</div>
  // <div class="btn btn-default" ng-click="cancleEntities('team')">Cancel</div>

  $scope.saveEntities = function (type) {
    $http.post('/api/entities/save', $scope[type])
    .success(function(data) {
      data.id = data._id
      delete data._id
      $scope[type] = data
      $scope.currlist = $scope[type].list
      $scope.currtype = $scope[type].type
      console.log("save successful!")
      console.log(data)
    })
    .error(function (message) {
      console.log(message)
    })
  }  

  $scope.cancelEntities = function (type) {
    console.log("refresh");
    $scope.getEntities(type, true);
  }  

  $scope.saveMeta = function () {
    $http.post('/api/meta/save', $scope.meta)
    .success(function(data) {
      data.id = data._id
      delete data._id
      $scope.meta = data
      console.log("save successful!")
      console.log(data)
    })
    .error(function (message) {
      console.log(message)
    })
  }  

  $scope.cancelMeta = function () {
    console.log("refresh meta");
    $scope.getMeta();
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