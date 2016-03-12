# smart-query

Generate regular expression to match a text string that
contains given words regardless of word order unless the
words are double-quoted (a la google).

Additionally, it allow searching for id where the leading "#"
is optional in the search query (both 123 and #123 will match #123)

Example: a query of
     'the #123 #qu#ick "fox jump"  the"lazy $10.00"dog 1945'
will match text:
     #123 the #qu#ick fox jump over the lazy $10.00 dog #1945


