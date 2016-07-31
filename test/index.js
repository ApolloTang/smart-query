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


var stringToSearch_standard = '#123 the #qu#ick fox jump over the lazy $10.00 dog #1945';

note = '[1]';
stringToSearch = stringToSearch_standard;
searchQuery = '#123';
assert.equal(search(searchQuery, stringToSearch, note), true);

note = '[2]';
stringToSearch = stringToSearch_standard;
searchQuery = 'the #123';
assert.equal(search(searchQuery, stringToSearch, note), true);

note = '[3]';
stringToSearch = stringToSearch_standard;
searchQuery = 'the "jump over the" #123';
assert.equal(search(searchQuery, stringToSearch, note), true);

note = '[4] partial';
stringToSearch = stringToSearch_standard;
searchQuery = 'og';
assert.equal(search(searchQuery, stringToSearch, note), true);


note = '[5] partial at the end';
stringToSearch = stringToSearch_standard;
searchQuery = '45';
assert.equal(search(searchQuery, stringToSearch, note), true);

console.log('=========================================== test done');
