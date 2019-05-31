// register app on https://github.com/settings/applications/new
// then get clientId/clientSecrct

const clientId = 'e3bcb655a24a9039719d';
const clientSecrct = 'e64ce911ea2755a2fe4cdf5ba30e2739f382f8be';

const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const route = require('koa-route');
const fetch = require('node-fetch');

const app = new Koa();
const main = serve(path.join(__dirname + '/public'));

const oauth = async (ctx) => {
  const requestToken = ctx.request.query.code;
  console.log('authorization code:', requestToken);

  const url = `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecrct}&code=${requestToken}`

  let accessToken = '';
  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        accept: 'application/json'
      }
    })
    let data = await response.json()
    accessToken = data.access_token;
    console.log(data);
    console.log(`access token: ${accessToken}`);
  } catch (error) {
    console.log(error)
  }

  try {
    let response = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `token ${accessToken}`
      }
    })
    let data = await response.json()
    console.log(data);
    const name = data.name;
    ctx.response.redirect(`/welcome.html?name=${name}`);
  } catch (error) {
    console.log(error)
  }
};

app.use(main);
app.use(route.get('/oauth/redirect', oauth));

app.listen(8080);
