const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);
const createPage = fs.readFileSync(`${__dirname}/../client/clientCreate.html`);

const users = {
  test: {
    name: 'test',
    password: 'testPass',
    data: [{
      amount: 100, date: '2019-01-01', description: 'Bought this as a test', type: 'Personal',
    }],
  },
};

const getPage = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCreatePage = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(createPage);
  response.end();
};

const getStyle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(style);
  response.end();
};

const checkUser = (request, response, params) => {
  console.dir(params);

  if (users[params.name] === undefined) {
    console.dir('none found');
    response.writeHead(401, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify({ message: 'Bad Login Given', error: 'Unauthroized' }));
  } else
  if (users[params.name].password === params.password) {
    console.dir('good');
    response.writeHead(200, { 'Content-Type': 'application/json' });
    let dataToReturn = [];
    if (params.num === '0') {
      dataToReturn = users[params.name].data;
    } else {
      for (let i = 0; i < params.num; i++) {
        if (users[params.name].data[i] !== null && users[params.name].data[i] !== undefined) {
          dataToReturn.push(users[params.name].data[i]);
        }
      }
    }

    response.write(JSON.stringify(
      { user: params.name, name: users[params.name].name, data: dataToReturn },
    ));
  } else {
    console.dir('bad');
    response.writeHead(401, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify({ message: 'Bad Login Given', error: 'Unauthroized' }));
  }

  response.end();
};

const addData = (request, response, body) => {
  console.dir('Add data');
  console.dir(body);
  if (request.method === 'POST') {
    if (body.amount && body.date && body.description && body.type) {
      response.writeHead(201, { 'Content-Type': 'application/json' });
      users[body.user].data.push({
        amount: body.amount, date: body.date, description: body.description, type: body.type,
      });

      let dataToReturn = [];
      if (body.num === '0') {
        dataToReturn = users[body.user].data;
      } else {
        for (let i = 0; i < body.num; i++) {
          if (users[body.user].data[i] !== null && users[body.user].data[i] !== undefined) {
            dataToReturn.push(users[body.user].data[i]);
          }
        }
      }
      response.write(JSON.stringify(
        { user: body.user, name: users[body.user].name, data: dataToReturn },
      ));
    } else {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify({ message: 'All fields must be filled.', id: 'missingParams' }));
    }
    response.end();
  }
};

const addUser = (request, response, body) => {
  console.dir(body);
  if (request.method === 'POST') {
    if (body.user && body.password) {
      if (users[body.user] && body.canUpdatePassword === 'true') {
        users[body.user].password = body.password;
        response.writeHead(204);
        console.dir(`updated user password to [${body.user}] - ${body.password}`);
      } else if (users[body.user] && body.canUpdatePassword === 'false') {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ message: 'Username already exists, please choose a different one', id: 'User exists already' }));
      } else {
        const name = (body.name !== '') ? body.name : body.user;
        console.dir(`Body Name: ${body.name}| gotten name: ${name}`);
        users[body.user] = { name, password: body.password, data: [] };
        response.writeHead(201, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ message: 'Created successfully.' }));
        console.dir(`created new account [${body.name} - ${body.password}]`);
      }
    } else {
      response.writeHead(400, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify({ message: 'Username and password are both required.', id: 'missingParams' }));
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
module.exports.checkUser = checkUser;
module.exports.addUser = addUser;
module.exports.getNotReal = getNotReal;
module.exports.getNotFound = getNotFound;
module.exports.getCreatePage = getCreatePage;
module.exports.addData = addData;
