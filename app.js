const fs = require('fs');
var path = require('path');
const { execSync } = require('child_process');

const nodeModulesExists = fs.existsSync(path.join(__dirname, 'node_modules'));

if (!nodeModulesExists) {
  console.log('Iniciando aplicação por favor aguarde...');
  execSync('npm install --force-sync');
}

const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const mustacheExpress = require('mustache-express');

const routes = require('./routes/routes');
const colaboradorRoutes = require ('./routes/colaboradorRoutes');
const petRoutes = require ('./routes/petRoutes');
const agendamentoRoutes = require ('./routes/agendamentoRoutes');

app.engine('mustache', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', routes);
app.use('/colaboradores', colaboradorRoutes);
app.use('/pets', petRoutes);
app.use('/agendamentos', agendamentoRoutes);


app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);
});

