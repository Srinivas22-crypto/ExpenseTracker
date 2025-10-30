const morgan = require('morgan');
const colors = require('../utils/colors');

const requestLogger = morgan((tokens, req, res) => {
  const status = tokens.status(req, res);
  const statusColor =
    status >= 500
      ? 'red'
      : status >= 400
      ? 'yellow'
      : status >= 300
      ? 'cyan'
      : 'green';

  return [
    colors.blue(tokens.method(req, res)),
    colors[statusColor](tokens.status(req, res)),
    colors.white(tokens.url(req, res)),
    colors.yellow(tokens['response-time'](req, res) + ' ms'),
  ].join(' ');
});

module.exports = requestLogger;

