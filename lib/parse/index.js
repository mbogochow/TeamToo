var fs = require('fs');

function Parser() {
  if (!(this instanceof Parser))
    return new Parser(arguments);
  return this;
}

Parser.prototype.parseFile = function(filename) {
  fs.readFile(filename, 'utf8', function (err,data) {
    if (err) return console.error(err.msg);
    var dict = {};
    data.split(/\W+/).forEach( function (word) {
      var w = word.toLowerCase();
      if (dict[w] === undefined)
        dict[w] = 1;
      else
        dict[w] = dict[w] + 1;
    });
    
    var wordList = fs.readFileSync('wordfreq.tsv', 'utf8').split(/\W+/);
    for (var i = 0; i<wordList.length; i++) {
      wordList[i] = wordList[i].toLowerCase();
    }
    
    for (var word in dict) {
      if (wordList.indexOf(word) !== -1)
        delete(dict[word]);
    }
    
    var i = 0, j = 0;
    for (var word in dict) {
      i++;
      if (dict[word] > 100) {
        j++;
        console.log(word + ':      \t' + dict[word]);
      }
    }
    console.log('\n' + i + ' words total, ' + j + ' displayed.');
  });
}

module.exports = new Parser();
