app.controller('GroupsCtrl', [ '$http', 'lib', function($http, lib) {
    console.log('GroupsCtrl started')
    let ctrl = this

    ctrl.clickedRow = -1

    ctrl.groups = []

    ctrl.group = {
        name: ''
    }


    ctrl.new = function() {
        ctrl.person.group = ctrl.group
        $http.post('/group', ctrl.group).then(function(res) {
            ctrl.groups = res.data
        }, function(err) {
            console.error(err.data)
        })
    }

    ctrl.modify = function() {
        let _id = ctrl.groups[ctrl.clickedRow]._id
        $http.put('/group?_id=' + _id, ctrl.group).then(function(res) {
            ctrl.groups = res.data
        }, function(err) {
            console.error(err.data)
        })
    }

    ctrl.delete = function(_id) {
        $http.delete('/group?_id=' + _id).then(function(res) {
            ctrl.groups = res.data
        }, function(err) {
            console.error(err.data)
        })
    }

    ctrl.copy = function(n) {
        ctrl.group.name = ctrl.groups[n].name
        ctrl.clickedRow = n
    }

    ctrl.isGroupDataCorrect = function() {
        return ctrl.group.name
    }

    ctrl.isAdmin = function() {
        return lib.role == 'admin'
    }

    // retrieve groups list on start
    $http.get('/group').then(function(res) {
        ctrl.groups = res.data
    }, function(err) {
        console.error(err.data)
    })

}])