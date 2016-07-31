var assert = require('assert');
var searchStringTokensRegExGenerator = require('../');

function search(searchQuery, text, note) {
    var found = searchStringTokensRegExGenerator(searchQuery).test(text);
    console.log('------------------------- test result start')
    var note = note || '';
    console.log('note:', note);
    console.log('string to search: ', text);
    console.log('search query: ', searchQuery);
    console.log('found: ', found );
    console.log('------------------------- test result end');
    console.log('');
    return found;
}

var  stringToSearch = '';
var  searchQuery = '';
var  note = '';


note = '[1]';
stringToSearch = 'Hello world';
searchQuery = 'Hello';
assert.equal(search(searchQuery, stringToSearch, note), true);

note = '[2]';
stringToSearch = 'Hello world';
searchQuery = 'world hello';
assert.equal(search(searchQuery, stringToSearch, note), true);

console.log('=========================================== test done');
