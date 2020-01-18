const express        =  require('express');
const router         =  express.Router();
const request        =  require('request');
const server         =  express();

const client_id      = '5c64b60a016b4a1c85ce37624e1a5058';
const client_secret  = '5eedb489a9ae464abc30740dc8b96968';
const redirectURI    = 'https://spotify-clone-ap.herokuapp.com/callback';
const scope          = 'user-read-private user-read-email user-read-recently-played';

router.route('/')
  .get((req, res) => {
    res.send('server running')
  })


router.route('/connect')
  .get( (req, res) => {

    res.redirect('https://accounts.spotify.com/authorize?' +
      'response_type=code&client_id=' + client_id +
      (scope ? '&scope=' + scope : '') +
      '&redirect_uri=' + redirectURI
  );
  });

  router.route('/callback')
    .get((req, res) => {

    const code = req.query.code || null;
    const opt = {
      url     : 'https://accounts.spotify.com/api/token',
      form    : { code: code, redirect_uri: redirectURI, grant_type: 'authorization_code'},
      headers : { 'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')) },
      json    : true
    };


    request.post(opt, (err, response, body) => {

      err ? console.dir(err) : null;

      if ( response.statusCode === 200 ) {
          const access  = body.access_token;
          const refresh = body.refresh_token;

          res.redirect('https://thirsty-cray-5b0954.netlify.com/?access=' + access);
      }
    });
    });

server.use(router);

const port = process.env.PORT || 8080;
server.listen(port, () => console.dir(`server active at port ${port}`));