function LocalScoreManager() {
  this.key     = "bestScore";
  this.storage = chrome.storage.local;
}

LocalScoreManager.prototype.get = function (fn) {
  return this.storage.get(this.key, function(result){
	var score = 0;
	for(var k in result) {score = result[k]; break;}
	fn.call(this, score);
  });
};

LocalScoreManager.prototype.set = function (score) {
  var data = {};
  data[this.key] = score;
  this.storage.set(data);
};

