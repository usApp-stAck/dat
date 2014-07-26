var request = require('request')
var duplexify = require('duplexify')


module.exports = function(backend, remote) {
  var wrap = {}

  // turtles
  wrap.backend = backend.backend

  wrap.createReadStream = function(hash) {
    var dup = duplexify()
    
    backend.exists(hash, function(err, exists) {
      if (err) return dup.destroy(err)
      var stream
      if (exists) stream = backend.createReadStream(hash)
      else stream = request(remote + '/api/blobs/' + hash)
      dup.setWritable(false)
      dup.setReadable(stream)
    })
    
    return dup
  }

  wrap.createWriteStream = function() {
    return backend.createWriteStream.apply(backend, arguments)
  }
  
  wrap.exists = function(hash, cb) {
    backend.exists(hash, function(err, exists) {
      if (err) return cb(err)
      if (exists) return cb(null, exists)
      request({method: "HEAD", url: remote + '/api/blobs'}, function(err, resp) {
        if (err) return cb(err)
        cb(null, resp.statusCode === 200 ? true : false)
      })
    })
  }

  return wrap
}