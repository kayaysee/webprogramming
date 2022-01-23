app.controller('PersonsCtrl', [ '$http', 'lib', function($http, lib) {
    console.log('PersonsCtrl started')
    let ctrl = this

    ctrl.clickedRow = -1

    ctrl.persons = []

    ctrl.person = {
        firstName: '',
        lastName: '',
        year: 2000
    }

    ctrl.amount = 0
    ctrl.from = ctrl.to = null
    ctrl.group = null
    
    ctrl.new = function() {
        console.log(ctrl.group)
        ctrl.person.group = ctrl.group
        $http.post('/person', ctrl.person).then(function(res) {
            ctrl.persons = res.data
        }, function(err) {
            console.error(err.data)
        })
    }

    ctrl.modify = function() {
        let _id = ctrl.persons[ctrl.clickedRow]._id
        $http.put('/person?_id=' + _id, ctrl.person).then(function(res) {
            ctrl.persons = res.data
        }, function(err) {
            console.error(err.data)
        })
    }

    ctrl.delete = function(_id) {
        $http.delete('/person?_id=' + _id).then(function(res) {
            ctrl.persons = res.data
        }, function(err) {
            console.error(err.data)
        })
    }

    ctrl.copy = function(n) {
        ctrl.person.firstName = ctrl.persons[n].firstName
        ctrl.person.lastName = ctrl.persons[n].lastName
        ctrl.person.year = ctrl.persons[n].year
        ctrl.clickedRow = n
    }

    ctrl.isPersonDataCorrect = function() {
        return ctrl.person.firstName && ctrl.person.lastName && ctrl.person.year >= 1500
    }

    ctrl.isAdmin = function() {
        return lib.role == 'admin'
    }

    // retrieve persons list on start
    $http.get('/person').then(function(res) {
        ctrl.persons = res.data
        ctrl.from = ctrl.to = ctrl.persons[0]._id
    }, function(err) {
        console.error(err.data)
    })

    $http.get('/group').then(function(res) {
        ctrl.groups = res.data
        ctrl.from = ctrl.to = ctrl.groups[0]._id
    }, function(err) {
        console.error(err.data)
    })

}])