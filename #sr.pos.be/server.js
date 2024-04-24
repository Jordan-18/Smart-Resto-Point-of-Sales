const express = require('express')
const session = require('express-session')
const cors = require('cors')
const dotenv = require('dotenv'); dotenv.config()
const modules = require('./Modules/Routes.js')
const MiddlewareJWT = require('./helpers/MiddlewareJWT.js');

const app = express();
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({ 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized:false, 
    cookie: { maxAge: oneDay }
}));

app.use(cors());
app.use(express.json());
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}));

app.use(modules)
app.get('/',MiddlewareJWT,(req, res) => {
    console.log(req);
    res.status(200).json(req.session);
})
app.get('/path-url', (req, res) => {
   res.status(200).json({'url': process.env.AWS_ENDPOINT});
})

app.get('/sse', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
  
    const intervalId = setInterval(() => {
      res.write(`data: ${JSON.stringify({ message: 'Hello from the server!' })}\n\n`);
    }, 1000);
  
    req.on('close', () => {
      clearInterval(intervalId);
    });
});

app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));