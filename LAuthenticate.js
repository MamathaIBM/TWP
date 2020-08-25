var express=require("express");
var fs=require("fs");
const config = require('./Config.json');
var mysql=require("mysql");
var bodyParser=require('body-parser');
var cors =require("cors");
var http = require('http');
var session = require('express-session');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session')
const path = require('path'); 
var https = require("https")
var authflage =1;
var bGroups;

var app = express();

const router = express.Router();

// work around intermediate CA issue
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"


app.use(cookieParser());
app.use(cookieSession({
    name:"session",
    keys: ['key1', 'key2']
}));

app.use(function(req, res, next) {
    next();
});


app.use(function(req, res, next) {
    
    var allowedOrigins = ["https://inmbzp7149.in.dst.ibm.com:3000","https://inmbzp7149.in.dst.ibm.com:8000"];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();


  });


// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors())
;

app.use(passport.initialize());
app.use(passport.session()); 


// var client_id = "NTYxMzUyNDktNzE2YS00";
// var client_secret = "MTUxYzZhNDQtZTAzYS00"; 
// var authorization_url = "https://w3id.alpha.sso.ibm.com/isam/oidc/endpoint/amapp-runtime-oidcidp/authorize"; 
// var token_url = "https://w3id.alpha.sso.ibm.com/isam/oidc/endpoint/amapp-runtime-oidcidp/token";
// var issuer_id = "https://w3id.alpha.sso.ibm.com/isam";                
// var callback_url = "https://localhost:8080/auth/sso/callback";

var client_id = config.SSOCredentials.client_id;
var client_secret = config.SSOCredentials.client_secret; 
var authorization_url = config.SSOCredentials.authorization_url; 
var token_url = config.SSOCredentials.token_url;
var issuer_id = config.SSOCredentials.issuer_id;                
var callback_url = config.SSOCredentials.callback_url;

var OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;
var Strategy = new OpenIDConnectStrategy({
    authorizationURL : authorization_url,
    tokenURL : token_url,
    clientID : client_id,
    scope: 'openid',
    response_type: 'code',
    clientSecret : client_secret,
    callbackURL : callback_url,
    skipUserProfile: true,
    issuer: issuer_id,
	addCACert: true,
    CACertPathList: [        
   '/OIDC_CIS_STAGE.cer'
    ]
    }, 

    function(iss, sub, profile, accessToken, refreshToken, params, done) {
        process.nextTick(function() {
            profile.accessToken = accessToken;
            profile.refreshToken = refreshToken;
            done(null, profile);
        })
    }
); 

passport.use('openidconnect', Strategy); 

passport.serializeUser(function(token, done) {
    //console.log("Serialize user token = ",token);
    done(null, token);
});

passport.deserializeUser(function(user, done) {
    //console.log("Deserialize user token = ",user);
    done(null, user);
});

// Get our API routes

app.get('/login', passport.authenticate('openidconnect', {})); 

function ensureAuthenticated(req, res, next) {
    console.log("2")

    
    if (!req.isAuthenticated()) {
        console.log("not authen")
        req.session.originalUrl = req.originalUrl;	
		res.redirect('/login');
	} else {
        bGroups=req.user._json.blueGroups;
        return next();

    	 }
}

// handle callback, if authentication succeeds redirect to original requested url, otherwise go to /failure
app.get('/auth/sso/callback',function(req, res, next) {
    var redirect_url = req.session.originalUrl;
    console.log(authflage)
    // if(authflage === 0){
    //     res.redirect('/login');
    // }
    // else 
    if(redirect_url === config.LAuthenticate.server_mariadb_url){
        redirect_url = config.LAuthenticate.server_mariadb_url+'/config-loader'
        console.log('3')
    }
    console.log("redirect url = " + redirect_url );
 	passport.authenticate('openidconnect', {
        successRedirect: redirect_url,    
		failureRedirect: '/failure',
	})(req,res,next);
});

app.get('/api/getuser', function(req, res) {
    var user = req.user['_json'];
    console.log(req.user._json.blueGroups)
    res.json(req.user);  
    //res.json(req.user._json.blueGroups)
}); 

// app.get('/logout', function(req,res) {       
//     req.logout();
//     req.user=null
//     req.session.destroy
//     req.session.destroy(function (err) {
//         if (err) {
//             return next(err);
//         }
//         req.session = null;     // destroy session data
//     });  
// });




app.get('/logout',(req,res) =>{          
    authflage =0;
    req.user =null;
    res.session=null;
    res.cookieSession=null;
    res.clearCookie('sid', {path: '/'});
    res.clearCookie('session.sig');
    res.clearCookie('session');
    res.write('<html><head></head><body>');
    res.write('<div id="ibm-universal-nav"  style="background-color: #1d3649;"><div id="ibm-home"><img src="assets/TransitionIMG.png"></div></div>');
    res.write('<br><br><div style="text-align:center"><h3>You have logged out of Transition Work Pad. Please restart your browser to switch to different userID.<br><br> Please click on <a href=' + config.LAuthenticate.server_mariadb_url +'>Sign In</a> to access back Transition Work Pad.</h3>');
    res.end('</div></body></html>');

});



// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist'), {
    index: false
}));


app.get('*', ensureAuthenticated, (req, res) => {
    console.log("req.originalUrl = ",req.originalUrl);
    res.sendFile(path.join(__dirname, config.LAuthenticate.source_code));
  }); 
  https.createServer(
      {
        key: fs.readFileSync(config.keys.key),
        cert: fs.readFileSync(config.keys.cert),
        secureOptions: require('constants').SSL_OP_NO_TLSv1_1 | require('constants').SSL_OP_NO_TLSv1,
}, app).listen(config.LAuthenticate.LAuthenticate_Port);

console.log (" listening to  port "+config.LAuthenticate.LAuthenticate_Port )
