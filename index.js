const express = require('express');

const app = express();

app.use(express.json());

// Query params = ?test=1
// Route params = /users/1
// Request body = { id: "1", title: 'Novo projeto', tasks: [] }

// CRUD - Created, Read, Update, Delete

const projects = [];

/*
 * Checar se o título foi digitado
*/
function checkTitleWasPutted (req, res, next) {
  if (!req.body.title) {
    return res.status(400).json({ error: 'Título do projeto é necessário' })
  }

  return next();
}

/*
 * Checar se o projeto existe
*/
function checkProjectExists (req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id)

  if (!project) {
    return res.status(400).json({ error: 'Projeto não encontrado' })
  }

  req.project = project;

  return next();
}  

/*
 * Dar log no número de requisições
*/
function logRequests(req, res, next) {
  console.count("Número de requisições");

  return next();
}

app.use(logRequests);

/*
 * Retornar todos os projetos
*/
app.get('/projects', (req, res) => {
  return res.json(projects);
}) 

/*
 * Request body: id, title
 * Cadastrar um novo projeto
*/
app.post('/projects', checkTitleWasPutted, (req, res) => {
  const { id, title } = req.body;

  const project = { id, title, tasks: [] };

  projects.push(project);

  return res.json(project);
})

/*
 * Route params: id
 * Request body: title
 * Alterar o título do projeto com o id presente nos parâmetros da rota.
*/
app.put('/projects/:id', checkTitleWasPutted, checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
})

/**
 * Route params: id
 * Deletar o projeto relacionado ao id presente nos parâmetros da rota.
 */
app.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
})

/**
 * Route params: id;
 * Adicionar uma nova tarefa no projeto escolhido via id; 
 */
app.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
})

app.listen(4000);
