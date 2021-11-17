const express = require('express');
const app = express();
const axios = require('axios');
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/assets', express.static(`${__dirname}/public`));

function getUser(githubUserName) {
	return new Promise((resolve, reject) => {
		axios.get(`https://api.github.com/users/${githubUserName}`)
			.then(response => {
				resolve(response.data);
			}).catch(err => {
				reject(err);
			});
	});
}
function getUserRepo(githubUserName, repoName) {
	return new Promise((resolve, reject) => {
	axios.get(`https://api.github.com/repos/${githubUserName}/${repoName}`)
		.then(response => {
			resolve(response.data);
		}).catch(err => {
			reject(err);
		});
	})
}
function getUserRepoContributors(githubUserName, repoName) {
	return new Promise((resolve, reject) => {
	axios.get(`https://api.github.com/repos/${githubUserName}/${repoName}/contributors`)
		.then(response => {
			resolve(response.data);
		}).catch(err => {
			reject(err);
		});
	})
}

const displayAvatar = (res, status, src) => {
	res.status(status).send(`<!doctype html>
				<html>
					<head></head>
					<body>
						<img src='${src}'>
					</body>
				</html>`);
}

app.param('githubUserName',(req, res, next, value) => {
	/(\d)|(\s)/.test(value)?res.send('githubUserName is invalid'):next();
})

app.param('repoName',(req, res, next, value) => {
	/(\d)|(\s)/.test(value)?res.send('repoName is invalid'):next();
})

app.get('/api/v1/githubUser/:githubUserName/avatar', (req, res) => {

	const githubUserName = req.params.githubUserName;
	let src = '/assets/images/default.jpg';

	getUser(githubUserName)
	.then(user => {
		src = user.avatar_url;
		displayAvatar(res, 200, src);
	}).catch(() => {
		displayAvatar(res, 400, src);
	});

}).get('/api/v1/githubUser/:githubUserName/repo/:repoName', (req, res) => {
	res.send(`Repo: ${req.params.repoName} of user ${req.params.githubUserName}`)
}).get('/api/v1/githubUser/:githubUserName/repo/:repoName/contributers', (req, res) => {
	res.send(`Contributers page of repo ${req.params.repoName} of user ${req.params.githubUserName}`)
}).all('*', (req, res) => {
	res.send('Global handler for all routes');
}).listen(port, () => {
	console.log(`Listening on port ${port}`);
});
