import dotenv from 'dotenv';
import express from 'express';
import { create, engine } from 'express-handlebars';
import path from 'path';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { connectMongoDB } from './src/config/mongoDb.config.js';
import viewsRouter from './src/routes/views.router.js';
import usersRouter from './src/routes/user.router.js';
import realTimeProductsRouter from './src/routes/realTimeProducts.router.js';
import initializePassport from './src/config/passport.config.js';
import { Server } from 'socket.io';


dotenv.config();


const app = express();
const PUERTO = 8080;


app.use(express.static(path.join(process.cwd(), 'public'))); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
initializePassport();


connectMongoDB();


const hbs = create({
  layoutsDir: path.join(process.cwd(), 'src/views/layouts'),
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true,
  },
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(process.cwd(), 'src/views'));


app.use('/', viewsRouter); 
app.use('/api/sessions', usersRouter); 
app.use('/api/realTimeProducts', realTimeProductsRouter);


app.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;
    const products = await productDao.getAll(page, limit, query, sort);

    res.render('index', {
      title: 'Productos',
      useWS: false,
      products: products.docs,
      pagination: {
        hasNextPage: products.hasNextPage,
        hasPrevPage: products.hasPrevPage,
        nextPage: products.nextPage,
        prevPage: products.prevPage,
        limit: products.limit,
      },
    });
  } catch (err) {
    console.error('Error al obtener productos:', err.message);
    res.status(500).send('Error al obtener productos');
  }
});

// Iniciar el servidor
const server = app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en puerto ${PUERTO}`);
});

// Crear servidor WebSocket
const wsServer = new Server(server);
app.set('ws', wsServer);

wsServer.on('connection', (socket) => {
  console.log('Nuevo cliente conectado en WebSocket');

  socket.on('newProduct', (product) => {
    console.log('Nuevo producto agregado', product);
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Error en el servidor', message: err.message });
});

export default app;
