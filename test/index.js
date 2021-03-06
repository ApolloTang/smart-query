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

note = '[1] single token of id';
stringToSearch = stringToSearch_standard;
searchQuery = '#123';
assert.equal(search(searchQuery, stringToSearch, note), true);

note = '[2] words not in order, contain id ';
stringToSearch = stringToSearch_standard;
searchQuery = 'the #123';
assert.equal(search(searchQuery, stringToSearch, note), true);

note = '[3] quote as a token';
stringToSearch = stringToSearch_standard;
searchQuery = 'the "jump over the" #123';
assert.equal(search(searchQuery, stringToSearch, note), true);

note = '[4] partial word';
stringToSearch = stringToSearch_standard;
searchQuery = 'og';
assert.equal(search(searchQuery, stringToSearch, note), true);

note = '[5] partial at the end';
stringToSearch = stringToSearch_standard;
searchQuery = '45';
assert.equal(search(searchQuery, stringToSearch, note), true);


note = '[6] partial at the end with \s';
stringToSearch = stringToSearch_standard;
searchQuery = '45';
assert.equal(search(searchQuery, stringToSearch, note), true);

note = '[7] [fail case] partial at the end with \s';
stringToSearch = stringToSearch_standard;
searchQuery = '457';
assert.equal(search(searchQuery, stringToSearch, note), false);

note = '[8] contain regex char';
stringToSearch = stringToSearch_standard;
searchQuery = 'the $10.00 fox';
assert.equal(search(searchQuery, stringToSearch, note), true);

note = '[9] contain regex char';
stringToSearch = stringToSearch_standard;
searchQuery = 'the $';
assert.equal(search(searchQuery, stringToSearch, note), true);

note = '[10] [fail case] contain regex char, un match string';
stringToSearch = stringToSearch_standard;
searchQuery = 'the $20.00';
assert.equal(search(searchQuery, stringToSearch, note), false);

note = '[11] [fail case] if there is only one word, take the search Quary litery, so it will NOT match en in french';
stringToSearch = 'sadf french afdasdf';
searchQuery = 'en ';
assert.equal(search(searchQuery, stringToSearch, note), false);

note = '[12] If there is only one word, take the search Quary litery, so it will match en\\s (spaces after)';
stringToSearch = 'sadf en afdasdf';
searchQuery = 'en     ';
assert.equal(search(searchQuery, stringToSearch, note), true);

note = '[13] [fail case] if there is only one word, take the search Quary litery, so it will match en\\s (spaces after)';
stringToSearch = 'sadf en afdasdf';
searchQuery = '   en';
assert.equal(search(searchQuery, stringToSearch, note), true);

note = '[14] If there is only one word, take the search Quary litery, so it will match en\\s (spaces before and after)';
stringToSearch = 'sadf en afdasdf';
searchQuery = '   en     ';
assert.equal(search(searchQuery, stringToSearch, note), true);

note = '[15] [fail case] if there is only one word, take the search Quary litery, so it will match en\\s (spaces before and after)';
stringToSearch = 'sadf en afdasdf';
searchQuery = '   en   ';
assert.equal(search(searchQuery, stringToSearch, note), true);

note = '[16] If there is only one word, take the search Quary litery, so it will match en\\s (spaces before)';
stringToSearch = 'sadf en afdasdf';
searchQuery = '   en';
assert.equal(search(searchQuery, stringToSearch, note), true);

note = '[17] [fail case] if there is only one word, take the search Quary litery, so it will match en\\s (spaces before)';
stringToSearch = 'sadf en afdasdf';
searchQuery = '   en';
assert.equal(search(searchQuery, stringToSearch, note), true);

note = '[18] if there is only one word, take the search Quary litery, so it will match en\\s (spaces before)';
stringToSearch = '#534606 Interact Innovation CPM CAN Banner MOB FR Geo Fence EXT';
searchQuery = '"FR GEO"  ';
assert.equal(search(searchQuery, stringToSearch, note), true);
console.log('=========================================== test done');
