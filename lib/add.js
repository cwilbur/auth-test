module.exports = function() {
  var args = [].slice.call(arguments);
  return args.reduce(function(previous, current) {
    return previous + current;
  });
};
