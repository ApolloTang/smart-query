var _ = require('lodash');



function searchStringTokensRegExGenerator (searchQuery, flags) {
    // Generate regular expression to match a text string that
    // contains given words regardless of word order unless the
    // words are double-quoted (a la google).
    //
    // Additionally, it allow searching for id where the leading "#"
    // is optional in the search query (both 123 and #123 will match #123)
    //
    // Example: a query of
    //      'the #123 #qu#ick "fox jump"  the"lazy $10.00"dog 1945'
    // will match text:
    //      #123 the #qu#ick fox jump over the lazy $10.00 dog #1945
    //
    // -- Author: Apollo Tang
    // -- Repo: git@github.com:ApolloTang/smart-query.git

    var debug = true;

    // Create a regexObj that search for regex token
    var _regexTokens = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ];
    var _regexObj_reEscape = new RegExp('(\\' + _regexTokens.join('|\\') + ')', 'g');

    // Separate words or quoted words into elements in array
    var matches = searchQuery.match( /([^ ]*)"[^"]+"([^ ]*)|[^ ]+/g ) || [];
    if (debug) console.log('matches: ', matches);

    // As an example, if we had a search query string that looks like:
    //      'one two "three four" aaa"bbb"ccc #123'
    // matches will look like:
    //      ["one", "two", ""three four"", "aaa"bbb"ccc", "#123"]
    // Next, we need to split the item "aaa"bbb"ccc" into aaa, "bbb", ccc.
    // To wit, we want matches2 to look like:
    //      ["one", "two", ""three four"", "aaa", ""bbb"", "ccc", "#123"]

    var matches2 = [];
    _.each( matches , function (item, k) {
        var isLikeQuoted = /([^ ]*)("[^"]+")([^ ]*)/g.test(item);
        if (debug) console.log('islikequoted: ', isLikeQuoted );
        var isQuoted = false;
        if (isLikeQuoted) {
            const islikequoted_parts = /([^ ]*)("[^"]+")([^ ]*)/.exec(item).splice(1);
            if (debug) console.log('islikequoted_parts islikequoted_parts: ', islikequoted_parts  );
            // only push into matches2 if $1, $2, $3 is not empth string
            if (islikequoted_parts[0]) matches2.push(islikequoted_parts[0]);
            if (islikequoted_parts[1]) matches2.push(islikequoted_parts[1]);
            if (islikequoted_parts[2]) matches2.push(islikequoted_parts[2]);
        } else {
            matches2.push(item);
        }
    });

    if (debug) console.log('matches2: ', matches2);

    // Now we have to deal with word that looks like:
    //      #123, "The quick fox jump", $10.00
    // meaning, we need to remove '"' and '#', then re-escape regex tokens
    // As a example, we have matches2 of the following:
    //      ["one", "two", "#123", ""The quick fox jump"", "$10.00"]
    // we transform it into:
    //      words = ["one", "two", "123", "The quick fox jump", "\$10\.00"]

    var words = _.map( matches2 , function (item, k) {
        var word;
        var isQuoted = /"[^"]+"/g.test(item);
        if (debug) console.log('isQuoted: ', isQuoted );
        if (isQuoted) {
            if (debug) console.log('item: ', item);
            word = item.match( /^"(.*)"$/ )[1]; // content captured btw quote
        } else {
            // Remove '#' in the begining of word starting w digit
            // so that '#123' and '123' is the same thing in the query string
            word = item.replace(/^#(\d.*)$/, '$1');
        }

        if (debug) console.log('word: ', word);

        // Next we want to excape regEx token, this is because
        // query string will become part of generated regEx
        // and we want regEx token to be taken literary.
        var word_regEx_escaped = word.replace(_regexObj_reEscape, '\\$1' );

        if (debug) console.log('word_regEx_escaped: ', word_regEx_escaped);
        return word_regEx_escaped;
    });
    if (debug) console.log('words: ', words);

    // Now we can generating RegExString
    var generatedRegEx;
    var firstStart = '(\\s|^|#)';
    var start = '(\\s|^|#)';
    var end = '(\\s|$)';
    var finalEnd = '';

    if (words.length >= 2) {
        // Generate regular expression string that look like:
        //  /(?=.*(\s|^|#)one(\s|$))(?=.*(\s|^|#)two(\s|$))(?=.*(\s|^|#)three)/gim?
        var wordLast = words.splice(words.length-1);  // We have ability to treat final word differently, if we want to
        var wordsBeforeLast = words; // array for words without final word
        if (debug) console.log('wordsBeforeLast: ', wordsBeforeLast);
        if (debug) console.log('wordLast: ', wordLast);

        generatedRegEx = '(?=.*'+firstStart+wordsBeforeLast.join(  end+')(?=.*'+start ) + end+')(?=.*'+start+wordLast+finalEnd+')';
    } else if (words.length === 1 ) {
        // When there is only one word we use the original searchQuery and use it literally so that space at both end is included
        var onlyWord = words[0];
        if (debug) console.log('onlyWord: ', onlyWord);

        // But we want to treat multiple space as one space
        // so we first look if 3 different cases:

        // first we create a temperary RegEx for check where the space are
        var tmp_generatedRegEx = searchQuery.replace(_regexObj_reEscape, '\\$1' );
        if (debug) console.log('>tmp_generatedRegEx<: ', '>'+tmp_generatedRegEx+'<' );

        // now we check these three cases:
        var isSpacesAfterWord = /^\S+\s+$/gmi.test(tmp_generatedRegEx);
        var isSpacesBeforeWord = /^\s+\S+$/gmi.test(tmp_generatedRegEx);
        var isSpacesBeforeAndAfterWord = /^\s+\S+\s+$/gmi.test(tmp_generatedRegEx);

        if (debug) console.log('isSpacesAfterWord: ', isSpacesAfterWord )
        if (debug) console.log('isSpacesBeforeWord: ', isSpacesBeforeWord )
        if (debug) console.log('isSpacesBeforeAndAfterWord: ', isSpacesBeforeAndAfterWord )

        if (isSpacesAfterWord) {
            generatedRegEx = onlyWord+' ';
        } else if (isSpacesBeforeWord) {
            generatedRegEx = ' '+onlyWord;
        } else if (isSpacesBeforeAndAfterWord) {
            generatedRegEx = ' '+onlyWord+' ';
        } else {
            generatedRegEx = onlyWord;
        }

        if (debug) console.log('here generatedRegEx: ', '>'+generatedRegEx+'<');
    } else {
        generatedRegEx = '.^'; // match nothing
    }

    if (debug) console.log('generatedRegEx: ', generatedRegEx);

    // Create RegExObject
    var _flags = flags || 'gmi';
    var generatedRegEx_obj = new RegExp(generatedRegEx, _flags);

    if (debug) console.log('generatedRegEx_obj: ', generatedRegEx_obj);

    return generatedRegEx_obj;
}
module.exports = searchStringTokensRegExGenerator;

