const { application } = require('express');
const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/assets', express.static(`${__dirname}/public`));

app.param('githubUserName',(req, res, next, value) => {
	/(\d)|(\s)/.test(value)?res.send('githubUserName is invalid'):next();
})

app.param('repoName',(req, res, next, value) => {
	/(\d)|(\s)/.test(value)?res.send('repoName is invalid'):next();
})

app.get('/api/v1/githubUser/:githubUserName/avatar', (req, res) => {
	let src = `images/${req.params.githubUserName}.jpg`;

	if(!fs.existsSync(`./public/${src}`)) {
		src = `images/default.jpg`;
	}

	res.send(`<!doctype html>
	<html>
		<head></head>
		<body>
			<img src='/assets/${src}'>
		</body>
	</html>`);
}).get('/api/v1/githubUser/:githubUserName/repo/:repoName', (req, res) => {
	res.send(`Repo: ${req.params.repoName} of user ${req.params.githubUserName}`)
}).get('/api/v1/githubUser/:githubUserName/repo/:repoName/contributers', (req, res) => {
	res.send(`Contributers page of repo ${req.params.repoName} of user ${req.params.githubUserName}`)
}).all('*', (req, res) => {
	res.send('Global handler for all routes');
}).listen(port, () => {
	console.log(`Listening on port ${port}`);
});

const axios = require('axios');
//GET request
axios.get('https://api.github.com/users/:userName')
	.then(function(response) {
		console.log(response.data);
		console.log(response.status);
		console.log(response.statusText);
	})
	.catch(function(error) {
		console.log(error);
	});

//GET request
axios.get('https://api.github.com/users/:userName/:repoName')
	.then(function(response) {
		console.log(response.data);
		console.log(response.status);
		console.log(response.statusText);
	})
	.catch(function(error) {
		console.log(error);
	});


//GET request
axios.get('https://api.github.com/users/:userName/:repoName/contributors')
	.then(function(response) {
		console.log(response.data);
		console.log(response.status);
		console.log(response.statusText);
	})
	.catch(function(error) {
		console.log(error);
	});