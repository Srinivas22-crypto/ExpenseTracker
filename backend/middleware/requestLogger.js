const morgan = require('morgan');
const colors = require('../utils/colors');

// Skip logging for 304 (Not Modified) responses to reduce console spam
const skip304 = (req, res) => {
  return res.statusCode === 304;
};

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
}, {
  skip: skip304, // Skip 304 responses
});

module.exports = requestLogger;

