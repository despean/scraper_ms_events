'use strict';

var _crawler = require('crawler');

var _crawler2 = _interopRequireDefault(_crawler);

var _unirest = require('unirest');
var util = require('util');
var fs = require('fs');
var _unirest2 = _interopRequireDefault(_unirest);
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};


function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventsMs = function eventsMs() {
    var proxy = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    var dates = getDates();
    var Request = _unirest2.default.get(`https://geteventsservice.one.microsoft.com/api/Search/?RequestId=e208d606-3d4e-49cf-b999-16e3c9687105&SortBy=StartDate&SortOrder=asc&isPublishable=true&resultCount=0&selectedView=1&skipCount=0`);
    //set request proxy hear for the above request
  // Request.proxy('http://wwwproxy.gisa-halle.de:8080')
    var c = new _crawler2.default();
    c.queue([{
        uri: 'https://events.microsoft.com/',
       // limiter:'http://wwwproxy.gisa-halle.de:8080',
       //proxy:'http://wwwproxy.gisa-halle.de:8080',
        callback: function callback(error, res, done) {
            if (error) {} else {
                var $ = res.$;
                Request.headers({
                    'Authorization': $('input').attr('value'),
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
                    'Accept': 'application/json, text/plain, */*'
                }).end(function (response) {
				console.log(response.body.Events.length)
                   fs.writeFileSync('./dataMicrosoft.json', util.inspect(response.body.Events,true, 5,true), 'utf-8');
                });
            }
            done();
        }
    }]);
};

var eventsHe = function eventsHe() {
    var proxy = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    var c = new _crawler2.default();
    c.queue([{
        uri: 'https://www.heise-events.de/',
         //limiter:'http://wwwproxy.gisa-halle.de:8080',
         // proxy:'http://wwwproxy.gisa-halle.de:8080',
        callback: function callback(error, res, done) {
            var event = void 0;
            if (error) {
                console.log(error);
            } else {
                var $ = res.$;
                event = $('#contentWrapper > div:nth-child(1) > article').map(function (i, el) {
                    return {
                        'title': $(el).find('h3').text().trim(),
						'description' : $(el).find('p').text(),
                        'image': 'https://www.heise-events.de' + $(el).find('img').attr('src').trim(),
                        'link': 'https://www.heise-events.de' + $(el).find('p:nth-child(5) > em:nth-child(1) > a').attr('href'),
                        'date': $(el).find('p.small').text().split(',')[0],
						'location' :$(el).find('p.small').text().split(',')[1]

                    };
                }).get();
            }
            console.log(event);
            done();
        }
    }]);
};

var getDates = function getDates() {
    var datenow = new Date();
    return {
        today: new Date(datenow.setHours(1, 1, 1)).toISOString(),
        inMonth: new Date(datenow.setMonth(datenow.getMonth() + 1)).toISOString()
    };
};
//eventsHe();
eventsMs();