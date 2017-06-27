### Create/delete Calendar .ics file for certain Player

###Main features:
- detect user and validate his rights;
- validate provided data for calendar creation;
- update Calendar file upon any connected changes (e.g. status change, event properties change);

###Steps of usage:
- iOS mobile app requests .ics file creation;
- server creates file and sends as a responce link to this file;
- mobile application forms webcal protocol link and opens it in iOS Calendar;
- each 5 minutes (as a default, can be changed) iOS Calendar application get current file state and provides necessary updates;
- user can un-subscribe from his Calendar link or change it's type (possible types - All events and My events);

### Back-end stack:
PHP 7.0, Zend Framework 2.4, Apigility 1.3, MySQL 5.6

###Calendar specification excerpts:
http://www.kanzaki.com/docs/ical/
