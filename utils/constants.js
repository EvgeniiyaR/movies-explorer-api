const URL_PATTERN = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
const ID_PATTERN = /^[a-z0-9]+$/;
const DB_URL_DEV = 'mongodb://127.0.0.1:27017/bitfilmsdb';
const PORT_DEV = 3000;

module.exports = {
  URL_PATTERN,
  ID_PATTERN,
  DB_URL_DEV,
  PORT_DEV,
};
