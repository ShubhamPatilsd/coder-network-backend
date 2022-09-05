# coder-network-backend

<div align="center"><img width="150" height="auto" src="https://github.githubassets.com/images/modules/logos_page/Octocat.png"/></div>
<p align="center">Supports GitHub authentication!</p>

<br/><br/>

Backend for the CoderNetwork!

Frontend for the CoderNetwork can be found at https://github.com/ShubhamPatilsd/coder-network-frontend

There are three environment variables to set this up:

```
MONGO_DB_CONNECT_STRING=
JWT_KEY=
AXIOS_AUTH_TOKEN=
FRONTEND_URL=
```
The `MONGO_DB_CONNECT_STRING` basically is the string to connect to your MongoDB database.

The `JWT_KEY` is a randomly generated key that is used to "encrypt" authentication data. (I use quotes to indicate that I made this system entirely by myself where I use JWT (JSON Web Token) to basically conceal the auth data so nobody can hack my stuff (please don't hax me tho)).

`AXIOS_AUTH_TOKEN` is basically an access token so that you can send more requests to the GitHub API.

The `FRONTEND_URL` basically is the URL for the frontend of the CoderNetwork. Frontend can be found at https://github.com/ShubhamPatilsd/coder-network-frontend


*Also let's just pretend like the `app.js` file doesn't have more than 300 lines of code because I was dumb and didn't realize I could have multiple files for Express (I started this project when I was an Express noob lol).*
