const lib = require('./lib')
const db = require('./db')

const group = module.exports = {
  
    validate: function(group) {
        let groupFixed = { name: group.name}
        if(groupFixed.name) {
            return groupFixed
        } else {
            return null
        }
    },

    sendData: function(res) {
        db.groups.find().toArray(function(err, data) {
            if(!err) 
                lib.sendJson(res, data)
            else
                lib.sendError(res, 400, err.message)
        })    
    },

    handle: function(env) {
        let _id = db.ObjectId(env.urlParsed.query._id)
        switch(env.req.method) {
            case 'GET':
                group.sendData(env.res)
                break
            case 'POST':
                let newgroup = group.validate(env.payload)
                if(newgroup) {
                    newgroup.balance = 0
                    db.groups.insertOne(newgroup, function(err, res) {
                        if(!err) {
                            group.sendData(env.res)
                        } else {
                            lib.sendError(env.res, 400, 'Creating new object failed')
                        }
                    })
                } else {
                    lib.sendError(env.res, 400, 'group data is invalid')
                }
                break
            case 'PUT':
                let modifiedgroup = group.validate(env.payload)
                if(modifiedgroup) {
                    db.groups.findOneAndUpdate({ _id: _id }, { $set: modifiedgroup }, function(err, res) {
                        if(!err) {
                            group.sendData(env.res)
                        } else {
                            lib.sendError(env.res, 400, 'Updating object ' + _id + ' failed')
                        }
                    })
                } else {
                    lib.sendError(env.res, 400, 'group data is invalid')
                }
                break        
            case 'DELETE':
                db.groups.findOneAndDelete({ _id: _id }, function(err, res) {
                    if(!err) {
                        group.sendData(env.res)
                    } else {
                        lib.sendError(env.res, 400, 'Deleting object ' + _id + ' failed')
                    }
                })
                break    
           default:
                lib.sendError(env.res, 405, 'Method not implemented')
        }
    }
}