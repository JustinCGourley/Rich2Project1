const http = require('http');
const url = require('url');
const query = require('querystring');
const handler = require('./handler.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': handler.getPage,
  '/style.css': handler.getStyle,
  '/clientCreate': handler.getCreatePage,
  '/checkUser': handler.checkUser,
  '/notReal': handler.getNotReal,
  '/addUser': handler.addUser,
  '/addData': handler.addData,
  notFound: handler.getNotFound,
};

//parse all in comming requests
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);
  if (urlStruct[parsedUrl.pathname]) {
    if (request.method === 'GET' || request.method === 'HEAD') {
      urlStruct[parsedUrl.pathname](request, response, params);
    } else if (request.method === 'POST') {
      const body = [];

      request.on('data', (data) => {
        body.push(data);
      });

      request.on('error', (error) => {
        console.error(error);
        response.statusCode = 400;
        response.end();
      });


      request.on('end', () => {
        const bodyParams = query.parse(Buffer.concat(body).toString());
        urlStruct[parsedUrl.pathname](request, response, bodyParams);
      });
    }
  } else {
    urlStruct.notFound(request, response, params);
  }
};

http.createServer(onRequest).listen(port);

console.dir(`Hosting server on port ${port}`);
