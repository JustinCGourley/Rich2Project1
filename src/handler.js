const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);
const createPage = fs.readFileSync(`${__dirname}/../client/clientCreate.html`);

const users = {};

const getPage = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCreatePage = (request, response) => {
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(createPage);
  response.end();
}

const getStyle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(style);
  response.end();
};

const getUsers = (request, response) => {
  if (request.method === 'GET') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(users));
  } else if (request.method === 'HEAD') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
  }
  response.end();
};

const addUser = (request, response, body) => {
  if (request.method === 'POST') {
    if (body.name && body.password) {
      if (users[body.name]) {
        users[body.name].password = body.password;
        response.writeHead(204);
      } else {
        users[body.name] = { name: body.name, age: body.password };
        response.writeHead(201, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ message: 'Created successfully.' }));
      }
    } else {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify({ message: 'Name and password are both required.', id: 'missingParams' }));
    }
    response.end();
  }
};

const getNotFound = (request, response) => {
  response.writeHead(404, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify({ message: 'The page you are looking for was not found.', id: 'notFound' }));
  response.end();
};

const getNotReal = (request, response) => {
  if (request.method === 'GET') {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify({ message: 'The page you are looking for was not found.', id: 'notFound' }));
  } else if (request.method === 'HEAD') {
    response.writeHead(404, { 'Content-Type': 'application/json' });
  }

  response.end();
};

module.exports.getPage = getPage;
module.exports.getStyle = getStyle;
module.exports.getUsers = getUsers;
module.exports.addUser = addUser;
module.exports.getNotReal = getNotReal;
module.exports.getNotFound = getNotFound;
module.exports.getCreatePage = getCreatePage;