//let mysql = require('mysql');
const config = require('./Config.json');
var mariadb = require('mariadb'); 
var express = require('express');
const bodyParser= require('body-parser')
const multer = require('multer');
const PptxGenJS = require("pptxgenjs");


var app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))

var https = require('https');
var xl = require('excel4node'); 
var fs = require("fs");
const fsextra = require('fs-extra');
var cors = require('cors');
var excelColumnName = require('excel-column-name');
const winston = require('winston')
const path = require('path');

var imagePath = "";


const log_trace=false;


  /*

const storage = multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, 'uploads');
    }
    filename:
})

*/


function wpdlog(x) {

  //if (log_trace =='Y')
        console.log(x);
}


let finalresponse='';

const consoleTransport = new winston.transports.Console()
function displayTime() {
    var str = "";

    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()

    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    str += hours + ":" + minutes + ":" + seconds + " ";
    if(hours > 11){
        str += "PM"
    } else {
        str += "AM"
    }
    return str;
}


function displayDay() {
    var currentTime = new Date()
    return currentTime.getDate()+"-"+currentTime.getMonth()+"-"+currentTime.getFullYear();
}


function displayDayDDMONYYYY() {
    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sept";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";

    var currentTime = new Date();
    console.log("TIME "+currentTime.getDate()+month[Number(currentTime.getMonth())]+currentTime.getFullYear());
    return currentTime.getDate()+month[Number(currentTime.getMonth())]+currentTime.getFullYear();
}

/*
const myWinstonOptions = {
    //transports: [consoleTransport]
    
    transports: [
                new winston.transports.File({ filename: './logs/error.log', level: 'info' }),
                new winston.transports.File({  handleExceptions: true,colorize:true,json: true,filename: './logs/'+displayDay()+'.log',
      })
    ]
    
}
const logger = new winston.createLogger(myWinstonOptions)

*/


//var fs = require( 'fs' );
var logDir = 'logs';
if ( !fs.existsSync( logDir ) ) {
   fs.mkdirSync( logDir );
}


require('winston-daily-rotate-file');

var transport = new (winston.transports.DailyRotateFile)({
    filename: './logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  });
 
  transport.on('rotate', function(oldFilename, newFilename) {
    // do something 
  });
 
  var logger = winston.createLogger({
    transports: [
      transport
    ]
  });

const accessHandler = (func) => (req, res) => {
    try {
        logger.info(req.url);
        func(req, res, logger);

    } catch(e){
        logger.info('accessHandler failed');
        wpdlog(e);
        res.send('Oh no, something did not go well!');
    }
};


function logInsertTable(tableName, query, user){
    let logInfo = 
    '{'+
        '"TABLE_NAME":"'+ tableName+'" '+
        ',"QUERY": "'+ query+'" '+
        ',"USER_ID": "'+ user+'" '+              
     '}' ;
    logger.info(logInfo);
}


function logUpdateTable(tableName,primaryKey, query, user){
    let logInfo = 
    '{'+
        '"TABLE_NAME":"'+ tableName+'" '+
        ',"PRIMARY_KEY": "'+ primaryKey+'" '+
        ',"QUERY": "'+ query+'" '+
        ',"USER_ID": "'+ user+'" '+              
     '}' ;


    logger.info(logInfo);
}


//https://localhost:8080/



/*

var originsWhitelist = ['https://inmbzp7149.in.dst.ibm.com:3000','https://inmbzp7149.in.dst.ibm.com:8000', 'https://localhost:8080/'];
var corsOptions = {
    origin: function(origin, callback){
          var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
          callback(null, isWhitelisted);
    },
    credentials:true
  }
  
  //here is the magic
  app.use(cors(corsOptions));

  */





app.use(function(req, res, next) {

    var allowedOrigins = ["https://inmbzp7149.in.dst.ibm.com:3000","https://inmbzp7149.in.dst.ibm.com:8000" , "https://localhost:8080","http://localhost:4200/"];
    var origin = req.headers.origin;

    //wpdlog("Origin "+origin);
    if(allowedOrigins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
         //res.setHeader("Access-Control-Allow-Origin: *")
    }

    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();

  });


app.use(cors())


/*
var pool = mysql.createPool({
    connectionLimit: 25,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'tntproject'
});

*/

/*

var pool = mariadb.createPool({
    connectionLimit: 10,
    host: 'inmbzp7149.in.dst.ibm.com',
    port : 3307,
    user: 'root',
    password: 'Mariadb_1234',
    database: 'twp'
});

*/




var pool = mariadb.createPool({
    // connectionLimit: 10,
    // host: 'inmbzp7149.in.dst.ibm.com',
    // port : 3307,
    // user: 'root',
    // password: 'Mariadb_1234',
    // database: 'twp'
    connectionLimit: config.Index_mariadb_system.connectionLimit,
    host: config.Index_mariadb_system.host,
    port : config.Index_mariadb_system.dbPort,
    user: config.Index_mariadb_system.user,
    password: config.Index_mariadb_system.password,
    database: config.Index_mariadb_system.schema,
    });


// #####################################  GET FUNCTIONLITY DEFAULT ACCESS LIST ############################################################
app.post('/tnt/logAccess/', function (req, res) {
                    
            //var currentTime = + new Date();
            logger.info("##################### NEW FUNCTIONALITY STARTED ###################### ");    

            let accessInfo = 
            '{'+
                '"FUNC_NAME":"'+ req.body.FUNC_NAME+'" '+
                ',"USER_NAME": "'+ req.body.USER_NAME+'" '+
                ',"USER_ID": "'+ req.body.USER_ID+'" '+ 
                ',"USER_EMAIL": "'+ req.body.USER_EMAIL+'" '+ 
                ',"ROUTER_LINK":"'+ req.body.ROUTER_LINK+'" '+ 
                ',"IP_ADDRESS":"'+ req.connection.remoteAddress+'" '+   
                ',"TIME_STAMP":"'+ displayTime()+'" '+  
                ',"DAY":"'+ displayDay()+'" '+                
             '}' ;


            logger.info(accessInfo);
            //logger.info("FUNC NAME "+req.body.FUNC_NAME);
            res.send({"Fetch" : "Fail" });
 });

 function escapeChar(textString, replaceChar, replacedChar){

    var finalText ="";
    var splitedText = (textString).split(replaceChar);
    //alert("splitedText.length "+splitedText.length);
    if (splitedText.length >1){
          finalText = splitedText[0];
          for(var i=1;i<splitedText.length;i++){
                finalText = finalText +replacedChar+splitedText[i];
                //alert("finalText "+finalText);
          }
    }else{
          finalText = textString;
    }

    return finalText;        
}


function escapeSpecialChars(reportName){
    //reportName = this.utility.escapeChar(reportName, "\n", " ");
    reportName = escapeChar(reportName, "\\", "\\\\");
    reportName = escapeChar(reportName,'"','\\"'); 
    reportName = escapeChar(reportName,"'","\\'"); 

    //alert(reportName);
    
    return reportName;
  }  



// #####################################  GET GENERIC DATABASE RECORDS ############################################################
app.get('/tnt/databaseRecords/:id', accessHandler((req, res) => { 

    //Maria db
    pool.getConnection()
    .then(conn=>{


        wpdlog("##################################################################### ");
                      var query =  req.params.id;                                                    
                      //wpdlog("query "+query);


                      //query = escapeChar(query,"\n",' ' );

                      wpdlog("query "+query);
        wpdlog("##################################################################### ");

                      conn.query(query)
                                  .then((result)=>{ 
                                              
                                              if (result != undefined){
                                                   //wpdlog("result[0] "+result[0]);
                                                   if (result[0] != undefined){
                                                        if (result[0].length == undefined){

                                                                wpdlog("normal query")
                                                                //normal query
                                                                res.send(result);
                                                        }else{
                                                                wpdlog("storedprocedure")
                                                                // storedprocedure
                                                                res.end(JSON.stringify(result[0]));
                                                        }
                                                   }else{
                                                         res.send(result);
                                                   }

                                              }else{
                                                  res.send(result);
                                              }

                                              console.log("Before releasing connection ");    
                                              conn.release(); 
                                              
                                              /*
                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {

                                                                    finalresponse = JSON.stringify(result[0]);

                                                                    /*
                                                                    wpdlog("JSON String "+JSON.stringify(result[key]));
                                                                    wpdlog("JSON ARRAY Length "+JSON.parse(JSON.stringify(result[key])).length);
                                                                    newResult = JSON.parse(JSON.stringify(result[key]));
                                                                    for(var i=0; i<newResult.length; i++){
                                                                             var object ={};
                                                                             object =  newResult[i];
                                                                             newResultKeys=object.keys;
                                                                             //wpdlog(" newResultKeys"+JSON.parse(JSON.stringify(newResult[i])));

                                                                             
                                                                             for(var myKey in newResultKeys){
                                                                                wpdlog(" Key"+object[myKey]);
                                                                             }                                                                             
                                                                    }                                                                                                                              
                                                                    response.push(result[key]);
                                              }
                                            
                                              objToJson.response = response;
                                              //finalresponse = JSON.stringify(objToJson); 
                                              wpdlog("finalresponse "+finalresponse); 
                                              
                                              */
                                              //res.send(result);
                                              //conn.release();    
                                              //res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
           wpdlog(err);
      });


    //Maria db
  
}));


//############################################ FUNCTIONALITY ########################################################################

// #####################################  Upload Functionality  ############################################################
app.post('/tnt/uploadFunctionality/', accessHandler((req, res) => { 


    //Maria db
    pool.getConnection()
    .then(conn=>{

        var functionality_array = JSON.parse(JSON.stringify(req.body));
        for( var i=0; i< functionality_array.length; i++){

            var funcName = functionality_array[i]["FUNC_NAME"];
            var routerLink = functionality_array[i]["FUNC_ROUTERLINK"];
            var funcDefault = functionality_array[i]["FUNC_DEFAULT"];
            var funcUOI = functionality_array[i]["FUNC_UOI"];
            var funcOpType = functionality_array[i]["FUNC_OPERATION_TYPE"];
            var funcDescription = functionality_array[i]["FUNC_DESCRIPTION"];
            var funcModule = functionality_array[i]["FUNC_MODULE"];
            var funcDependency = functionality_array[i]["FUNC_TRANSITION_DEPENDENCY"];    
            
            const query =  " insert into FUNCTIONALITY (  "+
                                    "FUNCTIONALITY_ID, "+      
                                    "FUNC_NAME, "+                                
                                    "FUNC_ROUTERLINK, "+
                                    "FUNC_DEFAULT, "+
                                    "FUNC_UOI, "+
                                    "FUNC_OPERATION_TYPE, "+
                                    "FUNC_DESCRIPTION, "+
                                    "FUNC_MODULE, "+
                                    "FUNC_TRANSITION_DEPENDENCY "+                                                                                
                            " ) values ( "+
                                "null,"+                            
                                "'"+funcName+"',"+
                                "'"+routerLink+"',"+
                                "'"+funcDefault+"',"+
                                "'"+funcUOI+"',"+
                                "'"+funcOpType+"',"+
                                "'"+funcDescription+"',"+
                                "'"+funcModule+"',"+
                                "'"+funcDependency+"' "+                                                                                                       
                            ") ";
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result1)=>{

                                        conn.query(" SELECT LAST_INSERT_ID() ")
                                        .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
  
                                            })
                                            .catch(err => {
                                                        //handle error
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                            })                                                   
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
        }// end of for 
        conn.release();    
        res.end(finalresponse); 
      }).catch(err => {
          //not connected
      });



    //Maria db

    pool.getConnection(function(err, connection) {
        if (err) {
          return console.error('error: ' + err.message);
        }
       
        //wpdlog('Connected to the MySQL server.');
        var criterion = JSON.parse(JSON.stringify(req.body));
        for( var i=0; i< criterion.length; i++){

            var exit_criteria = criterion[i]["EXIT_CRITERIA"];
            //wpdlog("exit criteria "+i+ " "+ exit_criteria);       

            
        const query =  " insert into EXIT_CRITERIA (  "+
                                "EXIT_CRITERIA_ID, "+                                
                                "EXIT_CRITERIA, "+
                                "PHASE_NAME "+                                                                                           
                        " ) values ( "+
                            "null,"+                            
                            "'"+exit_criteria+"',"+
                            "'"+phase+"' "+                                                                                                            
                        ") ";
 
        //wpdlog("query "+query);
       
        connection.query(query, function (err, result, fields) {
            if (err) 
              return console.error('error: ' + err.message);

            connection.query(" SELECT LAST_INSERT_ID() ", function (err, result, fields) {
                var objToJson = result;
                var response = [];
                for (var key in result) {
                   //wpdlog("Result "+result[key]);
                   response.push(result[key]);
                }
                objToJson.response = response;
                finalresponse = JSON.stringify(objToJson);     

            });
  
        }); 

        

        }// end of for   
        
        
        connection.release();    
        res.end(finalresponse);  
    });       
}));


//####################################################### Create A New functionality ################################################

app.post('/tnt/functionality/', accessHandler((req, res) => { 

    //wpdlog("Link "+req.body.FUNC_ROUTERLINK);
    //wpdlog(" Name "+req.body.FUNC_NAME);
    //wpdlog("Description "+req.body.FUNC_DESCRIPTION);

    //Maria db
    pool.getConnection()
    .then(conn=>{

                const query =  " insert into FUNCTIONALITY(  "+
                      "FUNCTIONALITY_ID, "+                                
                      "FUNC_NAME, "+
                      "FUNC_ROUTERLINK, "+
                      "FUNC_UOI, "+
                      "FUNC_DEFAULT, "+                                
                      "FUNC_DESCRIPTION, "+    
                      "FUNC_OPERATION_TYPE, "+ 
                      "FUNC_TRANSITION_DEPENDENCY, "+ 
                      "FUNC_MODULE  "+                                                                                        
              " ) values ( "+
                  "null,"+                            
                  "'"+req.body.FUNC_NAME+"',"+
                  "'"+req.body.FUNC_ROUTERLINK+"',"+
                  "'"+req.body.FUNC_UOI+"',"+
                  "'"+req.body.FUNC_DEFAULT+"',"+                            
                  "'"+req.body.FUNC_DESCRIPTION+"', "+  
                  "'"+req.body.FUNC_OPERATION_TYPE+"', "+  
                  "'"+req.body.FUNC_TRANSITION_DEPENDENCY+"', "+  
                  "'"+req.body.FUNC_MODULE+"' "+                                                                            
              ") ";              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result1)=>{

                                    conn.query(" SELECT LAST_INSERT_ID() ")
                                                    .then((result=>{
                                                        var objToJson = result;
                                                        var response = [];
                                                        for (var key in result) {
                                                            //wpdlog("Result "+result[key]);
                                                            response.push(result[key]);
                                                        }
                                                        objToJson.response = response;
                                                        finalresponse = JSON.stringify(objToJson);                             
                                                        conn.release();    
                                                        res.end(finalresponse);                                                         
                                                    })
                                                    .catch(err => {
                                                                //handle error
                                                                wpdlog(err);
                                                                res.send({"Fetch" : "Fail" });
                                                                conn.release();  
                                                    }))                                               
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db
  
}));

// #####################################  GET FUNCTIONLITY LIST ############################################################
app.get('/tnt/functionalitys/', accessHandler((req, res) => { 

    //Maria db
    pool.getConnection()
    .then(conn=>{

                    const query =  ' select ' +
                        ' f.FUNCTIONALITY_ID, '+
                        ' COALESCE(UPPER(f.FUNC_NAME),"") as FUNC_NAME, '+
                        ' COALESCE(f.FUNC_ROUTERLINK,"") as FUNC_ROUTERLINK, '+
                        ' COALESCE(f.FUNC_DEFAULT,"") as FUNC_DEFAULT, '+
                        ' COALESCE(f.FUNC_UOI,"") as FUNC_UOI, '+            
                        ' COALESCE(f.FUNC_DESCRIPTION,"") as FUNC_DESCRIPTION, '+
                        ' COALESCE(f.FUNC_OPERATION_TYPE,"") as FUNC_OPERATION_TYPE, '+
                        ' COALESCE(f.FUNC_TRANSITION_DEPENDENCY,"") as FUNC_TRANSITION_DEPENDENCY, '+
                        ' COALESCE(f.FUNC_MODULE,"") as FUNC_MODULE, '+
                        ' GROUP_CONCAT(COALESCE(rff.ROLE_NAME,"")) as FUNC_LINKED_ROLES, '+   
                        ' COUNT(f.FUNCTIONALITY_ID) as ROLE_COUNT '+
                    ' from '+
                        '  FUNCTIONALITY f left join ( select rf.FUNCTIONALITY_ID, r.ROLE_NAME '+
                        ' from ROLE r, ROLE_FUNCTIONALITY rf '+
                        '  where r.ROLE_ID = rf.ROLE_ID) rff '+
                        '  on f.FUNCTIONALITY_ID = rff.FUNCTIONALITY_ID '+
                        ' group by f.FUNCTIONALITY_ID';  
              
                                      
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{
                                              logger.info("WINSTON LOG"+query);
                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  wpdlog("key "+key);
                                                  wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db
  
}));


// #####################################  GET FUNCTIONLITY SEARCH LIST ############################################################
app.get('/tnt/functionalitySearch/:id', accessHandler((req, res) => { 

    const funcName =  req.params.id;   

    //Maria db
    pool.getConnection()
    .then(conn=>{

                    const query =  ' select ' +
                        ' f.FUNCTIONALITY_ID, '+
                        ' COALESCE(UPPER(f.FUNC_NAME),"") as FUNC_NAME, '+
                        ' COALESCE(f.FUNC_ROUTERLINK,"") as FUNC_ROUTERLINK, '+
                        ' COALESCE(f.FUNC_DEFAULT,"") as FUNC_DEFAULT, '+
                        ' COALESCE(f.FUNC_UOI,"") as FUNC_UOI, '+            
                        ' COALESCE(f.FUNC_DESCRIPTION,"") as FUNC_DESCRIPTION, '+
                        ' COALESCE(f.FUNC_OPERATION_TYPE,"") as FUNC_OPERATION_TYPE, '+
                        ' COALESCE(f.FUNC_TRANSITION_DEPENDENCY,"") as FUNC_TRANSITION_DEPENDENCY, '+
                        ' COALESCE(f.FUNC_MODULE,"") as FUNC_MODULE, '+
                        ' GROUP_CONCAT(COALESCE(rff.ROLE_NAME,"")) as FUNC_LINKED_ROLES, '+   
                        ' COUNT(f.FUNCTIONALITY_ID) as ROLE_COUNT '+
                    ' from '+                                    
                      '( select ' +
                            ' FUNCTIONALITY_ID, '+
                            ' FUNC_NAME, '+
                            ' FUNC_ROUTERLINK, '+
                            ' FUNC_DEFAULT, '+
                            ' FUNC_UOI, '+            
                            ' FUNC_DESCRIPTION, '+
                            ' FUNC_OPERATION_TYPE, '+
                            ' FUNC_TRANSITION_DEPENDENCY, '+
                            ' FUNC_MODULE '+
                         ' from '+
                                '  FUNCTIONALITY  '+
                                "   where UPPER(FUNC_NAME) LIKE '%"+funcName.toUpperCase()+"%' ) f " +                                             
                                '      left join ( select rf.FUNCTIONALITY_ID, r.ROLE_NAME '+
                                '                      from ROLE r, ROLE_FUNCTIONALITY rf '+
                                '                            where r.ROLE_ID = rf.ROLE_ID) rff '+
                                '                                   on f.FUNCTIONALITY_ID = rff.FUNCTIONALITY_ID '+
                                ' group by f.FUNCTIONALITY_ID ';  
              
                                      
                      wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{
                                              logger.info("WINSTON LOG"+query);
                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  wpdlog("key "+key);
                                                  wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db
  
}));


// #####################################  GET FUNCTIONLITY DEFAULT ACCESS LIST ############################################################
app.get('/tnt/functionalityDefaultAccessList/', accessHandler((req, res) => { 

   //Maria db

   pool.getConnection()
   .then(conn=>{

                     const query =  ' select ' +
                        ' FUNCTIONALITY_ID, '+
                        ' COALESCE(FUNC_NAME,"") as FUNC_NAME, '+
                        ' COALESCE(FUNC_ROUTERLINK,"") as FUNC_ROUTERLINK, '+
                        ' COALESCE(FUNC_DEFAULT,"") as FUNC_DEFAULT, '+
                        ' COALESCE(FUNC_UOI,"") as FUNC_UOI, '+            
                        ' COALESCE(FUNC_DESCRIPTION,"") as FUNC_DESCRIPTION, '+
                        ' COALESCE(FUNC_OPERATION_TYPE,"") as FUNC_OPERATION_TYPE, '+
                        ' COALESCE(FUNC_TRANSITION_DEPENDENCY,"") as FUNC_TRANSITION_DEPENDENCY, '+
                        ' COALESCE(FUNC_MODULE,"") as FUNC_MODULE '+
                    ' from '+
                        '  FUNCTIONALITY '+
                        "  where FUNC_DEFAULT ='Y'";
             
             
                     //wpdlog("query "+query);

                     conn.query(query)
                                 .then((result)=>{

                                             var objToJson = result;
                                             var response = [];
                                             for (var key in result) {
                                                 //wpdlog("Result "+result[key]);
                                                 response.push(result[key]);
                                             }
                                             objToJson.response = response;
                                             finalresponse = JSON.stringify(objToJson);                             
                                             conn.release();    
                                             res.end(finalresponse);                                                
                                 })
                                 .catch(err => {
                                             //handle error
                                             res.send({"Fetch" : "Fail" });
                                             conn.release();  
                                 })
         
     }).catch(err => {
         //not connected
     });



   //Maria db
  
}));

// #####################################  GET FUNCTIONLITY DATA ############################################################
app.get('/tnt/functionality/:id', accessHandler((req, res) => { 

     //Maria db

     pool.getConnection()
     .then(conn=>{

                    const query =  ' select ' +
                        ' FUNCTIONALITY_ID, '+
                        ' COALESCE(FUNC_NAME,"") as FUNC_NAME, '+
                        ' COALESCE(FUNC_ROUTERLINK,"") as FUNC_ROUTERLINK, '+
                        ' COALESCE(FUNC_DEFAULT,"") as FUNC_DEFAULT, '+
                        ' COALESCE(FUNC_UOI,"") as FUNC_UOI, '+             
                        ' COALESCE(FUNC_DESCRIPTION,"") as FUNC_DESCRIPTION, '+
                        ' COALESCE(FUNC_OPERATION_TYPE,"") as FUNC_OPERATION_TYPE, '+
                        ' COALESCE(FUNC_TRANSITION_DEPENDENCY,"") as FUNC_TRANSITION_DEPENDENCY, '+
                        ' COALESCE(FUNC_MODULE,"") as FUNC_MODULE '+
                    ' from '+
                        '  FUNCTIONALITY '+
                        "  where FUNCTIONALITY_ID ='"+req.params.id+"'";
            
                    //wpdlog("query  func data"+query); 
               
        
                       conn.query(query)
                                   .then((result)=>{

                                               var objToJson = result;
                                               var response = [];
                                               for (var key in result) {
                                                   //wpdlog("Result "+result[key]);
                                                   response.push(result[key]);
                                               }
                                               objToJson.response = response;
                                               finalresponse = JSON.stringify(objToJson);                             
                                               conn.release();    
                                               res.end(finalresponse);                                                
                                   })
                                   .catch(err => {
                                               //handle error
                                               res.send({"Fetch" : "Fail" });
                                               conn.release();  
                                   })
           
       }).catch(err => {
           //not connected
       });


    //Maria db

 
}));


// #####################################  UPDATE FUNCTIONALITY  ############################################################
app.put('/tnt/functionality/:id', accessHandler((req, res) => { 

    //wpdlog("functionality_id "+req.params.id);

    //Maria db

    pool.getConnection()
    .then(conn=>{

                    const query = "update  FUNCTIONALITY " + 
                    "set FUNC_NAME ='" + req.body.FUNC_NAME + "', " +
                        "FUNC_DESCRIPTION  ='" + req.body.FUNC_DESCRIPTION + "',  " +     
                        "FUNC_ROUTERLINK  ='" + req.body.FUNC_ROUTERLINK + "',  " +  
                        "FUNC_DEFAULT  ='" + req.body.FUNC_DEFAULT + "',  " +     
                        "FUNC_UOI  ='" + req.body.FUNC_UOI + "',  " +              
                        "FUNC_OPERATION_TYPE  ='" + req.body.FUNC_OPERATION_TYPE + "',  " +  
                        "FUNC_TRANSITION_DEPENDENCY  ='" + req.body.FUNC_TRANSITION_DEPENDENCY + "',  " +  
                        "FUNC_MODULE  ='" + req.body.FUNC_MODULE + "'  " +  
                    "where  "+
                        "FUNCTIONALITY_ID ='" +req.params.id +"' " ; 
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });



    //Maria db


}));


// #####################################  DELETE FUNCTIONALITY  ############################################################
app.delete('/tnt/functionality/:id', accessHandler((req, res) => { 

    //wpdlog("functionality_id "+req.params.id);

    //Maria db

    pool.getConnection()
    .then(conn=>{

                    const query = "delete from  FUNCTIONALITY " + 
                                  "where  "+
                                  "FUNCTIONALITY_ID ='" +req.params.id +"' " ; 
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });



    //Maria db


}));

// #####################################  UPDATE ROLE  ############################################################
app.put('/tnt/role/:id', accessHandler((req, res) => { 

    //Maria db
    pool.getConnection()
    .then(conn=>{

                    const query = "update  ROLE " + 
                    "set ROLE_NAME ='" + req.body.ROLE_NAME + "', " +
                        "ROLE_DESCRIPTION  ='" + req.body.ROLE_DESCRIPTION + "'  " +                 
                    "where  "+
                        "ROLE_ID ='" +req.params.id +"' " ; 
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db

}));

// #####################################  DELETE ROLE  ############################################################
app.delete('/tnt/role/:id', accessHandler((req, res) => { 

    //Maria db
    pool.getConnection()
    .then(conn=>{

                    const query = "delete from ROLE " +                
                                    "where  "+
                                        "ROLE_ID ='" +req.params.id +"' " ; 
                            
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db

}));

// #####################################  GET ROLE DATA ############################################################
app.get('/tnt/role/:id', accessHandler((req, res) => { 


     //Maria db
     pool.getConnection()
     .then(conn=>{

                    const query =  ' select ' +
                        ' ROLE_ID, '+
                        ' COALESCE(ROLE_NAME,"") as ROLE_NAME, '+
                        ' COALESCE(ROLE_DESCRIPTION,"") as ROLE_DESCRIPTION '+
                    ' from '+
                        '  ROLE '+
                        "  where ROLE_ID ='"+req.params.id+"'";  
               
               
                       //wpdlog("query "+query);

                       conn.query(query)
                                   .then((result)=>{

                                               var objToJson = result;
                                               var response = [];
                                               for (var key in result) {
                                                   //wpdlog("Result "+result[key]);
                                                   response.push(result[key]);
                                               }
                                               objToJson.response = response;
                                               finalresponse = JSON.stringify(objToJson);                             
                                               conn.release();    
                                               res.end(finalresponse);                                                
                                   })
                                   .catch(err => {
                                               //handle error
                                               res.send({"Fetch" : "Fail" });
                                               conn.release();  
                                   })
           
       }).catch(err => {
           //not connected
       });

     //Maria db
  
}));


// #####################################  GET ROLE LIST ############################################################
app.get('/tnt/roles/', accessHandler((req, res) => { 


    //Maria db

    pool.getConnection()
    .then(conn=>{



                       const queryOtherLinkedRoles = '((select ROLE_ID as ROLE_ID from USER_ROLE ) '+
                                                     ' union '+
                                                     '(select ROLE_ID as ROLE_ID from ROLE_FUNCTIONALITY ) '+
                                                     ' union '+
                                                     '(select USER_ROLE_ID as ROLE_ID from USER_TRANSITION ) ) rl';
                        const query =  ' select ' +
                                            ' r.ROLE_ID, '+
                                            ' COALESCE(r.ROLE_NAME,"") as ROLE_NAME, '+
                                            ' COALESCE(r.ROLE_DESCRIPTION,"") as ROLE_DESCRIPTION, '+
                                            ' GROUP_CONCAT(COALESCE(rl.ROLE_ID,"")) as ROLE_LINKED '+ 
                                        ' from '+
                                            '  ROLE r left join '+
                                            queryOtherLinkedRoles +
                                            '  on r.ROLE_ID = rl.ROLE_ID '+
                                            '  group by r.ROLE_ID ';
                      
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse.toUpperCase());                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db

}));


// #####################################CREATE A NEW ROLE ############################################################
app.post('/tnt/role/', accessHandler((req, res) => { 


    //Maria db

    pool.getConnection()
    .then(conn=>{

                    const query =  " insert into ROLE(  "+
                                            "ROLE_ID, "+                                
                                            "ROLE_NAME, "+
                                            "ROLE_DESCRIPTION "+                                                                                           
                                    " ) values ( "+
                                        "null,"+                            
                                        "'"+req.body.ROLE_NAME+"',"+
                                        "'"+req.body.ROLE_DESCRIPTION+"' "+                                                                                                            
                                    ") ";
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result1)=>{

                                        conn.query(" SELECT LAST_INSERT_ID() ")
                                             .then((result)=>{

                                                var objToJson = result;
                                                var response = [];
                                                for (var key in result) {
                                                    //wpdlog("Result "+result[key]);
                                                    response.push(result[key]);
                                                }
                                                objToJson.response = response;
                                                finalresponse = JSON.stringify(objToJson);                             
                                                conn.release();    
                                                res.end(finalresponse);   


                                            })
                                            .catch(err => {
                                                        //handle error
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                            })                                                 
                                             
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db
    //wpdlog(" Name "+req.body.ROLE_NAME);
    //wpdlog("Description "+req.body.ROLE_DESCRIPTION);
  
}));

//################################################################### USER ################################
// Get user list
app.get('/tnt/users/', accessHandler((req, res) => { 


    pool.getConnection()
                      .then(conn=>{

                                       /*
                                        const query =  ' select ' +
                                                                ' USER_ID, '+
                                                                ' COALESCE(USER_NAME,"") as USER_NAME, '+
                                                                ' COALESCE(USER_EMAIL,"") as USER_EMAIL, '+
                                                                ' COALESCE(USER_COUNTRY,"") as USER_COUNTRY, '+
                                                                ' COALESCE(USER_ORG,"") as USER_ORG, '+
                                                                ' COALESCE(USER_TRANSITION_ORG,"") as USER_TRANSITION_ORG, '+
                                                                ' COALESCE(USER_CITY_LOCATION,"") as USER_CITY_LOCATION, '+
                                                                ' COALESCE(USER_COMMENTS,"") as USER_COMMENTS '+
                                                        ' from '+
                                                                ' USER ';
                                        */


                                       const query =  ' select ' +
                                       ' uf.USER_ID as USER_ID , '+
                                       ' COALESCE(UPPER(uf.USER_NAME),"") as USER_NAME, '+
                                       ' COALESCE(uf.USER_EMAIL,"") as USER_EMAIL, '+
                                       ' COALESCE(uf.USER_COUNTRY,"") as USER_COUNTRY, '+
                                       ' COALESCE(uf.USER_ORG,"") as USER_ORG, '+
                                       ' GROUP_CONCAT(COALESCE(uf.USER_TRANSITION_ORG,"")) as USER_TRANSITION_ORG, '+         
                                       ' COALESCE(uf.USER_CITY_LOCATION,"") as USER_CITY_LOCATION, '+
                                       ' COALESCE(uf.USER_COMMENTS,"") as USER_COMMENTS '+
                                       ' from '+
                                       ' (select ' +
                                                ' u.USER_ID as USER_ID , '+
                                                ' COALESCE(UPPER(u.USER_NAME),"") as USER_NAME, '+
                                                ' COALESCE(u.USER_EMAIL,"") as USER_EMAIL, '+
                                                ' COALESCE(u.USER_COUNTRY,"") as USER_COUNTRY, '+
                                                ' COALESCE(u.USER_ORG,"") as USER_ORG, '+
                                                ' COALESCE(uoto.OWNING_TTS_ORG,"") as USER_TRANSITION_ORG, '+
                                                ' COALESCE(u.USER_CITY_LOCATION,"") as USER_CITY_LOCATION, '+
                                                ' COALESCE(u.USER_COMMENTS,"") as USER_COMMENTS '+
                                       ' from '+
                                                ' USER u '+
                                                " left join  USER_OWNING_TTS_ORG  uoto "+                                       
                                                " on u.USER_ID = uoto.USER_ID ) uf "+
                                       " GROUP BY uf.USER_ID";    

                                


                                       
                                        //wpdlog("query "+query);

                                        conn.query(query)
                                                    .then((result)=>{

                                                                var objToJson = result;
                                                                var response = [];
                                                                for (var key in result) {
                                                                   // wpdlog("Result "+result[key]);
                                                                    response.push(result[key]);
                                                                }
                                                                objToJson.response = response;
                                                                finalresponse = JSON.stringify(objToJson);                             
                                                                conn.release();    
                                                                res.end(finalresponse.toUpperCase());                                                
                                                    })
                                                    .catch(err => {
                                                                //handle error
                                                                res.send({"Fetch" : "Fail" });
                                                                conn.release();  
                                                    })
                            
                        }).catch(err => {
                            //not connected
                        });

                }));   
                
                
// Get user search list
app.get('/tnt/userSearch/:id', accessHandler((req, res) => { 

    var userName = req.params.id;

    pool.getConnection()
                      .then(conn=>{

                        const query =  ' select ' +
                                                ' uf.USER_ID as USER_ID , '+
                                                ' COALESCE(UPPER(uf.USER_NAME),"") as USER_NAME, '+
                                                ' COALESCE(uf.USER_EMAIL,"") as USER_EMAIL, '+
                                                ' COALESCE(uf.USER_COUNTRY,"") as USER_COUNTRY, '+
                                                ' COALESCE(uf.USER_ORG,"") as USER_ORG, '+
                                                ' GROUP_CONCAT(COALESCE(uf.USER_TRANSITION_ORG,"")) as USER_TRANSITION_ORG, '+         
                                                ' COALESCE(uf.USER_CITY_LOCATION,"") as USER_CITY_LOCATION, '+
                                                ' COALESCE(uf.USER_COMMENTS,"") as USER_COMMENTS '+
                                       ' from '+
                                       ' (select ' +
                                                ' u.USER_ID as USER_ID , '+
                                                ' COALESCE(UPPER(u.USER_NAME),"") as USER_NAME, '+
                                                ' COALESCE(u.USER_EMAIL,"") as USER_EMAIL, '+
                                                ' COALESCE(u.USER_COUNTRY,"") as USER_COUNTRY, '+
                                                ' COALESCE(u.USER_ORG,"") as USER_ORG, '+
                                                ' COALESCE(uoto.OWNING_TTS_ORG,"") as USER_TRANSITION_ORG, '+
                                                ' COALESCE(u.USER_CITY_LOCATION,"") as USER_CITY_LOCATION, '+
                                                ' COALESCE(u.USER_COMMENTS,"") as USER_COMMENTS '+
                                        ' from '+
                                            ' (select ' +
                                                        ' USER_ID as USER_ID , '+
                                                        ' COALESCE(UPPER(USER_NAME),"") as USER_NAME, '+
                                                        ' COALESCE(USER_EMAIL,"") as USER_EMAIL, '+
                                                        ' COALESCE(USER_COUNTRY,"") as USER_COUNTRY, '+
                                                        ' COALESCE(USER_ORG,"") as USER_ORG, '+
                                                        ' COALESCE(USER_CITY_LOCATION,"") as USER_CITY_LOCATION, '+
                                                        ' COALESCE(USER_COMMENTS,"") as USER_COMMENTS '+
                                                        '   from USER '+
                                                        "      where UPPER(USER_NAME) LIKE '%"+userName.toUpperCase()+"%'  ) u "+
                                                        " left join  USER_OWNING_TTS_ORG  uoto "+                                       
                                                " on u.USER_ID = uoto.USER_ID ) uf"+
                                                " GROUP BY uf.USER_ID";  

            
                                        wpdlog("query "+query);

                                        conn.query(query)
                                                    .then((result)=>{

                                                                var objToJson = result;
                                                                var response = [];
                                                                for (var key in result) {
                                                                   // wpdlog("Result "+result[key]);
                                                                    response.push(result[key]);
                                                                }
                                                                objToJson.response = response;
                                                                finalresponse = JSON.stringify(objToJson);                             
                                                                conn.release();    
                                                                res.end(finalresponse.toUpperCase());                                                
                                                    })
                                                    .catch(err => {
                                                                //handle error
                                                                res.send({"Fetch" : "Fail" });
                                                                conn.release();  
                                                    })
                            
                        }).catch(err => {
                            //not connected
                        });

                }));                   
              
            
// Get user transition org list
app.get('/tnt/userTransitionOrgs/:id', accessHandler((req, res) => { 


    pool.getConnection()
                      .then(conn=>{
                                        const query =  ' select ' +
                                                                ' USER_ID, '+
                                                                ' COALESCE(OWNING_TTS_ORG,"") as OWNING_TTS_ORG '+                                                             
                                                        ' from '+
                                                                ' USER_OWNING_TTS_ORG '+
                                                                " where USER_ID = '"+req.params.id+"'";
                                                                
                                        //wpdlog("query "+query);

                                        conn.query(query)
                                                    .then((result)=>{

                                                                var objToJson = result;
                                                                var response = [];
                                                                for (var key in result) {
                                                                    //wpdlog("Result "+result[key]);
                                                                    response.push(result[key]);
                                                                }
                                                                objToJson.response = response;
                                                                finalresponse = JSON.stringify(objToJson);                             
                                                                conn.release();    
                                                                res.end(finalresponse);                                                
                                                    })
                                                    .catch(err => {
                                                                //handle error
                                                                wpdlog(err);
                                                                res.send({"Fetch" : "Fail" });
                                                                conn.release();  
                                                    })                            
                        }).catch(err => {
                            wpdlog(err);
                            //not connected
                        });

                }));      


// Create a new User
app.post('/tnt/user/', accessHandler((req, res) => { 


    var paramValue = req.body.USER_ORG;

    //wpdlog("paramValue "+paramValue);

    //var owning_orgs = JSON.parse(paramValue);

    var owning_orgs = paramValue.split(",");
    //wpdlog("owning_orgs length "+owning_orgs.length);

    //Maria db
    pool.getConnection()
    .then(conn=>{
                        const query =  " insert into USER(  "+
                                                "USER_ID, "+                                
                                                "USER_NAME, "+
                                                "USER_EMAIL, "+
                                                "USER_COUNTRY, "+
                                                "USER_ORG, "+
                                                "USER_TRANSITION_ORG, "+
                                                "USER_CITY_LOCATION, "+  
                                                "USER_COMMENTS "+                                                                                              
                                        " ) values ( "+
                                            "null,"+
                                            "'"+req.body.USER_NAME+"',"+
                                            "'"+req.body.USER_EMAIL+"',"+
                                            "'"+req.body.USER_COUNTRY+"',"+
                                            "'"+req.body.USER_ORG+"',"+
                                            "'"+req.body.USER_TRANSITION_ORG+"',"+
                                            "'"+req.body.USER_CITY_LOCATION+"',"+
                                            "'"+req.body.USER_COMMENTS+"' "+                                                                                                                
                                        ") ";
                            
                      conn.query(query)
                                  .then((result1)=>{
                                    var objToJson = result1;
                                    var response = [];
                                    for (var key in result1) {
                                        //wpdlog("Result "+result1[key]);
                                        response.push(result1[key]);
                                    }
                                    objToJson.response = response;
                                    finalresponse = JSON.stringify(objToJson);   

                                    conn.query("SELECT LAST_INSERT_ID() as PKEY")
                                    .then((result2)=>{                                                
                                       var userId = result2[0].PKEY;
                                       

                                       for( var i=0; i< owning_orgs.length; i++){
                                                var orgId = owning_orgs[i];
                                                const query =   " insert into USER_OWNING_TTS_ORG(  "+
                                                                " USER_OWNING_TTS_ORG_ID,"+
                                                                " USER_ID, "+                                
                                                                " OWNING_TTS_ORG "+                        
                                                                " ) values ( "+
                                                                        "null,"+                            
                                                                        "'"+userId+"',"+
                                                                        "'"+orgId+"' "+                                                                                                            
                                                                ") ";               
                                                conn.query(query)
                                                .then((result2)=>{ 
                                                })    
                                                .catch(err => {
                                                    //handle error
                                                    wpdlog(err);
                                                    res.send({"Fetch" : "Fail" });
            
                                                });
                                        }//end of for    
                                                                                
                                        conn.release();    
                                        res.end(finalresponse);  
                                    })  
                                    .catch(err => {
                                        //handle error
                                        wpdlog(err);
                                        res.send({"Fetch" : "Fail" });
                                        conn.release();  
                                    }) 

                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
          wpdlog(err);
      });



    //Maria db
 
}));

// #####################################  UPLOAD USER  ############################################################
app.post('/tnt/uploadUser/', accessHandler((req, res) => { 

    
    //var phase = req.params.id;

    //Maria db
    pool.getConnection()
    .then(conn=>{
                    var activities = JSON.parse(JSON.stringify(req.body));
                    for( var i=0; i< activities.length; i++){

                        var userName = activities[i]["USER_NAME"];
                        var email = activities[i]["USER_EMAIL"];
                        var userCountry = activities[i]["USER_COUNTRY"];
                        var userOrg = activities[i]["USER_ORG"];
                        var userTranOrg = activities[i]["USER_TRANSITION_ORG"];
                        var userCityLocation = activities[i]["USER_CITY_LOCATION"];
                        var userComment = activities[i]["USER_COMMENTS"];                                 

                    
                        const query =  " insert into USER(  "+
                                                            "USER_ID, "+                                
                                                            "USER_NAME, "+
                                                            "USER_EMAIL, "+
                                                            "USER_COUNTRY, "+
                                                            "USER_ORG, "+
                                                            "USER_TRANSITION_ORG, "+
                                                            "USER_CITY_LOCATION, "+  
                                                            "USER_COMMENTS "+                                                                                              
                                                        " ) values ( "+
                                                            "null,"+
                                                                "'"+userName+"',"+
                                                                "'"+email+"',"+
                                                                "'"+userCountry+"',"+
                                                                "'"+userOrg+"',"+
                                                                "'"+userTranOrg+"',"+
                                                                "'"+userCityLocation+"',"+
                                                                "'"+userComment+"' "+                                                                                                                
                                                        ") ";
    
                                conn.query(query)
                                            .then((result)=>{

                                                conn.query(" SELECT LAST_INSERT_ID() ")
                                                .then((result)=>{

                                                        var objToJson = result;
                                                        var response = [];
                                                        for (var key in result) {
                                                            //wpdlog("Result "+result[key]);
                                                            response.push(result[key]);
                                                        }
                                                        objToJson.response = response;
                                                        finalresponse = JSON.stringify(objToJson);  
                                                        conn.query("SELECT LAST_INSERT_ID() as PKEY")
                                                        .then((result2)=>{                                                
                                                            var userId = result2[0].PKEY;
                                                            var owning_orgs = userOrg.split(",");
                                                            for( var i=0; i< owning_orgs.length; i++){
                                                                    var orgId = owning_orgs[i];
                                                                    const query =   " insert into USER_OWNING_TTS_ORG(  "+
                                                                                    " USER_OWNING_TTS_ORG_ID,"+
                                                                                    " USER_ID, "+                                
                                                                                    " OWNING_TTS_ORG "+                        
                                                                                    " ) values ( "+
                                                                                            "null,"+                            
                                                                                            "'"+userId+"',"+
                                                                                            "'"+orgId+"' "+                                                                                                            
                                                                                    ") ";               
                                                                    conn.query(query)
                                                                    .then((result2)=>{ 
                                                                    })    
                                                                    .catch(err => {
                                                                        //handle error
                                                                        wpdlog(err);
                                                                        res.send({"Fetch" : "Fail" });
                                
                                                                    });
                                                            }//end of for    
                                                                                                    
                                                            conn.release();    
                                                            res.end(finalresponse);  
                                                        })                                                           
                                                        }) 
                                                        .catch(err => {
                                                                    //handle error
                                                                    res.send({"Fetch" : "Fail" });
                                                                    conn.release();  
                                                        })                                                                                      
                                            })
                                            .catch(err => {
                                                        //handle error
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                            })

                    }// end of for loop
                    conn.release();    
                    res.end(finalresponse); 

      }).catch(err => {
          //not connected
      });
}));


// #####################################  GET USER DATA ############################################################
app.get('/tnt/user/:id', accessHandler((req, res) => { 

    const user_id = req.params.id; 

    //Maria db
    pool.getConnection()
    .then(conn=>{

                const query =  ' select ' +
                ' u.USER_ID, '+
                ' COALESCE(u.USER_NAME,"") as USER_NAME, '+
                ' COALESCE(u.USER_EMAIL,"") as USER_EMAIL, '+
                ' COALESCE(u.USER_COUNTRY,"") as USER_COUNTRY, '+
                ' COALESCE(u.USER_ORG,"") as USER_ORG, '+
                ' GROUP_CONCAT(COALESCE(uoto.OWNING_TTS_ORG,"")) as USER_TRANSITION_ORG, '+         
                ' COALESCE(u.USER_CITY_LOCATION,"") as USER_CITY_LOCATION, '+
                ' COALESCE(u.USER_COMMENTS,"") as USER_COMMENTS '+
                ' from '+
                '( select ' +
                      ' u.USER_ID, '+
                      ' COALESCE(u.USER_NAME,"") as USER_NAME, '+
                      ' COALESCE(u.USER_EMAIL,"") as USER_EMAIL, '+
                      ' COALESCE(u.USER_COUNTRY,"") as USER_COUNTRY, '+
                      ' COALESCE(u.USER_ORG,"") as USER_ORG, '+                             
                      ' COALESCE(u.USER_CITY_LOCATION,"") as USER_CITY_LOCATION, '+
                      ' COALESCE(u.USER_COMMENTS,"") as USER_COMMENTS '+
              ' from '+
                      ' USER u  '+
              " where u.USER_ID = '"+user_id+"' ) u "+                                                   
              " left join  USER_OWNING_TTS_ORG uoto "+
              " on u.USER_ID = uoto.USER_ID "+
              " GROUP BY u.USER_ID ";
                      
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db
 
}));


// #####################################  GET USER ACCESS DATA ############################################################
app.get('/tnt/userAccessData/:id', accessHandler((req, res) => { 


    //wpdlog("UserAccessData");

    const userEmail = req.params.id; 

    //wpdlog("UserAccessData"+userEmail);
    
    //Maria db

    pool.getConnection()
    .then(conn=>{

                    /*
                     const query =  ' select ' +
                            ' USER_ID, '+
                            ' COALESCE(USER_NAME,"") as USER_NAME, '+
                            ' COALESCE(USER_EMAIL,"") as USER_EMAIL, '+
                            ' COALESCE(USER_COUNTRY,"") as USER_COUNTRY, '+
                            ' COALESCE(USER_ORG,"") as USER_ORG, '+
                            ' COALESCE(USER_TRANSITION_ORG,"") as USER_TRANSITION_ORG, '+
                            ' COALESCE(USER_CITY_LOCATION,"") as USER_CITY_LOCATION, '+
                            ' COALESCE(USER_COMMENTS,"") as USER_COMMENTS, '+
                            ' COALESCE(USER_IS_SUPERUSER,"") as USER_IS_SUPERUSER '+
                    ' from '+
                            ' USER '+
                    ' where '+
                            "USER_EMAIL = '"+userEmail+"'";

                    */
              

                            
                            var query =  ' select ' +
                            ' u.USER_ID, '+
                            ' COALESCE(u.USER_NAME,"") as USER_NAME, '+
                            ' COALESCE(u.USER_EMAIL,"") as USER_EMAIL, '+
                            ' COALESCE(u.USER_COUNTRY,"") as USER_COUNTRY, '+
                            ' COALESCE(u.USER_ORG,"") as USER_ORG, '+
                            ' GROUP_CONCAT(COALESCE(uoto.OWNING_TTS_ORG,"")) as USER_TRANSITION_ORG, '+        
                            ' COALESCE(u.USER_CITY_LOCATION,"") as USER_CITY_LOCATION, '+
                            ' COALESCE(u.USER_COMMENTS,"") as USER_COMMENTS, '+
                            ' COALESCE(u.USER_IS_SUPERUSER,"") as USER_IS_SUPERUSER '+
                            ' from '+
                            '( select ' +
                                  ' u.USER_ID, '+
                                  ' COALESCE(u.USER_NAME,"") as USER_NAME, '+
                                  ' COALESCE(u.USER_EMAIL,"") as USER_EMAIL, '+
                                  ' COALESCE(u.USER_COUNTRY,"") as USER_COUNTRY, '+
                                  ' COALESCE(u.USER_ORG,"") as USER_ORG, '+                             
                                  ' COALESCE(u.USER_CITY_LOCATION,"") as USER_CITY_LOCATION, '+
                                  ' COALESCE(u.USER_COMMENTS,"") as USER_COMMENTS, '+
                                  ' COALESCE(u.USER_IS_SUPERUSER,"") as USER_IS_SUPERUSER '+
                                ' from '+
                                  ' USER u  '+
                                  " where u.USER_EMAIL = '"+userEmail+"') u "+                                                 
                          " left join  USER_OWNING_TTS_ORG uoto "+
                          " on u.USER_ID = uoto.USER_ID "+
                          " GROUP BY u.USER_ID";                            



                      //wpdlog("query ....."+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  ////wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
          wpdlog(err);
      });


    //Mariadb

}));


// #####################################  UPDATE USER  ############################################################
app.put('/tnt/user/:id', accessHandler((req, res) => { 

    //wpdlog("user_id "+req.params.id);

    var paramValue = req.body.USER_ORG;
    var owning_orgs = paramValue.split(",");


    //Maria db

    pool.getConnection()
    .then(conn=>{

                                  const query = "update USER " + 
                                  "set USER_NAME ='" + req.body.USER_NAME + "', " +
                                                    "USER_EMAIL  ='" + req.body.USER_EMAIL + "',  " +     
                                                    "USER_COUNTRY  ='" + req.body.USER_COUNTRY + "',  " +  
                                                    "USER_ORG  ='" + req.body.USER_ORG + "',  " +  
                                                    "USER_TRANSITION_ORG  ='" + req.body.USER_ORG + "',  " +  
                                                    "USER_CITY_LOCATION  ='" + req.body.USER_CITY_LOCATION + "',  " +  
                                                    "USER_COMMENTS  ='" + req.body.USER_COMMENTS + "'  " +                                                               
                                    "where  "+
                                        "USER_ID ='" +req.params.id +"' " ;
                                
                                   //wpdlog("query "+query);

                                  conn.query(query)
                                  .then((result)=>{       
                                                    const queryDeleteExistingOrg = "delete from USER_OWNING_TTS_ORG "+
                                                        "where USER_ID ='" +req.params.id +"' " ; 

                                                          //wpdlog("queryDeleteExistingOrg "+queryDeleteExistingOrg);
                                                           conn.query(queryDeleteExistingOrg)
                                                           .then((result1)=>{                                          
                                                                for( var i=0; i< owning_orgs.length; i++){
                                                                            var orgId = owning_orgs[i];
                                                                            const queryInsert =   " insert into USER_OWNING_TTS_ORG(  "+
                                                                                                        " USER_OWNING_TTS_ORG_ID,"+
                                                                                                        " USER_ID, "+                                
                                                                                                        " OWNING_TTS_ORG "+                        
                                                                                                        " ) values ( "+
                                                                                                                "null,"+                            
                                                                                                                "'"+req.params.id+"',"+
                                                                                                                "'"+orgId+"' "+                                                                                                            
                                                                                                        ") ";    
                                                                                                        
                                                                            //wpdlog(queryInsert);                            
                                                                            conn.query(queryInsert)
                                                                            .then((result2)=>{ 
                                                                                
                                                                            })    
                                                                            .catch(err => {
                                                                                //handle error
                                                                                wpdlog(err);                                                       
                                                                                res.send({"Fetch" : "Fail" });
                                        
                                                                            });
                                                                }//end of for
                                                            })    
                                                            .catch(err => {
                                                                //handle error
                                                                wpdlog(err);                                                       
                                                                res.send({"Fetch" : "Fail" });                        
                                                            });    
                                                            wpdlog("after delete ");        
                                    })    
                                    .catch(err => {
                                        //handle error
                                        wpdlog(err);
                                        res.send({"Fetch" : "Fail" });
                                    });

                                    conn.release();    
                                    res.end(finalresponse);   

                            })
                            .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                           });
          
    }));

// #####################################  DELETE USER  ############################################################
app.delete('/tnt/user/:id', accessHandler((req, res) => { 

    wpdlog("user_id "+req.params.id);

    //Maria db
    pool.getConnection()
    .then(conn=>{

                      const query = "delete from USER " +                                                                
                                       "where  "+
                                           "USER_ID ='" +req.params.id +"' " ;
                                          
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{
                            
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db

    //connection.connect();
 
}));


//############################################### ROLE FUNCTIONALITY ADD ##############################################
// #####################################  GET FUNCTIONLITY ADDED List #################################################
app.get('/tnt/roleFunctionalityAdded/:id', accessHandler((req, res) => { 


   //Maria db  
   pool.getConnection()
   .then(conn=>{

                    const query =  " select " +
                                        " rf.ROLE_FUNCTIONALITY_ID as ROLE_FUNCTIONALITY_ID, "+
                                        " COALESCE(f.FUNC_NAME,'') as FUNC_NAME, "+            
                                        " COALESCE(f.FUNC_DESCRIPTION,'') as FUNC_DESCRIPTION "+
                                    " from "+
                                        "  ROLE_FUNCTIONALITY as rf, FUNCTIONALITY as f "+
                                        " WHERE rf.FUNCTIONALITY_ID = f.FUNCTIONALITY_ID "+
                                        " AND rf.ROLE_ID ="+req.params.id; 
                         
                     //wpdlog("query "+query);

                     conn.query(query)
                                 .then((result)=>{

                                             var objToJson = result;
                                             var response = [];
                                             for (var key in result) {
                                                 //wpdlog("Result "+result[key]);
                                                 response.push(result[key]);
                                             }
                                             objToJson.response = response;
                                             finalresponse = JSON.stringify(objToJson);                             
                                             conn.release();    
                                             res.end(finalresponse);                                                
                                 })
                                 .catch(err => {
                                             //handle error
                                             res.send({"Fetch" : "Fail" });
                                             conn.release();  
                                 })
         
     }).catch(err => {
         //not connected
     });

   //Maria db
 
}));

// #####################################  GET ROLE FUNCTIONLITY ADD List ############################################################
app.get('/tnt/roleFunctionalityAddList/:id', accessHandler((req, res) => { 


   //Maria db
   pool.getConnection()
   .then(conn=>{

                    const query =  " select " +
                                        " COALESCE(rf.FUNCTIONALITY_ID,'') as ROLE_FUNCTIONALITY_ID, "+
                                        " f.FUNCTIONALITY_ID as FUNCTIONALITY_ID, "+
                                        " COALESCE(f.FUNC_NAME,'') as FUNC_NAME, "+            
                                        " COALESCE(f.FUNC_DESCRIPTION,'') as FUNC_DESCRIPTION "+           
                                    " from "+
                                        "  FUNCTIONALITY as f LEFT JOIN (SELECT FUNCTIONALITY_ID,ROLE_FUNCTIONALITY_ID from ROLE_FUNCTIONALITY WHERE ROLE_ID="+req.params.id+") as rf  "+
                                        " ON f.FUNCTIONALITY_ID = rf.FUNCTIONALITY_ID ";
                          
                     //wpdlog("query "+query);

                     conn.query(query)
                                 .then((result)=>{

                                             var objToJson = result;
                                             var response = [];
                                             for (var key in result) {
                                                 //wpdlog("Result "+result[key]);
                                                 response.push(result[key]);
                                             }
                                             objToJson.response = response;
                                             finalresponse = JSON.stringify(objToJson);                             
                                             conn.release();    
                                             res.end(finalresponse);                                                
                                 })
                                 .catch(err => {
                                             //handle error
                                             res.send({"Fetch" : "Fail" });
                                             conn.release();  
                                 })
         
     }).catch(err => {
         //not connected
     });
   //Maria db
}));


// #####################################  DELETE/REMOVE FUNCTIONALITY FROM ROLE  ############################################################
app.delete('/tnt/roleFunctionality/:id', accessHandler((req, res) => { 

    wpdlog("roleFunctionality_id "+req.params.id);

    //Maria db

    pool.getConnection()
    .then(conn=>{

                    const query = "delete from  ROLE_FUNCTIONALITY " + 
                                  "where  "+
                                  "ROLE_FUNCTIONALITY_ID ='" +req.params.id +"' " ; 
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });



    //Maria db


}));

// #####################################Add A NEW FUNCTIONALITIES TO A ROLE ############################################################
app.post('/tnt/roleFunctionalityAdd/:id', accessHandler((req, res) => { 

    
    //wpdlog(" FUNCTIONALITIES "+req.body.FUNCTIONALITY);
    
    var roleId = req.params.id;
    var paramValue = req.body.functionalities;
    var funcId = '';

    var functionalities = paramValue.split(",");


    //Maria db
    pool.getConnection()
    .then(conn=>{


        for( var i=0; i< functionalities.length; i++){

            funcId = functionalities[i];
       
                    const query =  " insert into ROLE_FUNCTIONALITY(  "+
                                            "ROLE_FUNCTIONALITY_ID, "+                                
                                            "ROLE_ID, "+
                                            "FUNCTIONALITY_ID "+                                                                                           
                                    " ) values ( "+
                                        "null,"+                            
                                        "'"+roleId+"',"+
                                        "'"+funcId+"' "+                                                                                                            
                                    ") ";
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result1)=>{
                                            conn.query(" SELECT LAST_INSERT_ID() ")
                                                    .then((result)=>{                                    

                                                    var objToJson = result;
                                                    var response = [];
                                                    for (var key in result) {
                                                        //wpdlog("Result "+result[key]);
                                                        response.push(result[key]);
                                                    }
                                                    objToJson.response = response;
                                                    finalresponse = JSON.stringify(objToJson);                             
                                            
                                                    })  
                                                    .catch(err => {
                                                        //handle error
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                            })
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
            }  // end of for   
            
            conn.release();    
            res.end(finalresponse);
          
      }).catch(err => {
          //not connected
      });


    }));   
  

// #####################################  GET USER ROLE ADD List ############################################################
app.get('/tnt/userRoleAddList/:id', accessHandler((req, res) => { 


  //Maria db

    pool.getConnection()
    .then(conn=>{

                    const query =  " select " +
                        " COALESCE(ur.USER_ROLE_ID,'') as USER_ROLE_ID, "+
                        " r.ROLE_ID as ROLE_ID, "+
                        " COALESCE(r.ROLE_NAME,'') as ROLE_NAME, "+            
                        " COALESCE(r.ROLE_DESCRIPTION,'') as ROLE_DESCRIPTION "+           
                    " from "+
                        "  ROLE as r LEFT JOIN (SELECT ROLE_ID,USER_ROLE_ID from USER_ROLE WHERE USER_ID="+req.params.id+") as ur  "+
                        " ON r.ROLE_ID = ur.ROLE_ID "; 
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });

      //Maria db

 
}));


// #####################################  GET USER ROLE ADDED List ############################################################
app.get('/tnt/userRoleList/:id', accessHandler((req, res) => { 

   //Maria db
   pool.getConnection()
   .then(conn=>{

                    const query =  " select " +
                    " COALESCE(ur.USER_ROLE_ID,'') as USER_ROLE_ID, "+
                    " r.ROLE_ID as ROLE_ID, "+
                    " COALESCE(r.ROLE_NAME,'') as ROLE_NAME, "+            
                    " COALESCE(r.ROLE_DESCRIPTION,'') as ROLE_DESCRIPTION "+           
                " from "+
                    "  ROLE as r, USER_ROLE as ur  "+
                    " WHERE r.ROLE_ID = ur.ROLE_ID "+
                    " AND ur.USER_ID ="+req.params.id;
             
             
                     //wpdlog("query "+query);

                     conn.query(query)
                                 .then((result)=>{

                                             var objToJson = result;
                                             var response = [];
                                             for (var key in result) {
                                                 //wpdlog("Result "+result[key]);
                                                 response.push(result[key]);
                                             }
                                             objToJson.response = response;
                                             finalresponse = JSON.stringify(objToJson);                             
                                             conn.release();    
                                             res.end(finalresponse);                                                
                                 })
                                 .catch(err => {
                                             //handle error
                                             res.send({"Fetch" : "Fail" });
                                             conn.release();  
                                 })
         
     }).catch(err => {
         //not connected
     });

   //Maria db
}));


// #####################################Add  NEW ROLES TO USER ############################################################
app.post('/tnt/userRoleAdd/:id', accessHandler((req, res) => { 

    
    wpdlog(" ROLES "+req.body.FUNCTIONALITY);
    
    var userId = req.params.id;
    var paramValue = req.body.roles;
    var roleId = '';

    var roles = paramValue.split(",");
    pool.getConnection()
    .then(conn=>{

        for( var i=0; i< roles.length; i++){

            roleId = roles[i];
       
            const query =  " insert into USER_ROLE(  "+
                                    "USER_ROLE_ID, "+                                
                                    "USER_ID, "+
                                    "ROLE_ID "+                                                                                           
                            " ) values ( "+
                                "null,"+                            
                                "'"+userId+"',"+
                                "'"+roleId+"' "+                                                                                                            
                            ") ";
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result1)=>{

                                    conn.query(" SELECT LAST_INSERT_ID() ")
                                    .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);   
                                              
                                            })  
                                            .catch(err => {
                                                //handle error
                                                res.send({"Fetch" : "Fail" });
                                                conn.release();  
                                    })                                                    
                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          }// end of for  
          
          conn.release();    
          res.end(finalresponse);
          
      }).catch(err => {
          //not connected
      });
    
}));

// #####################################  DELETE ROLE FROM USER  ############################################################
app.delete('/tnt/userRole/:id', accessHandler((req, res) => { 

    //wpdlog("user_role_id "+req.params.id);

    //Maria db

    pool.getConnection()
    .then(conn=>{

                    const query = "delete from USER_ROLE " + 
                                  "where  "+
                                  "USER_ROLE_ID ='" +req.params.id +"' " ; 
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });



    //Maria db


}));


// #####################################  GET USER FUNCTIONALITY List ############################################################
app.get('/tnt/userFunctionalityList/:id', accessHandler((req, res) => { 


    //Maria db

    pool.getConnection()
    .then(conn=>{
 
        const query =  "( select " +
                        ' f.FUNCTIONALITY_ID, '+
                        ' COALESCE(f.FUNC_NAME,"") as FUNC_NAME, '+
                        ' COALESCE(f.FUNC_ROUTERLINK,"") as FUNC_ROUTERLINK, '+
                        ' COALESCE(f.FUNC_DESCRIPTION,"") as FUNC_DESCRIPTION, '+      
                        ' COALESCE(f.FUNC_OPERATION_TYPE,"") as FUNC_OPERATION_TYPE,  '+  
                        ' COALESCE(f.FUNC_TRANSITION_DEPENDENCY ,"") as FUNC_TRANSITION_DEPENDENCY, '+      
                        ' COALESCE(f.FUNC_MODULE,"") as FUNC_MODULE,  '+  
                        ' COALESCE(f.FUNC_UOI ,"") as FUNC_UOI,   '+  
                        ' COALESCE(f.FUNC_DEFAULT ,"") as FUNC_DEFAULT   '+                                        
                        " from "+
                            " USER_ROLE as ur, ROLE_FUNCTIONALITY as rf, FUNCTIONALITY as f, USER as u   "+
                            " WHERE ur.ROLE_ID = rf.ROLE_ID "+
                            " AND rf.FUNCTIONALITY_ID = f.FUNCTIONALITY_ID "+
                            " AND u.USER_ID = ur.USER_ID "+            
                            " AND u.USER_EMAIL ='"+req.params.id+"') "+
            " union ("  +  
                      " select " +
                            ' f.FUNCTIONALITY_ID, '+
                            ' COALESCE(f.FUNC_NAME,"") as FUNC_NAME, '+
                            ' COALESCE(f.FUNC_ROUTERLINK,"") as FUNC_ROUTERLINK, '+
                            ' COALESCE(f.FUNC_DESCRIPTION,"") as FUNC_DESCRIPTION, '+      
                            ' COALESCE(f.FUNC_OPERATION_TYPE,"") as FUNC_OPERATION_TYPE,  '+  
                            ' COALESCE(f.FUNC_TRANSITION_DEPENDENCY ,"") as FUNC_TRANSITION_DEPENDENCY, '+      
                            ' COALESCE(f.FUNC_MODULE,"") as FUNC_MODULE,  '+  
                            ' COALESCE(f.FUNC_UOI ,"") as FUNC_UOI,   '+   
                            ' COALESCE(f.FUNC_DEFAULT ,"") as FUNC_DEFAULT   '+                  
                        " from FUNCTIONALITY as f "+  
                            " WHERE f.FUNC_DEFAULT='Y' )"    ;
                   
              
                      //wpdlog("query "+query);
 
                      conn.query(query)
                                  .then((result)=>{
 
                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });

    //Maria db

}));


// #####################################  GET ROLE FUNCTIONALITY Mapping ############################################################
app.get('/tnt/roleFunctionalityMapping/', accessHandler((req, res) => { 


    //Maria db

    pool.getConnection()
    .then(conn=>{
 
        const query =  " select " +
                        ' f.FUNCTIONALITY_ID, '+
                        ' COALESCE(f.FUNC_NAME,"") as FUNC_NAME, '+
                        ' COALESCE(f.FUNC_ROUTERLINK,"") as FUNC_ROUTERLINK, '+
                        ' COALESCE(f.FUNC_DESCRIPTION,"") as FUNC_DESCRIPTION, '+      
                        ' COALESCE(f.FUNC_OPERATION_TYPE,"") as FUNC_OPERATION_TYPE,  '+  
                        ' COALESCE(f.FUNC_TRANSITION_DEPENDENCY ,"") as FUNC_TRANSITION_DEPENDENCY, '+      
                        ' COALESCE(f.FUNC_MODULE,"") as FUNC_MODULE,  '+  
                        ' COALESCE(f.FUNC_UOI ,"") as FUNC_UOI,   '+   
                        ' GROUP_CONCAT(r.role_id) as ROLE_IDS   '+                                       
                        " from "+
                            " ROLE as r, ROLE_FUNCTIONALITY as rf, FUNCTIONALITY as f   "+
                            " WHERE r.ROLE_ID = rf.ROLE_ID "+
                               " AND rf.FUNCTIONALITY_ID = f.FUNCTIONALITY_ID "+
                               " GROUP BY f.FUNCTIONALITY_ID";
              
              
                      //wpdlog("query "+query);
 
                      conn.query(query)
                                  .then((result)=>{
 
                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });

    //Maria db

}));


// #####################################  GET USER TRANSITION ACCESS List ############################################################

// This is different from user transition list in the way that we need to pass email address as instead of user_id in the to get user access information
// because in the beginning we dont have user id we have email addresss ...we fetch user_id to use them other transactional operation

app.get('/tnt/userTransitionAccessList/:id', accessHandler((req, res) => { 


    //Maria db
    pool.getConnection()
    .then(conn=>{

                    const query =  " select " +
                                        ' t.IntegrationID as TRANSITION_ID, '+
                                        ' COALESCE(t.TransitionName,"") as TRANSITION_NAME, '+
                                        ' COALESCE(ut.USER_TRANSITION_ID,"") as USER_TRANSITION_ID , '+
                                        ' COALESCE(t.TransitionName,"") as TRANSITION_DESCRIPTION, '+    
                                        ' COALESCE(ut.USER_ROLE_ID,"") as ROLE_IDS '+       
                                    " from "+
                                        " USER_TRANSITION as ut,  TRANSITIONPROFILE as t, USER u   "+
                                        " WHERE ut.TRANSITION_ID = t.IntegrationID "+  
                                        " AND u.USER_ID = ut.USER_ID "+       
                                        " AND u.USER_EMAIL ='"+req.params.id+"'";
                            
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });
  
}));



// #####################################  Upload Exit Criteria  ############################################################
app.post('/tnt/uploadExitCriteria/:id', accessHandler((req, res) => { 

    //wpdlog(" STANDARD "+JSON.stringify(req.body));
    var phase = req.params.id;
    // wpdlog(" activities "+activities);

    //Maria db
    pool.getConnection()
    .then(conn=>{

        var criterion = JSON.parse(JSON.stringify(req.body));
        for( var i=0; i< criterion.length; i++){

            var exit_criteria = criterion[i]["EXIT_CRITERIA"];
            //wpdlog("exit criteria "+i+ " "+ exit_criteria);       
            
            const query =  " insert into EXIT_CRITERIA (  "+
                                    "EXIT_CRITERIA_ID, "+                                
                                    "EXIT_CRITERIA, "+
                                    "PHASE_NAME "+                                                                                           
                            " ) values ( "+
                                "null,"+                            
                                "'"+exit_criteria+"',"+
                                "'"+phase+"' "+                                                                                                            
                            ") ";
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result1)=>{

                                        conn.query(" SELECT LAST_INSERT_ID() ")
                                        .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
  
                                            })
                                            .catch(err => {
                                                        //handle error
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                            })                                                   
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
        }// end of for 
        conn.release();    
        res.end(finalresponse); 
      }).catch(err => {
          //not connected
      });



    //Maria db

    pool.getConnection(function(err, connection) {
        if (err) {
          return console.error('error: ' + err.message);
        }
       
        //wpdlog('Connected to the MySQL server.');
        var criterion = JSON.parse(JSON.stringify(req.body));
        for( var i=0; i< criterion.length; i++){

            exit_criteria = criterion[i]["EXIT_CRITERIA"];
            //wpdlog("exit criteria "+i+ " "+ exit_criteria);       

            
        const query =  " insert into EXIT_CRITERIA (  "+
                                "EXIT_CRITERIA_ID, "+                                
                                "EXIT_CRITERIA, "+
                                "PHASE_NAME "+                                                                                           
                        " ) values ( "+
                            "null,"+                            
                            "'"+exit_criteria+"',"+
                            "'"+phase+"' "+                                                                                                            
                        ") ";
 
        //wpdlog("query "+query);
       
        connection.query(query, function (err, result, fields) {
            if (err) 
              return console.error('error: ' + err.message);

            connection.query(" SELECT LAST_INSERT_ID() ", function (err, result, fields) {
                var objToJson = result;
                var response = [];
                for (var key in result) {
                   //wpdlog("Result "+result[key]);
                   response.push(result[key]);
                }
                objToJson.response = response;
                finalresponse = JSON.stringify(objToJson);     

            });
  
        }); 

        

        }// end of for   
        
        
        connection.release();    
        res.end(finalresponse);  
    });       
}));


// #####################################  CREATE EXIT CRITERIA  ############################################################
app.post('/tnt/exitCriteria/', accessHandler((req, res) => { 

  

    //Maria db

    pool.getConnection()
    .then(conn=>{              
                        const query =  " insert into EXIT_CRITERIA (  "+
                                            "EXIT_CRITERIA_ID, "+                                
                                            "EXIT_CRITERIA, "+
                                            "PHASE_NAME "+                                                                                           
                                            " ) values ( "+
                                                "null,"+                            
                                                "'"+req.body.EXIT_CRITERIA+"',"+
                                                "'"+req.body.PHASE+"' "+                                                                                                            
                                            ") ";
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });



    //Maria db


}));


// #####################################  GET EXIT CRITERIA LIST ############################################################
app.get('/tnt/exitCriterias/:id', accessHandler((req, res) => { 

   //Maria db

   pool.getConnection()
   .then(conn=>{

                    const query =  ' select ' +
                        ' EXIT_CRITERIA_ID , '+
                        ' COALESCE(EXIT_CRITERIA ,"") as EXIT_CRITERIA , '+
                        ' COALESCE(PHASE_NAME ,"") as PHASE_NAME  '+
                    ' from '+
                        '  EXIT_CRITERIA  '+
                    ' where  '+
                        "PHASE_NAME ='" +req.params.id +"' " ; 
             
             
                     //wpdlog("query "+query);

                     conn.query(query)
                                 .then((result)=>{

                                             var objToJson = result;
                                             var response = [];
                                             for (var key in result) {
                                                 //wpdlog("Result "+result[key]);
                                                 response.push(result[key]);
                                             }
                                             objToJson.response = response;
                                             finalresponse = JSON.stringify(objToJson);                             
                                             conn.release();    
                                             res.end(finalresponse);                                                
                                 })
                                 .catch(err => {
                                             //handle error
                                             res.send({"Fetch" : "Fail" });
                                             conn.release();  
                                 })
         
     }).catch(err => {
         //not connected
     });



   //Maria db
  
}));


// #####################################  GET EXIT CRITERIA DATA ############################################################
app.get('/tnt/exitCriteriaData/:id', accessHandler((req, res) => { 

    //const exitCriteriaId = req.params.id; 

    //Maria db
    pool.getConnection()
    .then(conn=>{

        const query =   ' select ' +
                            ' EXIT_CRITERIA_ID , '+
                            ' COALESCE(EXIT_CRITERIA ,"") as EXIT_CRITERIA , '+                            
                            ' COALESCE(PHASE_NAME ,"") as PHASE_NAME  '+
                        ' from '+
                            '  EXIT_CRITERIA  '+
                        ' where  '+
                             "EXIT_CRITERIA_ID ='" +req.params.id +"' " ; 

      //wpdlog("query "+query);

      conn.query(query)
                  .then((result)=>{

                              var objToJson = result;
                              var response = [];
                              for (var key in result) {
                                  //wpdlog("Result "+result[key]);
                                  response.push(result[key]);
                              }
                              objToJson.response = response;
                              finalresponse = JSON.stringify(objToJson);                             
                              conn.release();    
                              res.end(finalresponse);                                                
                  })
                  .catch(err => {
                              //handle error
                              res.send({"Fetch" : "Fail" });
                              conn.release();  
                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db
 
}));


// #####################################  UPDATE EXIT CRITERIA  ############################################################
app.put('/tnt/updateExitCriteria/:id', accessHandler((req, res) => { 

    //wpdlog("exit criteria id  "+req.params.id);

    //Maria db

    pool.getConnection()
    .then(conn=>{

                    const query = "update  EXIT_CRITERIA " + 
                    "set EXIT_CRITERIA ='" + req.body.EXIT_CRITERIA + "' " +                             
                    "where  "+
                        "EXIT_CRITERIA_ID ='" +req.params.id +"' " ; 
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });



    //Maria db


}));

// ##################################### DELETE EXIT CRIERIA ############################################################
app.post('/tnt/deleteExitCriteria/', accessHandler((req, res) => { 

    
    //wpdlog(" exitCriteriaList "+req.body.exitCriteriaList);
    

    var paramValue = req.body.exitCriteriaList;
    var exitCriteriaId = '';

    var exitCriteriaList = paramValue.split(",");


    //Maria db
    pool.getConnection()
    .then(conn=>{

        for( var i=0; i< exitCriteriaList.length; i++){

                    exitCriteriaId = exitCriteriaList[i];
       
                    const query =  " delete from  EXIT_CRITERIA  "+
                                   " where EXIT_CRITERIA_ID='"+exitCriteriaId+"'";
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result1)=>{
                                            conn.query(" SELECT LAST_INSERT_ID() ")
                                                    .then((result)=>{                                    

                                                    var objToJson = result;
                                                    var response = [];
                                                    for (var key in result) {
                                                        //wpdlog("Result "+result[key]);
                                                        response.push(result[key]);
                                                    }
                                                    objToJson.response = response;
                                                    finalresponse = JSON.stringify(objToJson);                             
                                            
                                                    })  
                                                    .catch(err => {
                                                        //handle error
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                            })
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
            }  // end of for   
            
            conn.release();    
            res.end(finalresponse);
          
      }).catch(err => {
          //not connected
      });


    })); 

// #####################################  GET STANDARD ACTIVITY LIST ############################################################
app.get('/tnt/standardActivities/:id', accessHandler((req, res) => { 


    //Maria db

    pool.getConnection()
    .then(conn=>{

                    const query =  ' select ' +
                        ' STANDARD_ACTIVITY_ID , '+
                        ' COALESCE(STANDARD_ACTIVITY_NAME ,"") as STANDARD_ACTIVITY_NAME , '+
                        ' COALESCE(MILESTONE_OR_TASK ,"") as MILESTONE_OR_TASK , '+
                        ' COALESCE(PHASE_NAME ,"") as PHASE_NAME  '+
                    ' from '+
                        '  STANDARD_ACTIVITY  '+
                    ' where  '+
                        "PHASE_NAME ='" +req.params.id +"' " ; 
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });
    //Maria db
}));


// #####################################  GET STANDARD ACTIVITY DATA ############################################################
app.get('/tnt/standardActivityData/:id', accessHandler((req, res) => { 

    //const standardActivityId = req.params.id; 

    //Maria db
    pool.getConnection()
    .then(conn=>{

        const query =   ' select ' +
                            ' STANDARD_ACTIVITY_ID , '+
                            ' COALESCE(STANDARD_ACTIVITY_NAME ,"") as STANDARD_ACTIVITY_NAME , '+
                            ' COALESCE(MILESTONE_OR_TASK ,"") as MILESTONE_OR_TASK,  '+
                            ' COALESCE(PHASE_NAME ,"") as PHASE_NAME  '+
                        ' from '+
                            '  STANDARD_ACTIVITY  '+
                        ' where  '+
                             "STANDARD_ACTIVITY_ID ='" +req.params.id +"' " ; 

      //wpdlog("query "+query);

      conn.query(query)
                  .then((result)=>{

                              var objToJson = result;
                              var response = [];
                              for (var key in result) {
                                  //wpdlog("Result "+result[key]);
                                  response.push(result[key]);
                              }
                              objToJson.response = response;
                              finalresponse = JSON.stringify(objToJson);                             
                              conn.release();    
                              res.end(finalresponse);                                                
                  })
                  .catch(err => {
                              //handle error
                              res.send({"Fetch" : "Fail" });
                              conn.release();  
                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db
 
}));


// #####################################  UPLOAD STANDARD ACTIVITIES  ############################################################
app.post('/tnt/uploadStandardActivity/:id', accessHandler((req, res) => { 

    //wpdlog(" STANDARD "+JSON.stringify(req.body));
    var phase = req.params.id;
    // wpdlog(" activities "+activities);


    //Maria db
    pool.getConnection()
    .then(conn=>{

        var activities = JSON.parse(JSON.stringify(req.body));
        for( var i=0; i< activities.length; i++){

            var activity_name = activities[i]["STANDARD_ACTIVITY_NAME"];
            var milestoneOrTask = activities[i]["MILESTONE_OR_TASK"];
            //wpdlog("activity "+i+ " "+ activity_name);       

            
            const query =  " insert into STANDARD_ACTIVITY (  "+
                                    "STANDARD_ACTIVITY_ID, "+                                
                                    "STANDARD_ACTIVITY_NAME, "+
                                    "MILESTONE_OR_TASK, "+
                                    "PHASE_NAME "+                                                                                           
                            " ) values ( "+
                                "null,"+                            
                                "'"+activity_name+"',"+
                                "'"+milestoneOrTask+"',"+
                                "'"+phase+"' "+                                                                                                            
                            ") "; 
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                    conn.query(" SELECT LAST_INSERT_ID() ")
                                    .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                                          
                                            })
                                            .catch(err => {
                                                        //handle error
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                            })                                              
                                              
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })

            }// end of for loop
            conn.release();    
            res.end(finalresponse); 
      }).catch(err => {
          //not connected
      });
    //Maria db 
}));


// #####################################  UPDATE STANDARD ACTIVITY  ############################################################
app.put('/tnt/updateStandardActivity/:id', accessHandler((req, res) => { 

    //wpdlog("standard activity id  "+req.params.id);

    //Maria db

    pool.getConnection()
    .then(conn=>{

                    const query = "update  STANDARD_ACTIVITY " + 
                    "set STANDARD_ACTIVITY_NAME ='" + req.body.STANDARD_ACTIVITY_NAME + "', " +
                        "MILESTONE_OR_TASK  ='" + req.body.MILESTONE_OR_TASK + "'  " +     
                    "where  "+
                        "STANDARD_ACTIVITY_ID ='" +req.params.id +"' " ; 
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });



    //Maria db


}));

// #####################################  CREATE STANDARD ACTIVITY  ############################################################
app.put('/tnt/createStandardActivity/:id', accessHandler((req, res) => { 

    //wpdlog("standard activity id  "+req.params.id);

    //Maria db

    pool.getConnection()
    .then(conn=>{
                      
                 const query =  " insert into STANDARD_ACTIVITY (  "+
                                        "STANDARD_ACTIVITY_ID, "+                                
                                        "STANDARD_ACTIVITY_NAME, "+
                                        "MILESTONE_OR_TASK, "+
                                        "PHASE_NAME "+                                                                                           
                                " ) values ( "+
                                        "null,"+                            
                                        "'"+req.body.STANDARD_ACTIVITY_NAME+"',"+
                                        "'"+req.body.MILESTONE_OR_TASK+"',"+
                                        "'"+req.body.PHASE+"' "+                                                                                                            
                                ") "; 


                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });
    //Maria db
}));


// ##################################### DELETE STANDARD ACTIVITY ############################################################
app.post('/tnt/deleteStandardActivity/', accessHandler((req, res) => { 

    
    //wpdlog(" ACTIVITIES "+req.body.activities);
    

    var paramValue = req.body.activities;
    var activityId = '';

    var activities = paramValue.split(",");


    //Maria db
    pool.getConnection()
    .then(conn=>{


        for( var i=0; i< activities.length; i++){

            activityId = activities[i];
       
                    const query =  " delete from  STANDARD_ACTIVITY  "+
                                   " where STANDARD_ACTIVITY_ID='"+activityId+"'";
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result1)=>{
                                            conn.query(" SELECT LAST_INSERT_ID() ")
                                                    .then((result)=>{                                    

                                                    var objToJson = result;
                                                    var response = [];
                                                    for (var key in result) {
                                                        //wpdlog("Result "+result[key]);
                                                        response.push(result[key]);
                                                    }
                                                    objToJson.response = response;
                                                    finalresponse = JSON.stringify(objToJson);                             
                                            
                                                    })  
                                                    .catch(err => {
                                                        //handle error
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                            })
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
            }  // end of for   
            
            conn.release();    
            res.end(finalresponse);
          
      }).catch(err => {
          //not connected
      });


    }));  


// #####################################  GET READINESS QUESTIONS LIST ############################################################
app.get('/tnt/readinessQuestions/:id', accessHandler((req, res) => { 

    //Maria db
    

    //wpdlog("Get Readiness Questions ...................");
    var parameterId = req.params.id;
    pool.getConnection()
    .then(conn=>{

                    const query =  ' select ' +
                        ' READINESS_QUESTION_ID , '+
                        ' COALESCE(READINESS_QUESTION_CATEGORY  ,"") as READINESS_QUESTION_CATEGORY  , '+
                        " 'N' as READINESS_QUESTION_ADOPTED , "+
                        ' COALESCE(READINESS_QUESTION ,"") as READINESS_QUESTION , '+
                        ' COALESCE(READINESS_QUESTION_ANSWER_FIELD_TYPE ,"") as READINESS_QUESTION_ANSWER_FIELD_TYPE , '+
                        ' COALESCE(READINESS_QUESTION_ANSWER_DATA_TYPE ,"") as READINESS_QUESTION_ANSWER_DATA_TYPE , '+            
                        ' COALESCE(READINESS_QUESTION_ANSWER_SET ,"") as READINESS_QUESTION_ANSWER_SET  '+
                    ' from '+
                        '  READINESS_QUESTION_GLOBAL  '+
                    " where READINESS_QUESTION_CATEGORY ='"+parameterId+"'"    ;
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{
                                            var objToJson = result;
                                            var response = [];
                                            for (var key in result) {
                                            ////wpdlog("Result "+result[key]);
                                            response.push(result[key]);
                                            }
                                            objToJson.response = response;
                                            finalresponse = JSON.stringify(objToJson);     
                                            //wpdlog("finalresponse     ......."+finalresponse);
                                            conn.release();    
                                            res.end(finalresponse);                                               
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          wpdlog(err);
          //not connected
      });

    
    //Maria db
 
}));


// #####################################  GET READINESS QUESTION Data ############################################################
app.get('/tnt/readinessQuestion/:id', accessHandler((req, res) => { 

    //Maria db
    

    //wpdlog("Get Readiness Questions Data");
    var parameterId = req.params.id;
    pool.getConnection()
    .then(conn=>{

                    const query =  ' select ' +
                        ' READINESS_QUESTION_ID , '+
                        ' COALESCE(READINESS_QUESTION_CATEGORY  ,"") as READINESS_QUESTION_CATEGORY  , '+
                        " 'N' as READINESS_QUESTION_ADOPTED , "+
                        ' COALESCE(READINESS_QUESTION ,"") as READINESS_QUESTION , '+
                        ' COALESCE(READINESS_QUESTION_ANSWER_FIELD_TYPE ,"") as READINESS_QUESTION_ANSWER_FIELD_TYPE , '+
                        ' COALESCE(READINESS_QUESTION_ANSWER_DATA_TYPE ,"") as READINESS_QUESTION_ANSWER_DATA_TYPE , '+            
                        ' COALESCE(READINESS_QUESTION_ANSWER_SET ,"") as READINESS_QUESTION_ANSWER_SET  '+
                    ' from '+
                        '  READINESS_QUESTION_GLOBAL  '+
                    " where READINESS_QUESTION_ID ='"+parameterId+"'"    ;
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{
                                            var objToJson = result;
                                            var response = [];
                                            for (var key in result) {
                                            //wpdlog("Result "+result[key]);
                                            response.push(result[key]);
                                            }
                                            objToJson.response = response;
                                            finalresponse = JSON.stringify(objToJson);     
                                            //wpdlog("finalresponse     ......."+finalresponse);
                                            conn.release();    
                                            res.end(finalresponse);                                               
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          wpdlog(err);
          //not connected
      });

    
    //Maria db
 
}));

// #####################################  GET READINESS QUESTION CUSTOM Data ############################################################
app.get('/tnt/readinessQuestionCustomData/:id', accessHandler((req, res) => { 

    //Maria db
    

    //wpdlog("Get Readiness Questions Custom Data");
    var parameterId = req.params.id;
    pool.getConnection()
    .then(conn=>{

                    const query =  ' select ' +
                        ' READINESS_QUESTION_CUSTOM_ID , '+
                        ' COALESCE(READINESS_QUESTION_CATEGORY  ,"") as READINESS_QUESTION_CATEGORY  , '+
                        " 'N' as READINESS_QUESTION_ADOPTED , "+
                        ' COALESCE(READINESS_QUESTION ,"") as READINESS_QUESTION , '+
                        ' COALESCE(READINESS_QUESTION_ANSWER_FIELD_TYPE ,"") as READINESS_QUESTION_ANSWER_FIELD_TYPE , '+
                        ' COALESCE(READINESS_QUESTION_ANSWER_DATA_TYPE ,"") as READINESS_QUESTION_ANSWER_DATA_TYPE , '+            
                        ' COALESCE(READINESS_QUESTION_ANSWER_SET ,"") as READINESS_QUESTION_ANSWER_SET  '+
                    ' from '+
                        '  READINESS_QUESTION_CUSTOM  '+
                    " where     READINESS_QUESTION_CUSTOM_ID ='"+parameterId+"'"    ;
              
              
                      wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{
                                            var objToJson = result;
                                            var response = [];
                                            for (var key in result) {
                                            //wpdlog("Result "+result[key]);
                                            response.push(result[key]);
                                            }
                                            objToJson.response = response;
                                            finalresponse = JSON.stringify(objToJson);     
                                            //wpdlog("finalresponse     ......."+finalresponse);
                                            conn.release();    
                                            res.end(finalresponse);                                               
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //wpdlog(err);
          //not connected
      });

    
    //Maria db
 
}));

// #####################################CREATE A NEW READINESS QUESTION ############################################################
app.post('/tnt/readinessQuestion/', accessHandler((req, res) => { 



    //Maria db

    pool.getConnection()
    .then(conn=>{

                    const query =  " insert into READINESS_QUESTION_GLOBAL(  "+
                                            "READINESS_QUESTION_ID, "+                                
                                            "READINESS_QUESTION_CATEGORY, "+
                                            "READINESS_QUESTION, "+
                                            "READINESS_QUESTION_ANSWER_FIELD_TYPE, "+
                                            "READINESS_QUESTION_ANSWER_DATA_TYPE, "+                                
                                            "READINESS_QUESTION_ANSWER_SET "+                                                                                        
                                    " ) values ( "+
                                        "null,"+                            
                                        "'"+req.body.READINESS_QUESTION_CATEGORY+"',"+                            
                                        "'"+req.body.READINESS_QUESTION+"',"+
                                        "'"+req.body.READINESS_QUESTION_ANSWER_FIELD_TYPE+"',"+                            
                                        "'"+req.body.READINESS_QUESTION_ANSWER_DATA_TYPE+"', "+  
                                        "'"+req.body.READINESS_QUESTION_ANSWER_SET+"'  "+                                                                        
                                    ") ";
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result1)=>{
                                    conn.query(" SELECT LAST_INSERT_ID() ")
                                    .then((result)=>{
                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);  
                                    })
                                    .catch(err => {
                                                        wpdlog(err);
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                    })                                                                                            
                                  })
                                  .catch(err => {
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db
  
}));


// #####################################UPDATE  READINESS QUESTION ############################################################
app.put('/tnt/readinessQuestionUpdate/', accessHandler((req, res) => { 



    //Maria db

    pool.getConnection()
    .then(conn=>{
              
                    const query = " update READINESS_QUESTION_GLOBAL "+
                                  " set "+                                  
                                            "READINESS_QUESTION_CATEGORY='"+req.body.READINESS_QUESTION_CATEGORY+"', "+
                                            "READINESS_QUESTION='"+req.body.READINESS_QUESTION+"', "+
                                            "READINESS_QUESTION_ANSWER_FIELD_TYPE='"+req.body.READINESS_QUESTION_ANSWER_FIELD_TYPE+"', "+
                                            "READINESS_QUESTION_ANSWER_DATA_TYPE='"+req.body.READINESS_QUESTION_ANSWER_DATA_TYPE+"', "+
                                            "READINESS_QUESTION_ANSWER_SET='"+req.body.READINESS_QUESTION_ANSWER_SET+"' "+
                                   "where READINESS_QUESTION_ID ='"+req.body.READINESS_QUESTION_ID+"'";

                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result1)=>{
                                    conn.query(" SELECT LAST_INSERT_ID() ")
                                    .then((result)=>{
                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);  
                                    })
                                    .catch(err => {
                                                        wpdlog(err);
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                    })                                                                                            
                                  })
                                  .catch(err => {
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db
  
}));

// #####################################UPDATE  READINESS QUESTION CUSTOM ############################################################
app.put('/tnt/readinessQuestionCustomUpdate/', accessHandler((req, res) => { 

    //Maria db

    pool.getConnection()
    .then(conn=>{
              
                    const query = " update READINESS_QUESTION_CUSTOM "+
                                  " set "+                                                                              
                                            "READINESS_QUESTION='"+req.body.READINESS_QUESTION+"', "+
                                            "READINESS_QUESTION_ANSWER_FIELD_TYPE='"+req.body.READINESS_QUESTION_ANSWER_FIELD_TYPE+"', "+
                                            "READINESS_QUESTION_ANSWER_DATA_TYPE='"+req.body.READINESS_QUESTION_ANSWER_DATA_TYPE+"', "+
                                            "READINESS_QUESTION_ANSWER_SET='"+req.body.READINESS_QUESTION_ANSWER_SET+"' "+
                                   "where READINESS_QUESTION_CUSTOM_ID ='"+req.body.READINESS_QUESTION_CUSTOM_ID+"'";

                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result1)=>{
                                    conn.query(" SELECT LAST_INSERT_ID() ")
                                    .then((result)=>{
                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);  
                                    })
                                    .catch(err => {
                                                        wpdlog(err);
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                    })                                                                                            
                                  })
                                  .catch(err => {
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db
  
}));

// Get Readiness Question Design List
app.get('/tnt/readinessQuestionDesignList/:id', accessHandler((req, res) => { 

    //wpdlog("Entered in Get Readiness Question Design List "+req.params.id);

    var test = req.params.id;

    //wpdlog("test tranid " +test.transitionId);

    var jsonData = JSON.parse(req.params.id);

    var transitionId= jsonData.transitionId;
    var parameterId = jsonData.parameterId;


    //Maria db
    pool.getConnection()
    .then(conn=>{

              //wpdlog("Readiness Question Design List Connected");

                  

                    const queryDesign =  ' select ' +
                        ' "C" as CUSTOM_OR_GLOBAL_QUESTION, '+
                        ' READINESS_QUESTION_CUSTOM_ID  as READINESS_QUESTION_CUSTOM_ID, '+
                        ' COALESCE(TRANSITION_ID   ,"") as TRANSITION_ID   , '+
                        ' COALESCE(READINESS_QUESTION_CATEGORY  ,"") as READINESS_QUESTION_CATEGORY  , '+
                        ' COALESCE(READINESS_QUESTION  ,"") as READINESS_QUESTION  , '+
                        ' COALESCE(READINESS_QUESTION_ADOPTED  ,"NA") as READINESS_QUESTION_ADOPTED  , '+
                        ' COALESCE(READINESS_QUESTION_SHORT_FORM  ,"") as READINESS_QUESTION_SHORT_FORM  , '+            
                        ' COALESCE(READINESS_QUESTION_DISPLAY_ORDER  ,"") as READINESS_QUESTION_DISPLAY_ORDER ,  '+
                        ' COALESCE(READINESS_QUESTION_ANSWER_FIELD_TYPE  ,"") as READINESS_QUESTION_ANSWER_FIELD_TYPE ,   '+
                        ' COALESCE(READINESS_QUESTION_ANSWER_DATA_TYPE  ,"") as READINESS_QUESTION_ANSWER_DATA_TYPE ,  '+
                        ' COALESCE(READINESS_QUESTION_ANSWER_SET  ,"") as READINESS_QUESTION_ANSWER_SET   '+                        

                    ' from '+
                        '  READINESS_QUESTION_CUSTOM  '+
                    " WHERE TRANSITION_ID ='"+transitionId+"'  "+
                    " and READINESS_QUESTION_CATEGORY ='"+parameterId+"'";
                        
              
              
                      //wpdlog("query "+queryDesign);

                      conn.query(queryDesign)
                                  .then((result1)=>{

                                    var objToJson = result1;
                                    var response = [];
                                    //var designFound = 'false';
                                    //wpdlog(" result1.length() = "+result1.length);



                                    
                    
                                    if (result1.length >0){

                                            for (var key in result1) {
                                                //wpdlog("Result 1..."+result1[key]);
                                                response.push(result1[key]);
                                                var designFound = 'true';
                                            }
                                            objToJson.response = response;
                                            finalresponse = JSON.stringify(objToJson);  
                    
                                            //wpdlog("Design response 1 ....");
                                            //finalresponse = response;
                                            res.end(finalresponse);    
                                            conn.release();    
                                    }else{
                                            //wpdlog("Design response 0 ....");
                                            const query1 =  ' select ' +
                                                                    ' "G" as CUSTOM_OR_GLOBAL_QUESTION, '+
                                                                    ' READINESS_QUESTION_ID as READINESS_QUESTION_ID , '+
                                                                    ' COALESCE(READINESS_QUESTION_CATEGORY  ,"") as READINESS_QUESTION_CATEGORY  , '+
                                                                    ' COALESCE(READINESS_QUESTION ,"") as READINESS_QUESTION , '+
                                                                    ' COALESCE(READINESS_QUESTION_ANSWER_FIELD_TYPE ,"") as READINESS_QUESTION_ANSWER_FIELD_TYPE , '+
                                                                    ' COALESCE(READINESS_QUESTION_ANSWER_DATA_TYPE ,"") as READINESS_QUESTION_ANSWER_DATA_TYPE , '+            
                                                                    ' COALESCE(READINESS_QUESTION_ANSWER_SET ,"") as READINESS_QUESTION_ANSWER_SET  '+
                                                            ' from '+
                                                                    '  READINESS_QUESTION_GLOBAL  '+
                                                                    " where READINESS_QUESTION_CATEGORY ='"+parameterId+"'";                                                                    

                                            conn.query(query1)
                                            .then((result)=>{
                                                    var objToJson = result;
                                                    var response = [];
                                                    for (var key in result) {
                                                    //wpdlog("Result "+result[key]);
                                                    response.push(result[key]);
                                                    }
                                                    objToJson.response = response;
                                                    finalresponse = JSON.stringify(objToJson);     
                                                    //wpdlog("finalresponse     ......."+finalresponse);
                                                    conn.release();    
                                                    res.end(finalresponse); 
                                            })
                                            .catch(err => {
                                                        //handle error
                                                        wpdlog(err);
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                            })
                                    }                                                     
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })          
      }).catch(err => {
          wpdlog("Not connected");
          wpdlog(err);
      });
    //Maria db      
}));

// Get Readiness Question List For Adoption
app.get('/tnt/readinessQuestionListForAdoption/:id', accessHandler((req, res) => { 

    wpdlog("Entered in Get Readiness Question List For Adoption "+req.params.id);

    var parameterId = req.params.id;

    wpdlog("test parameterId " +parameterId);

    //var jsonData = JSON.parse(req.params.id);
    //var transitionId= jsonData.transitionId;
    //var parameterId = jsonData.parameterId;

    pool.getConnection()
    .then(conn=>{

        const query =  ' select ' +
        ' "G" as CUSTOM_OR_GLOBAL_QUESTION, '+
        ' READINESS_QUESTION_ID as READINESS_QUESTION_ID , '+
        ' COALESCE(READINESS_QUESTION_CATEGORY  ,"") as READINESS_QUESTION_CATEGORY  , '+
        ' "N" as READINESS_QUESTION_ADOPTED  , '+
        ' COALESCE(READINESS_QUESTION ,"") as READINESS_QUESTION , '+
        ' COALESCE(READINESS_QUESTION_ANSWER_FIELD_TYPE ,"") as READINESS_QUESTION_ANSWER_FIELD_TYPE , '+
        ' COALESCE(READINESS_QUESTION_ANSWER_DATA_TYPE ,"") as READINESS_QUESTION_ANSWER_DATA_TYPE , '+            
        ' COALESCE(READINESS_QUESTION_ANSWER_SET ,"") as READINESS_QUESTION_ANSWER_SET  '+
' from '+
        '  READINESS_QUESTION_GLOBAL  '+
        " where READINESS_QUESTION_CATEGORY ='"+parameterId+"'";                                                                    


              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{
                                            var objToJson = result;
                                            var response = [];
                                            for (var key in result) {
                                            //wpdlog("Result "+result[key]);
                                            response.push(result[key]);
                                            }
                                            objToJson.response = response;
                                            finalresponse = JSON.stringify(objToJson);     
                                            wpdlog("finalresponse     ......."+finalresponse);
                                            conn.release();    
                                            res.end(finalresponse);                                               
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          wpdlog(err);
          //not connected
      });

    //Maria db      
}));

// #####################################  GET READINESS QUESTIONS TRACKING HEADER LIST ############################################################
app.get('/tnt/readinessQuestionTrackingHeaderList/:id', accessHandler((req, res) => { 

    //Maria db
    
    var jsonData = JSON.parse(req.params.id);

    var transitionId= jsonData.transitionId;
    var parameterId = jsonData.parameterId;


    pool.getConnection()
    .then(conn=>{

                    const query =  ' select ' +
                    ' "C" as CUSTOM_OR_GLOBAL_QUESTION, '+
                    ' READINESS_QUESTION_CUSTOM_ID  as READINESS_QUESTION_CUSTOM_ID, '+
                    ' COALESCE(TRANSITION_ID   ,"") as TRANSITION_ID   , '+
                    ' COALESCE(READINESS_QUESTION_CATEGORY  ,"") as READINESS_QUESTION_CATEGORY  , '+
                    ' COALESCE(READINESS_QUESTION  ,"") as READINESS_QUESTION  , '+
                    ' COALESCE(READINESS_QUESTION_SHORT_FORM  ,"") as READINESS_QUESTION_SHORT_FORM  , '+            
                    ' COALESCE(READINESS_QUESTION_DISPLAY_ORDER  ,"") as READINESS_QUESTION_DISPLAY_ORDER ,  '+
                    ' COALESCE(READINESS_QUESTION_ANSWER_FIELD_TYPE  ,"") as READINESS_QUESTION_ANSWER_FIELD_TYPE ,   '+
                    ' COALESCE(READINESS_QUESTION_ANSWER_DATA_TYPE  ,"") as READINESS_QUESTION_ANSWER_DATA_TYPE ,  '+
                    ' COALESCE(READINESS_QUESTION_ANSWER_SET  ,"") as READINESS_QUESTION_ANSWER_SET   '+                        

                ' from '+
                    '  READINESS_QUESTION_CUSTOM  '+
                " WHERE TRANSITION_ID ='"+transitionId+"'  "+
                " and READINESS_QUESTION_CATEGORY ='"+parameterId+"' "+
                " and READINESS_QUESTION_ADOPTED in ('Y', 'NA') ";
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{
                                            var objToJson = result;
                                            var response = [];
                                            for (var key in result) {
                                            //wpdlog("Result "+result[key]);
                                            response.push(result[key]);
                                            }
                                            objToJson.response = response;
                                            finalresponse = JSON.stringify(objToJson);     
                                            wpdlog("finalresponse     ......."+finalresponse);
                                            conn.release();    
                                            res.end(finalresponse);                                               
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          wpdlog(err);
          //not connected
      });

    
    //Maria db
 
}));


// #####################################  GET READINESS QUESTIONS TRACKING  LIST ############################################################
app.get('/tnt/readinessQuestionTrackingList/:id', accessHandler((req, res) => { 

    //Maria db

    wpdlog("Readiness question tracking list called...");
    
    var jsonData = JSON.parse(req.params.id);

    var transitionId= jsonData.transitionId;
    var resourceTypeMeasured = jsonData.resourceTypeMeasured;
    var parameterId = jsonData.parameterId;
console.log(resourceTypeMeasured)
    var appIds ='';

    var resourceInfoQuery ="";

    pool.getConnection()
    .then(conn=>{


                    if (resourceTypeMeasured === 'epic'){

                        resourceInfoQuery = '(select IntegrationID as TRANSITION_ID , epicUNID as RESOURCE_ID, epicName as RESOURCE_NAME '+
                                                    "from  epics "+
                                                        " where IntegrationID='"+transitionId+"')  as ri ";

                    }         


                    if (resourceTypeMeasured === 'sprint'){

                        resourceInfoQuery = '(select ep.IntegrationID as TRANSITION_ID , sp.sprintUNID as RESOURCE_ID, CONCAT(ep.epicName,CONCAT("-", sp.sprintName)) as RESOURCE_NAME '+
                                                    "from  epics as ep, sprint as sp "+
                                                        " where ep.IntegrationID='"+transitionId+"' "+
                                                        " and sp.epicUNID = ep.epicUNID  )  as ri ";

                    }    
                    
                    if (resourceTypeMeasured === 'ST-sprint'){

                        resourceInfoQuery = '(select ep.IntegrationID as TRANSITION_ID , sp.sprintUNID as RESOURCE_ID, CONCAT(ep.epicName,CONCAT("-", sp.sprintName)) as RESOURCE_NAME '+
                                                    "from  epics as ep, sprint as sp "+
                                                        " where ep.IntegrationID='"+transitionId+"' "+
                                                        " and sp.epicUNID = ep.epicUNID and sp.scopelevel='ST' )  as ri ";

                    }  
                    if (resourceTypeMeasured === 'AT-sprint'){

                        resourceInfoQuery = '(select ep.IntegrationID as TRANSITION_ID , sp.sprintUNID as RESOURCE_ID, CONCAT(ep.epicName,CONCAT("-", sp.sprintName)) as RESOURCE_NAME '+
                                                    "from  epics as ep, sprint as sp "+
                                                        " where ep.IntegrationID='"+transitionId+"' "+
                                                        " and sp.epicUNID = ep.epicUNID and sp.scopelevel='AT' )  as ri ";

                    }
                    if (resourceTypeMeasured === 'Others-sprint'){

                        resourceInfoQuery =                                                    
                        // '(select ep.IntegrationID as TRANSITION_ID , sc.Scope_UNID as RESOURCE_ID, CONCAT(ep.epicName,CONCAT("-", sp.sprintName,"-",sc.Scope_BacklogActivity)) as RESOURCE_NAME '+
                        //                                                     "from  epics as ep, sprint as sp, sprintscope as sc "+
                        //                                                         " where ep.IntegrationID='"+transitionId+"' "+
                        //                     " and sp.epicUNID = ep.epicUNID and sp.sprintUNID = sc.sprintUNID and sp.scopelevel='Others' )  as ri ";
                        
                        '(select ep.IntegrationID as TRANSITION_ID , sp.sprintUNID as RESOURCE_ID, CONCAT(ep.epicName,CONCAT("-", sp.sprintName)) as RESOURCE_NAME '+
                                                    "from  epics as ep, sprint as sp "+
                                                        " where ep.IntegrationID='"+transitionId+"' "+
                                                        " and sp.epicUNID = ep.epicUNID and sp.scopelevel='Others' )  as ri ";
                                                        console.log("resourceInfoQuery   " +resourceInfoQuery)

                    }

                    if (resourceTypeMeasured === 'trainee'){

                        resourceInfoQuery = '(select Trainee_IntegrationID as TRANSITION_ID , Trainee_SNO as RESOURCE_ID, Trainee_Name as RESOURCE_NAME '+
                                                    "from  traineeinfo "+
                                                        " where Trainee_IntegrationID='"+transitionId+"')  as ri ";

                    } 

                    if (resourceTypeMeasured === 'ST-scope'){
                        appIds = jsonData.appIds;
                        resourceInfoQuery = '(select distinct IntegrationID as TRANSITION_ID ,  RESOURCE_ID,RESOURCE_NAME '+
                                                    "from ( SELECT  IntegrationID,MasterSTInfoid as RESOURCE_ID,Others as RESOURCE_NAME FROM masterstinfo where IntegrationID = '"+transitionId+"' and STScope = 'Others' "+
                                                    " and MasterSTInfoid in ("+appIds+") "+
                                                    " union "+
                                                    "SELECT IntegrationID,MasterSTInfoid as RESOURCE_ID,STScope as RESOURCE_NAME FROM masterstinfo where IntegrationID = '"+transitionId+"' and STScope <> 'Others' "+
                                                    " and MasterSTInfoid in ("+appIds+") "+
                                                    ")  as st )  as ri  ";
                    } 
       
                    if (resourceTypeMeasured === 'Process' || resourceTypeMeasured === 'Metrics' || resourceTypeMeasured === 'Reports' ||  resourceTypeMeasured === 'Governance'  ||  resourceTypeMeasured === 'Tools'  ){
                        appIds = jsonData.appIds;
                        ResourceName =  " CONCAT(CONCAT('Category : ', STScopeLevel),CONCAT(' - ',CONCAT('ST Scope : ', STScope) ),CONCAT(' - ',CONCAT('ST Details : ', STDetailedScope) ),CONCAT(' - ', CONCAT('ST Activity : ', STScopeActivity))) as  RESOURCE_NAME "
                        ResourceOtherName =  " CONCAT(CONCAT('Category : ', STScopeLevel),CONCAT(' - ',CONCAT('ST Scope : ', Others) ),CONCAT(' - ',CONCAT('ST Details : ', STDetailedScope) ),CONCAT(' - ', CONCAT('ST Activity : ', STScopeActivity))) as  RESOURCE_NAME "
                       
                        resourceInfoQuery = '(select distinct IntegrationID as TRANSITION_ID ,  RESOURCE_ID,RESOURCE_NAME '+
                                                    "from ( SELECT  IntegrationID,MasterSTInfoid as RESOURCE_ID,"+ ResourceOtherName+ 
                                                    " FROM masterstinfo where IntegrationID = '"+transitionId+"' and STScope = 'Others' "+
                                                    " and MasterSTInfoid in ("+appIds+") "+
                                                    " and STScopeLevel='"+ resourceTypeMeasured+"' "+
                                                    " union "+
                                                    "SELECT IntegrationID,MasterSTInfoid as RESOURCE_ID,"+ResourceName+
                                                    " FROM masterstinfo where IntegrationID = '"+transitionId+"' and STScope <> 'Others' "+
                                                    " and MasterSTInfoid in ("+appIds+") "+
                                                    " and STScopeLevel='"+ resourceTypeMeasured+"' "+
                                                    ")  as st )  as ri  ";
                    }  


                    if (resourceTypeMeasured === 'application'){

                        appIds = jsonData.appIds;

                        resourceInfoQuery = '(select distinct IntegrationID as TRANSITION_ID ,  AppUNID as RESOURCE_ID, AppName as RESOURCE_NAME '+
                                                    "from  application_information "+
                                                        " where IntegrationID='"+transitionId+"' and AppUNID in ("+appIds+"))  as ri ";

                    }   
                    
                    if (resourceTypeMeasured === 'transition'){

                            resourceInfoQuery = '(select IntegrationID as TRANSITION_ID , IntegrationID as RESOURCE_ID, "Transition" as RESOURCE_NAME '+
                                                                            "from  transitionprofile "+
                                                                                " where IntegrationID='"+transitionId+"')  as ri ";
                    }                                                                                
                    

                    if (resourceTypeMeasured === 'sprintbacklog'){

                        resourceInfoQuery = '(select IntegrationID as TRANSITION_ID , "sprintbacklog" as RESOURCE_ID, "Sprint Backlog" as RESOURCE_NAME '+
                                                                        "from  transitionprofile "+
                                                                            " where IntegrationID='"+transitionId+"')  as ri ";
                    }  
                    
                    if (resourceTypeMeasured === 'servicebacklog'){

                        resourceInfoQuery = '(select IntegrationID as TRANSITION_ID , "servicebacklog" as RESOURCE_ID, "Service Backlog" as RESOURCE_NAME '+
                                                                        "from  transitionprofile "+
                                                                            " where IntegrationID='"+transitionId+"')  as ri ";
                    }   
                    
                    
                    if (resourceTypeMeasured === 'closure'){

                        resourceInfoQuery = '(select IntegrationID as TRANSITION_ID , "closure" as RESOURCE_ID, "Closure" as RESOURCE_NAME '+
                                                                        "from  transitionprofile "+
                                                                            " where IntegrationID='"+transitionId+"')  as ri ";
                    }                    
                    console.log(resourceInfoQuery)
                    // console.log("---------------")
                    // wpdlog("resourceInfoQuery "+resourceInfoQuery);
                    const query = 
                    'select '+  
                                ' COALESCE(rqt.READINESS_QUESTION_TRACKER_ID,"") as READINESS_QUESTION_TRACKER_ID,'+                               
                                ' COALESCE(ri.RESOURCE_NAME, "") as RESOURCE_NAME, '+
                                ' COALESCE(ri.TRANSITION_ID,"") as TRANSITION_ID, '+                                
                                ' COALESCE(rqt.PARAMETER_CUSTOM_ID,"") as PARAMETER_CUSTOM_ID, '+
                                ' COALESCE(ri.RESOURCE_ID,"") as RESOURCE_ID, '+
                                ' COALESCE(rqt.MULTIPLE_LOGICAL_COLS,"") as MULTIPLE_LOGICAL_COLS, '+  
                                ' COALESCE(rqt.RAG,"") as RAG '+       
                        'from '+
                                resourceInfoQuery+
                                 'LEFT JOIN READINESS_QUESTION_TRACKER  as rqt '+
                                    'on ri.TRANSITION_ID = rqt.TRANSITION_ID '+
                                    'and ri.RESOURCE_ID = rqt.READINESS_QUESTION_MEASURED_AGAINST_PARAMETER_VALUE '+
                                    "and rqt.TRANSITION_ID = '"+transitionId+"'  "+
                                    "and rqt.PARAMETER_CUSTOM_ID = '"+parameterId+"' "+                                                                  
                                " group by ri.RESOURCE_ID "+
                                " ORDER BY RESOURCE_NAME ASC ";
                                
              
                      wpdlog("query for APP ID "+query);

                      conn.query(query)
                                  .then((result)=>{
                                                    var objToJson = result;
                                                    var response = [];
                                                    for (var key in result) {
                                                    //wpdlog("Result "+result[key]);
                                                    response.push(result[key]);
                                            }
                                            objToJson.response = response;
                                            finalresponse = JSON.stringify(objToJson);     
                                            //wpdlog("finalresponse     ......."+finalresponse);
                                            conn.release();    
                                            res.end(finalresponse);                                               
                                  })
                                  .catch(err => {
                                              //handle error
                                            //   wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          wpdlog(err);
          //not connected
      });

    
    //Maria db
 
}));








// #####################################CREATE/UPDATE READINESS QUESTION TRACKER ############################################################
app.post('/tnt/readinessQuestionTrackingAddEdit/:id', accessHandler((req, res) => { 

        
    wpdlog(" trackerList "+req.body.PARAMETER);
    
    //var transitionId = req.params.id;
    var trackers = req.body.PARAMETER;
    //var criteria = JSON.parse(paramValue);

    var query = "";
  
    //Maria db
    pool.getConnection()
    .then(conn=>{


        for( var i=0; i< trackers.length; i++){


            if (trackers[i].READINESS_QUESTION_TRACKER_ID ==''){
                //insert
                query = " insert into READINESS_QUESTION_TRACKER (  "+
                                    " READINESS_QUESTION_TRACKER_ID , "+   
                                    " PARAMETER_CUSTOM_ID , "+                             
                                    " TRANSITION_ID , "+
                                    " READINESS_QUESTION_MEASURED_AGAINST_PARAMETER_VALUE , "+
                                    " MULTIPLE_LOGICAL_COLS, "+  
                                    " RAG "+                                                                                                                                                                              
                            " ) values ( "+
                                    "null,"+    
                                    trackers[i].PARAMETER_CUSTOM_ID+","+                                                    
                                    "'"+trackers[i].TRANSITION_ID+"',"+                                                                
                                    "'"+trackers[i].READINESS_QUESTION_MEASURED_AGAINST_PARAMETER_VALUE+"',"+                            
                                    "'"+JSON.stringify(trackers[i].MULTIPLE_LOGICAL_COLS) +"',  "+      
                                    "'"+trackers[i].RAG+"' "+                                                                                                                                    
                            " ) ";
            }
            else{
                //update
                query = "update READINESS_QUESTION_TRACKER  " + 
                            "set    MULTIPLE_LOGICAL_COLS   ='" + JSON.stringify(trackers[i].MULTIPLE_LOGICAL_COLS ) + "',  " +                                                               
                            "       RAG   ='" + trackers[i].RAG + "'  " +                                                               
                            "where  "+
                                    "READINESS_QUESTION_TRACKER_ID  ='" +trackers[i].READINESS_QUESTION_TRACKER_ID +"' " ;
            }

               
              
            wpdlog("query for inserting/updating to  READINESS_QUESTION_TRACKER table "+query);

                      conn.query(query)
                                  .then((result1)=>{
                                            logInsertTable("READINESS_QUESTION_TRACKER", query, "" );
                                            conn.query(" SELECT LAST_INSERT_ID() ")
                                                    .then((result)=>{                                    

                                                    var objToJson = result;
                                                    var response = [];
                                                    for (var key in result) {
                                                        //wpdlog("Result "+result[key]);
                                                        response.push(result[key]);
                                                    }
                                                    objToJson.response = response;
                                                    finalresponse = JSON.stringify(objToJson);                             
                                            
                                                    })  
                                                    .catch(err => {
                                                        //handle error
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                            })
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
        }  // end of for   
            
        conn.release();    
        res.end(finalresponse);
          
    }).catch(err => {
          //not connected
    });

}));


// #####################################  DELETE PARAMETER ADMIN  ############################################################
app.delete('/tnt/parameterDelete/:id', accessHandler((req, res) => { 

    //Maria db
    pool.getConnection()
    .then(conn=>{

                    const query = "delete from  PARAMETER_GLOBAL " + 
                                  "where  "+
                                  "PARAMETER_GLOBAL_ID ='" +req.params.id +"' " ; 
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });



    //Maria db


}));


// #####################################  DELETE PARAMETER CUSTOM  ############################################################
app.delete('/tnt/parameterDeleteCustom/:id', accessHandler((req, res) => { 

    //Maria db
    pool.getConnection()
    .then(conn=>{

                    const query = "delete from  PARAMETER_CUSTOM " + 
                                  "where  "+
                                  "PARAMETER_CUSTOM_ID ='" +req.params.id +"' " ; 
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });



    //Maria db


}));


// #####################################  DELETE READINESS QUESTION ADMIN  ############################################################
app.delete('/tnt/deleteReadinessQuestionAdmin/:id', accessHandler((req, res) => { 



    //Maria db

    pool.getConnection()
    .then(conn=>{

                    const query = "delete from  READINESS_QUESTION_GLOBAL " + 
                                  "where  "+
                                  "READINESS_QUESTION_ID ='" +req.params.id +"' " ; 
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });



    //Maria db


}));



// #####################################DELETE READINESS QUESTION FROM TRACKER ############################################################
app.put('/tnt/deleteReadinessQuestion/', accessHandler((req, res) => { 

    
    var readinessQuestionId = req.body.readinessQuestionId;
    var parameterCustomId = req.body.parameterCustomId;

    wpdlog("readinessQuestionId     ......."+readinessQuestionId);
    wpdlog("parameterCustomId     ......."+parameterCustomId);

    //Maria db
    pool.getConnection()
    .then(conn=>{

        var query = "select READINESS_QUESTION_TRACKER_ID, MULTIPLE_LOGICAL_COLS "+
                    " from READINESS_QUESTION_TRACKER "+
                       " where PARAMETER_CUSTOM_ID='"+parameterCustomId+"'";

            wpdlog(query);

                    conn.query(query)
                    .then((result)=>{
                              var objToJson = result;
                              var response = [];
                              for (var key in result) {
                                    //wpdlog("Result in delete readiness question id "+result[key].MULTIPLE_LOGICAL_COLS);
                                    wpdlog("Result in delete readiness question id "+result[key].MULTIPLE_LOGICAL_COLS);

                                    var resultCols =[];

                                    if (result[key].MULTIPLE_LOGICAL_COLS !=undefined){

                                           var cols=JSON.parse(result[key].MULTIPLE_LOGICAL_COLS);
                                           for( var i=0; i< cols.length; i++){
                                               wpdlog("cols[i].Q_ID"+cols[i].Q_ID);
                                               if (cols[i].Q_ID != readinessQuestionId){
                                                    resultCols.push(cols[i]);
                                               }
                                           }    
                                           
                                           if (resultCols.length>0){
                                               //make the update statement 
                                             
                                               var updateQuery = "update READINESS_QUESTION_TRACKER  " + 
                                                                 "set MULTIPLE_LOGICAL_COLS   ='" + JSON.stringify(resultCols ) + "'  " +                                                                                                                                                                        
                                                                 "where READINESS_QUESTION_TRACKER_ID  ='" +result[key].READINESS_QUESTION_TRACKER_ID +"' " ;

                                                wpdlog("Multiple update query "+updateQuery);

                                                conn.query(updateQuery)
                                                        .then((result1)=>{      
                                                            
                                                        logInsertTable("READINESS_QUESTION_TRACKER", updateQuery, "");    
                                                        wpdlog("After delete ");
                                                        var objToJson = result1;
                                                        var response = [];
                                                        for (var key in result1) {
                                                            //wpdlog("Result "+result1[key]);
                                                            response.push(result1[key]);
                                                        }
                                                        objToJson.response = response;
                                                        finalresponse = JSON.stringify(objToJson);                             
                                                
                                                        })  
                                                        .catch(err => {
                                                            //handle error
                                                            res.send({"Fetch" : "Fail" });
                                                            conn.release();  
                                                })
                   
                                           }
                                    }// undefined


                                    response.push(result[key]);
                              }//end of for loop
                              // Now delete the readiness question
                              var deleteQuery = "delete from READINESS_QUESTION_CUSTOM "+
                                                "where READINESS_QUESTION_CUSTOM_ID='"+readinessQuestionId+"'";

                                conn.query(deleteQuery)
                                        .then((result2)=>{    
                                            logUpdateTable("READINESS_QUESTION_CUSTOM",readinessQuestionId,deleteQuery,"" );                            
                                            wpdlog("After delete question");                                                         
                                        })  
                                        .catch(err => {
                                            //handle error
                                            res.send({"Fetch" : "Fail" });
                                            conn.release();  
                                })

                              objToJson.response = response;
                              finalresponse = JSON.stringify(objToJson);     
                              //wpdlog("finalresponse     ......."+finalresponse);
                              conn.release();    
                              res.end(finalresponse);                                               
                    })
                    .catch(err => {
                                //handle error
                                wpdlog(err);
                                res.send({"Fetch" : "Fail" });
                                conn.release();  
                    })




          
    }).catch(err => {
          //not connected
    });

}));

// #####################################CHECK IF READINESS QUESTION CAPTURED RESPONSES ############################################################
app.post('/tnt/checkReadinessQuestionData/', accessHandler((req, res) => { 

    
    var readinessQuestionId = req.body.readinessQuestionId;
    var parameterCustomId = req.body.parameterCustomId;

    wpdlog("readinessQuestionId     ......."+readinessQuestionId);
    wpdlog("parameterCustomId     ......."+parameterCustomId);


    var response = [];
    var objToJson = [];


    //Maria db
    pool.getConnection()
    .then(conn=>{

        var query = "select READINESS_QUESTION_TRACKER_ID, MULTIPLE_LOGICAL_COLS "+
                    " from READINESS_QUESTION_TRACKER "+
                       " where PARAMETER_CUSTOM_ID='"+parameterCustomId+"'";

            wpdlog(query);

                    conn.query(query)
                    .then((result)=>{
                              
                             //objToJson
                              for (var key in result) {
                                    //wpdlog("Result in delete readiness question id "+result[key].MULTIPLE_LOGICAL_COLS);
                                    
                                    var resultCols =[];

                                    if (result[key].MULTIPLE_LOGICAL_COLS !=undefined){

                                           var cols=JSON.parse(result[key].MULTIPLE_LOGICAL_COLS);
                                           for( var i=0; i< cols.length; i++){
                                               wpdlog("cols[i].Q_ID"+cols[i].Q_ID);
                                               if (cols[i].Q_ID == readinessQuestionId && cols[i].ANSWER !=""){
                                                    wpdlog("Result in check readiness question data "+cols[i].ANSWER);
                                                    resultCols.push(cols[i]);
                                                    objToJson=result;
                                               }
                                           }    
                                           
                                           if (resultCols.length>0){                                               
                                               response.push(true);                                                                      
                                           }
                                    } // undefined
                                    
                              }//end of for loop
                              // Now delete the readiness question
                             
                              objToJson.response = response;
                              finalresponse = JSON.stringify(objToJson); 
                              conn.release();
                              res.end(finalresponse);                                                    
                    })
                    .catch(err => {
                                //handle error
                                wpdlog(err);
                                res.send({"Fetch" : "Fail" });
                                conn.release();  
                    })

          
    }).catch(err => {
          //not connected
    });

}));


// #####################################CREATE READINESS QUESTION CUSTOM ############################################################
app.post('/tnt/readinessQuestionCustom/:id', accessHandler((req, res) => { 

        
        wpdlog(" globalCriteriaList "+req.body.globalCriteriaList);
        
        var transitionId = req.params.id;
        var criteria = req.body.globalCriteriaList;
        //var criteria = JSON.parse(paramValue);
    
      
        //Maria db
        pool.getConnection()
        .then(conn=>{
    
    
            for( var i=0; i< criteria.length; i++){
    
                        var readinessQuestionCategory = criteria[i].READINESS_QUESTION_CATEGORY;
                        var readinessQuestion = criteria[i].READINESS_QUESTION;
                        var adopted = 'NA';
                        var fieldType = criteria[i].READINESS_QUESTION_ANSWER_FIELD_TYPE;
                        var dataType = criteria[i].READINESS_QUESTION_ANSWER_DATA_TYPE;
                        var answerSet = criteria[i].READINESS_QUESTION_ANSWER_SET;
                        var shortForm = criteria[i].READINESS_QUESTION_SHORT_FORM;
                        //displayOrder = criteria[i].READINESS_QUESTION_DISPLAY_ORDER;
                        var displayOrder = 1;
           
                        const query =  " insert into READINESS_QUESTION_CUSTOM(  "+
                                                "READINESS_QUESTION_CUSTOM_ID, "+                                
                                                "TRANSITION_ID, "+
                                                "READINESS_QUESTION, "+
                                                "READINESS_QUESTION_CATEGORY,"+
                                                "READINESS_QUESTION_ADOPTED,"+
                                                "READINESS_QUESTION_ANSWER_FIELD_TYPE, "+    
                                                "READINESS_QUESTION_ANSWER_DATA_TYPE, "+    
                                                "READINESS_QUESTION_ANSWER_SET, "+    
                                                "READINESS_QUESTION_SHORT_FORM, "+   
                                                "READINESS_QUESTION_DISPLAY_ORDER "+                                                                                        
                                        " ) values ( "+
                                            "null,"+                            
                                            "'"+transitionId+"',"+
                                            "'"+readinessQuestion+"', "+  
                                            "'"+readinessQuestionCategory+"', "+
                                            "'"+adopted+"', "+  
                                            "'"+fieldType+"', "+       
                                            "'"+dataType+"', "+  
                                            "'"+answerSet+"', "+  
                                            "'"+shortForm+"', "+  
                                            ""+displayOrder+" "+                                                                                                       
                                        ") ";
                  
                  
                          wpdlog("query for inserting to  READINESS_QUESTION_CUSTOM table "+query);
    
                          conn.query(query)
                                      .then((result1)=>{

                                        logInsertTable("READINESS_QUESTION_CUSTOM",query,"" );
                                                conn.query(" SELECT LAST_INSERT_ID() ")
                                                        .then((result)=>{                                    
    
                                                        var objToJson = result;
                                                        var response = [];
                                                        for (var key in result) {
                                                            //wpdlog("Result "+result[key]);
                                                            response.push(result[key]);
                                                        }
                                                        objToJson.response = response;
                                                        finalresponse = JSON.stringify(objToJson);                             
                                                
                                                        })  
                                                        .catch(err => {
                                                            //handle error
                                                            res.send({"Fetch" : "Fail" });
                                                            conn.release();  
                                                })
                                      })
                                      .catch(err => {
                                                  //handle error
                                                  res.send({"Fetch" : "Fail" });
                                                  conn.release();  
                                      })
            }  // end of for   
                
            conn.release();    
            res.end(finalresponse);
              
        }).catch(err => {
              //not connected
        });
  
}));


// #####################################ADOPT READINESS QUESTION CUSTOM ############################################################
app.post('/tnt/adoptReadinessQuestionCustom/:id', accessHandler((req, res) => { 

        
    wpdlog(" globalCriteriaList "+req.body.globalCriteriaList);
    
    var transitionId = req.params.id;
    var criteria = req.body.globalCriteriaList;
    var parameterId = req.body.parameterId;
    //var criteria = JSON.parse(paramValue);
    var query = "";
    var tableName = "";
    var primaryKey = "";
  
    //Maria db
    pool.getConnection()
    .then(conn=>{


        for( var i=0; i< criteria.length; i++){

                    readinessQuestionCategory = criteria[i].READINESS_QUESTION_CATEGORY;
                    readinessQuestion = criteria[i].READINESS_QUESTION;
                    adopted = criteria[i].READINESS_QUESTION_ADOPTED;
                    wpdlog(" Readiness question adopted "+adopted);
                    fieldType = criteria[i].READINESS_QUESTION_ANSWER_FIELD_TYPE;
                    dataType = criteria[i].READINESS_QUESTION_ANSWER_DATA_TYPE;
                    answerSet = criteria[i].READINESS_QUESTION_ANSWER_SET;
                    shortForm = criteria[i].READINESS_QUESTION_SHORT_FORM;
                    //displayOrder = criteria[i].READINESS_QUESTION_DISPLAY_ORDER;
                    displayOrder = 1;

                    //wpdlog("criteria[i].CUSTOM_OR_GLOBAL_QUESTION "+criteria[i].CUSTOM_OR_GLOBAL_QUESTION);

                    if (criteria[i].CUSTOM_OR_GLOBAL_QUESTION ==='G'){
       
                        query =  " insert into READINESS_QUESTION_CUSTOM(  "+
                                            "READINESS_QUESTION_CUSTOM_ID, "+                                
                                            "TRANSITION_ID, "+
                                            "READINESS_QUESTION, "+
                                            "READINESS_QUESTION_CATEGORY,"+
                                            "READINESS_QUESTION_ADOPTED,"+
                                            "READINESS_QUESTION_ANSWER_FIELD_TYPE, "+    
                                            "READINESS_QUESTION_ANSWER_DATA_TYPE, "+    
                                            "READINESS_QUESTION_ANSWER_SET, "+    
                                            "READINESS_QUESTION_SHORT_FORM, "+   
                                            "READINESS_QUESTION_DISPLAY_ORDER "+                                                                                        
                                    " ) values ( "+
                                        "null,"+                            
                                        "'"+transitionId+"',"+
                                        "'"+readinessQuestion+"', "+  
                                        "'"+readinessQuestionCategory+"', "+
                                        "'"+adopted+"', "+  
                                        "'"+fieldType+"', "+       
                                        "'"+dataType+"', "+  
                                        "'"+answerSet+"', "+  
                                        "'"+shortForm+"', "+  
                                        ""+displayOrder+" "+                                                                                                       
                                    ") ";
              
                        //tableName = "READINESS_QUESTION_CUSTOM";        
              
                      wpdlog("query for inserting to  READINESS_QUESTION_CUSTOM table "+query);
                      logInsertTable("READINESS_QUESTION_CUSTOM",query,"" );
                     }else{
                            query = " update  READINESS_QUESTION_CUSTOM "+
                                          " set READINESS_QUESTION_ADOPTED ='"+adopted+"' "+
                                          " where READINESS_QUESTION_CUSTOM_ID ='"+criteria[i].READINESS_QUESTION_CUSTOM_ID+"'";

                            //tableName = "READINESS_QUESTION_CUSTOM" ;
                            primaryKey = criteria[i].READINESS_QUESTION_CUSTOM_ID;   
                            logUpdateTable("READINESS_QUESTION_CUSTOM",query,primaryKey,"" );          
                     } 

                      conn.query(query)
                                  .then((result1)=>{


                                           /*
                                           if (criteria[i].CUSTOM_OR_GLOBAL_QUESTION ==='G'){
                                                 logInsertTable("READINESS_QUESTION_CUSTOM",query,"" );
                                           }else{
                                                 logUpdateTable("READINESS_QUESTION_CUSTOM",query,primaryKey,"" );
                                           }    
                                           */
                                            
                                            conn.query(" SELECT LAST_INSERT_ID() ")
                                                    .then((result)=>{                                    

                                                    var objToJson = result;
                                                    var response = [];
                                                    for (var key in result) {
                                                        //wpdlog("Result "+result[key]);
                                                        response.push(result[key]);
                                                    }
                                                    objToJson.response = response;
                                                    finalresponse = JSON.stringify(objToJson);                             
                                            
                                                    })  
                                                    .catch(err => {
                                                        //handle error
                                                        wpdlog(err);
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                            })
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
        }  // end of for  
        
        
                    query =     " update PARAMETER_CUSTOM  "+
                                " set ADOPTION_COMPLETED='"+'Y'+"' "+
                                " where PARAMETER_CUSTOM_ID='"+parameterId+"'";
                                wpdlog("query for updating to  PARAMETER_CUSTOM table "+query);


                    conn.query(query)
                    .then((result)=>{

                              logUpdateTable("PARAMETER_CUSTOM",parameterId, query, "")
                              conn.query(" SELECT LAST_INSERT_ID() ")
                                      .then((result)=>{                                    

                                      var objToJson = result;
                                      var response = [];
                                      for (var key in result) {
                                          //wpdlog("Result "+result[key]);
                                          response.push(result[key]);
                                      }
                                      objToJson.response = response;
                                      finalresponse = JSON.stringify(objToJson);                             
                              
                                      })  
                                      .catch(err => {
                                          //handle error
                                          wpdlog(err);
                                          res.send({"Fetch" : "Fail" });
                                          conn.release();  
                              })
                    })
                    .catch(err => {
                                //handle error                            
                                wpdlog(err);
                                res.send({"Fetch" : "Fail" });
                                conn.release();  
                    })                    
            
        conn.release();    
        res.end(finalresponse);
          
    }).catch(err => {
          wpdlog(err);
          //not connected
    });

}));

// ##################################### APPEND A READINESS QUESTION CUSTOM ############################################################
app.post('/tnt/readinessQuestionCustomAppend/:id', accessHandler((req, res) => { 


    var transitionId = req.params.id;

    //Maria db

    pool.getConnection()
    .then(conn=>{

                    const query =  " insert into READINESS_QUESTION_CUSTOM(  "+
                                            "READINESS_QUESTION_CUSTOM_ID, "+   
                                            "TRANSITION_ID, "+                             
                                            "READINESS_QUESTION_CATEGORY, "+
                                            "READINESS_QUESTION_ADOPTED, "+
                                            "READINESS_QUESTION, "+
                                            "READINESS_QUESTION_ANSWER_FIELD_TYPE, "+
                                            "READINESS_QUESTION_ANSWER_DATA_TYPE, "+                                
                                            "READINESS_QUESTION_ANSWER_SET, "+ 
                                            "READINESS_QUESTION_SHORT_FORM, "+                                                                                        
                                            "READINESS_QUESTION_DISPLAY_ORDER "+                                                                                                                                                                               
                                    " ) values ( "+
                                        "null,"+    
                                        "'"+transitionId+"',"+                                                    
                                        "'"+req.body.READINESS_QUESTION_CATEGORY+"',"+  
                                        "'"+'NA'+"',"+                            
                                        "'"+req.body.READINESS_QUESTION+"',"+
                                        "'"+req.body.READINESS_QUESTION_ANSWER_FIELD_TYPE+"',"+                            
                                        "'"+req.body.READINESS_QUESTION_ANSWER_DATA_TYPE+"', "+  
                                        "'"+req.body.READINESS_QUESTION_ANSWER_SET+"',  "+       
                                        "'"+req.body.READINESS_QUESTION_SHORT_FORM+"', "+  
                                        "'"+req.body.READINESS_QUESTION_DISPLAY_ORDER+"'  "+                                                                                                              
                                    ") ";
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result1)=>{

                                    logInsertTable("READINESS_QUESTION_CUSTOM",query,"");
                                    conn.query(" SELECT LAST_INSERT_ID() ")
                                    .then((result)=>{
                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);  
                                    })
                                    .catch(err => {
                                                        wpdlog(err);
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                    })                                                                                            
                                  })
                                  .catch(err => {
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db
  
}));

// #####################################  UPDATE Readiness Question Design LIST ############################################################
app.put('/tnt/readinessQuestionDesign/:id', accessHandler((req, res) => { 

    wpdlog("READINESS_QUESTION_TRACKER_ID  "+req.params.id);

//Maria db
pool.getConnection()
.then(conn=>{
                    const query = "update READINESS_QUESTION_TRACKER  " + 
                                    "set TRANSITION_ID  ='" + req.body.TRANSITION_ID  + "', " +
                                        "HEADER_ROW   ='" + req.body.HEADER_ROW  + "',  " +
                                        "MULTIPLE_LOGICAL_COLS   ='" + JSON.stringify(req.body.MULTIPLE_LOGICAL_COLS ) + "'  " +                                                               
                                    "where  "+
                                        "READINESS_QUESTION_TRACKER_ID  ='" +req.params.id +"' " ;
          
          
                  //wpdlog("query "+query);

                  conn.query(query)
                              .then((result)=>{

                                          var objToJson = result;
                                          var response = [];
                                          for (var key in result) {
                                              //wpdlog("Result "+result[key]);
                                              response.push(result[key]);
                                          }
                                          objToJson.response = response;
                                          finalresponse = JSON.stringify(objToJson);                             
                                          conn.release();    
                                          res.end(finalresponse);                                                
                              })
                              .catch(err => {
                                          //handle error
                                          res.send({"Fetch" : "Fail" });
                                          conn.release();  
                              })
      
  }).catch(err => {
      //not connected
  });
//Maria db

}));

//############################################## User Transitions #########################################################
// #####################################  GET USER TRANSITION ADD List ############################################################
app.get('/tnt/userTransitionAddList/:id', accessHandler((req, res) => { 


    //Maria db
  
      pool.getConnection()
      .then(conn=>{
  
                      const query =  " select " +
                          " COALESCE(ut.USER_TRANSITION_ID,'') as USER_TRANSITION_ID, "+
                          " t.IntegrationID as TRANSITION_ID, "+
                          " COALESCE(t.ClientName,'') as CLIENT_NAME, "+            
                          " COALESCE(t.TransitionName,'') as TRANSITION_NAME "+           
                      " from "+
                          "  TRANSITIONPROFILE as t LEFT JOIN (SELECT TRANSITION_ID,USER_TRANSITION_ID from USER_TRANSITION WHERE USER_ID="+req.params.id+") as ut  "+
                          " ON t.IntegrationID = ut.TRANSITION_ID "; 
                
                
                        //wpdlog("query "+query);
  
                        conn.query(query)
                                    .then((result)=>{
  
                                                var objToJson = result;
                                                var response = [];
                                                for (var key in result) {
                                                    //wpdlog("Result "+result[key]);
                                                    response.push(result[key]);
                                                }
                                                objToJson.response = response;
                                                finalresponse = JSON.stringify(objToJson);                             
                                                conn.release();    
                                                res.end(finalresponse);                                                
                                    })
                                    .catch(err => {
                                                //handle error
                                                res.send({"Fetch" : "Fail" });
                                                conn.release();  
                                    })
            
        }).catch(err => {
            //not connected
        });
  
        //Maria db
  
   
  }));
  
  
  // #####################################  GET USER TRANSITION ADDED List ############################################################
  app.get('/tnt/userTransitionList/:id', accessHandler((req, res) => { 
  
     //Maria db
     pool.getConnection()
     .then(conn=>{

                      const query =  " select " +
                                        " COALESCE(ut.USER_TRANSITION_ID,'') as USER_TRANSITION_ID, "+
                                        " t.IntegrationID as TRANSITION_ID, "+
                                        " COALESCE(t.ClientName,'') as CLIENT_NAME, "+            
                                        " COALESCE(t.TransitionName,'') as TRANSITION_NAME "+           
                                    " from "+
                                        "  TRANSITIONPROFILE as t, USER_TRANSITION as ut  "+
                                        " WHERE t.IntegrationID = ut.TRANSITION_ID "+
                                        " AND ut.USER_ID = "+req.params.id; 
               
                       //wpdlog("query "+query);
  
                       conn.query(query)
                                   .then((result)=>{
  
                                               var objToJson = result;
                                               var response = [];
                                               for (var key in result) {
                                                   //wpdlog("Result "+result[key]);
                                                   response.push(result[key]);
                                               }
                                               objToJson.response = response;
                                               finalresponse = JSON.stringify(objToJson);                             
                                               conn.release();    
                                               res.end(finalresponse);                                                
                                   })
                                   .catch(err => {
                                               //handle error
                                               res.send({"Fetch" : "Fail" });
                                               conn.release();  
                                   })
           
       }).catch(err => {
           //not connected
       });
  
     //Maria db
  
   
  }));
  
  
  // #####################################Add  NEW TRANSITIONS TO USER ############################################################
  app.post('/tnt/userTransitionAdd/:id', accessHandler((req, res) => { 
  
      
      
      
      var userId = req.params.id;
      var paramValue = req.body.transitions;
      var transitionId = '';
  
      var transitions = paramValue.split(",");
      pool.getConnection()
      .then(conn=>{
  
          for( var i=0; i< transitions.length; i++){
  
              transitionId = transitions[i];
         
              const query =  " insert into USER_TRANSITION(  "+
                                      "USER_TRANSITION_ID, "+                                
                                      "USER_ID, "+
                                      "TRANSITION_ID, "+  
                                      "USER_ROLE" +
                              " ) values ( "+
                                  "null,"+                            
                                  "'"+userId+"',"+
                                  "'"+transitionId+"', "+   
                                  "' '"+                                                                                                         
                              ") ";
                
                
                        //wpdlog("query "+query);
  
                        conn.query(query)
                                    .then((result1)=>{
  
                                      conn.query(" SELECT LAST_INSERT_ID() ")
                                      .then((result)=>{
  
                                                var objToJson = result;
                                                var response = [];
                                                for (var key in result) {
                                                    //wpdlog("Result "+result[key]);
                                                    response.push(result[key]);
                                                }
                                                objToJson.response = response;
                                                finalresponse = JSON.stringify(objToJson);   
                                                
                                              })  
                                              .catch(err => {
                                                  //handle error
                                                  wpdlog(err);
                                                  res.send({"Fetch" : "Fail" });
                                                  conn.release();  
                                               })                                                    
                                                  
                                    })
                                    .catch(err => {
                                                //handle error
                                                wpdlog(err);
                                                res.send({"Fetch" : "Fail" });
                                                conn.release();  
                                    })
            }// end of for  
            
            conn.release();    
            res.end(finalresponse);
            
        }).catch(err => {
            //not connected
            wpdlog(err);
        });
      
  }));
  


// #####################################  GET PARAMETER GLOBAL LIST ############################################################
app.get('/tnt/parameterGlobalList/', accessHandler((req, res) => { 

    //Maria db
    
    pool.getConnection()
    .then(conn=>{

                    const query =  ' select ' +
                                        ' PARAMETER_GLOBAL_ID , '+
                                        ' COALESCE(PARAMETER_NAME    ,"") as PARAMETER_NAME    , '+
                                        ' COALESCE(DESCRIPTION  ,"") as DESCRIPTION  , '+
                                        ' COALESCE(RESOURCE_TYPE_MEASURED  ,"") as RESOURCE_TYPE_MEASURED  , '+
                                        ' COALESCE(EVALUATION_TECHNIQUE_MANUAL  ,"") as EVALUATION_TECHNIQUE_MANUAL  , '+            
                                        ' COALESCE(EVALUATION_EXPRESSION   ,"") as EVALUATION_EXPRESSION  ,  '+                                        
                                        ' COALESCE(RAG_R_OPERATOR_1   ,"") as RAG_R_OPERATOR_1   , '+
                                        ' COALESCE(RAG_R_OPERATOR_2  ,"") as RAG_R_OPERATOR_2  , '+
                                        ' COALESCE(RAG_R_CUTOFF_VALUE_LOW  ,"") as RAG_R_CUTOFF_VALUE_LOW  , '+
                                        ' COALESCE(RAG_R_CUTOFF_VALUE_HIGH  ,"") as RAG_R_CUTOFF_VALUE_HIGH  , '+            
                                        ' COALESCE(RAG_A_OPERATOR_1  ,"") as RAG_A_OPERATOR_1   ,'+                                        
                                        ' COALESCE(RAG_A_OPERATOR_2   ,"") as RAG_A_OPERATOR_2   ,'+
                                        ' COALESCE(RAG_A_CUTOFF_VALUE_LOW  ,"") as RAG_A_CUTOFF_VALUE_LOW  , '+
                                        ' COALESCE(RAG_A_CUTOFF_VALUE_HIGH  ,"") as RAG_A_CUTOFF_VALUE_HIGH  , '+
                                        ' COALESCE(RAG_G_OPERATOR_1  ,"") as RAG_G_OPERATOR_1  , '+            
                                        ' COALESCE(RAG_G_OPERATOR_2  ,"") as RAG_G_OPERATOR_2  ,  '+
                                        ' COALESCE(RAG_G_CUTOFF_VALUE_LOW  ,"") as RAG_G_CUTOFF_VALUE_LOW  , '+
                                        ' COALESCE(RAG_G_CUTOFF_VALUE_HIGH  ,"") as RAG_G_CUTOFF_VALUE_HIGH  '+                                                                                        
                                    ' from '+
                                        '  PARAMETER_GLOBAL  ';
                            
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{
                                            var objToJson = result;
                                            var response = [];
                                            for (var key in result) {
                                            //wpdlog("Result "+result[key]);
                                            response.push(result[key]);
                                            }
                                            objToJson.response = response;
                                            finalresponse = JSON.stringify(objToJson);     
                                            wpdlog("finalresponse parameter global.... "+finalresponse);
                                            conn.release();    
                                            res.end(finalresponse);                                               
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          wpdlog(err);
          //not connected
      });    
    //Maria db
 
}));

// #####################################  GET PARAMETER GLOBAL DATA ############################################################
app.get('/tnt/parameterData/:id', accessHandler((req, res) => { 

    //Maria db
    
    var parameterId = req.params.id;

    pool.getConnection()
    .then(conn=>{

                    const query =  ' select ' +
                                        ' PARAMETER_GLOBAL_ID , '+
                                        ' COALESCE(PARAMETER_NAME    ,"") as PARAMETER_NAME    , '+
                                        ' COALESCE(DESCRIPTION  ,"") as DESCRIPTION  , '+
                                        ' COALESCE(RESOURCE_TYPE_MEASURED  ,"") as RESOURCE_TYPE_MEASURED  , '+
                                        ' COALESCE(EVALUATION_TECHNIQUE_MANUAL  ,"") as EVALUATION_TECHNIQUE_MANUAL  , '+            
                                        ' COALESCE(EVALUATION_EXPRESSION   ,"") as EVALUATION_EXPRESSION  ,  '+                                        
                                        ' COALESCE(RAG_R_OPERATOR_1   ,"") as RAG_R_OPERATOR_1   , '+
                                        ' COALESCE(RAG_R_OPERATOR_2  ,"") as RAG_R_OPERATOR_2  , '+
                                        ' COALESCE(RAG_R_CUTOFF_VALUE_LOW  ,"") as RAG_R_CUTOFF_VALUE_LOW  , '+
                                        ' COALESCE(RAG_R_CUTOFF_VALUE_HIGH  ,"") as RAG_R_CUTOFF_VALUE_HIGH  , '+            
                                        ' COALESCE(RAG_A_OPERATOR_1  ,"") as RAG_A_OPERATOR_1   ,'+                                        
                                        ' COALESCE(RAG_A_OPERATOR_2   ,"") as RAG_A_OPERATOR_2   ,'+
                                        ' COALESCE(RAG_A_CUTOFF_VALUE_LOW  ,"") as RAG_A_CUTOFF_VALUE_LOW  , '+
                                        ' COALESCE(RAG_A_CUTOFF_VALUE_HIGH  ,"") as RAG_A_CUTOFF_VALUE_HIGH  , '+
                                        ' COALESCE(RAG_G_OPERATOR_1  ,"") as RAG_G_OPERATOR_1  , '+            
                                        ' COALESCE(RAG_G_OPERATOR_2  ,"") as RAG_G_OPERATOR_2  ,  '+
                                        ' COALESCE(RAG_G_CUTOFF_VALUE_LOW  ,"") as RAG_G_CUTOFF_VALUE_LOW  , '+
                                        ' COALESCE(RAG_G_CUTOFF_VALUE_HIGH  ,"") as RAG_G_CUTOFF_VALUE_HIGH  '+                                                                                        
                                    ' from '+
                                        '  PARAMETER_GLOBAL  '+
                                    ' where PARAMETER_GLOBAL_ID ='+parameterId    ;
                            
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{
                                            var objToJson = result;
                                            var response = [];
                                            for (var key in result) {
                                            //wpdlog("Result "+result[key]);
                                            response.push(result[key]);
                                            }
                                            objToJson.response = response;
                                            finalresponse = JSON.stringify(objToJson);     
                                            wpdlog("finalresponse parameter global.... "+finalresponse);
                                            conn.release();    
                                            res.end(finalresponse);                                               
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          wpdlog(err);
          //not connected
      });    
    //Maria db
 
}));


// #####################################CREATE A NEW TRANSITION PARAMETER ############################################################
app.post('/tnt/parameterCreate/', accessHandler((req, res) => { 



    //Maria db

    pool.getConnection()
    .then(conn=>{

                    const query =  " insert into PARAMETER_GLOBAL(  "+
                                            "PARAMETER_GLOBAL_ID, "+                                
                                            "PARAMETER_NAME, "+
                                            "DESCRIPTION, "+
                                            "RESOURCE_TYPE_MEASURED, "+
                                            "EVALUATION_TECHNIQUE_MANUAL, "+                                
                                            "EVALUATION_EXPRESSION, "+       
                                            "RAG_R_OPERATOR_1, "+                                
                                            "RAG_R_OPERATOR_2, "+
                                            "RAG_R_CUTOFF_VALUE_LOW, "+
                                            "RAG_R_CUTOFF_VALUE_HIGH, "+
                                            "RAG_A_OPERATOR_1, "+                                
                                            "RAG_A_OPERATOR_2, "+                                                                            
                                            "RAG_A_CUTOFF_VALUE_LOW, "+
                                            "RAG_A_CUTOFF_VALUE_HIGH, "+
                                            "RAG_G_OPERATOR_1, "+
                                            "RAG_G_OPERATOR_2, "+                                
                                            "RAG_G_CUTOFF_VALUE_LOW, "+       
                                            "RAG_G_CUTOFF_VALUE_HIGH "+                                                                                                                                                                    
                                    " ) values ( "+
                                        "null,"+                            
                                        "'"+req.body.PARAMETER_NAME+"',"+                            
                                        "'"+req.body.DESCRIPTION+"',"+
                                        "'"+req.body.RESOURCE_TYPE_MEASURED+"',"+                            
                                        "'"+req.body.EVALUATION_TECHNIQUE_MANUAL+"', "+  
                                        "'"+req.body.EVALUATION_EXPRESSION+"',  "+   
                                        "'"+req.body.RAG_R_OPERATOR_1+"',  "+   
                                        "'"+req.body.RAG_R_OPERATOR_2+"',"+                            
                                        "'"+req.body.RAG_R_CUTOFF_VALUE_LOW+"',"+
                                        "'"+req.body.RAG_R_CUTOFF_VALUE_HIGH+"',"+                            
                                        "'"+req.body.RAG_A_OPERATOR_1+"', "+  
                                        "'"+req.body.RAG_A_OPERATOR_2+"',  "+                                                                
                                        "'"+req.body.RAG_A_CUTOFF_VALUE_LOW+"',"+                            
                                        "'"+req.body.RAG_A_CUTOFF_VALUE_HIGH+"',"+
                                        "'"+req.body.RAG_G_OPERATOR_1+"',"+                            
                                        "'"+req.body.RAG_G_OPERATOR_2+"', "+  
                                        "'"+req.body.RAG_G_CUTOFF_VALUE_LOW +"',  "+ 
                                        "'"+req.body.RAG_G_CUTOFF_VALUE_HIGH +"'  "+                                                                                                                                                       
                                    ") ";
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result1)=>{
                                    conn.query(" SELECT LAST_INSERT_ID() ")
                                    .then((result)=>{
                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);  
                                    })
                                    .catch(err => {
                                                        wpdlog(err);
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                    })                                                                                            
                                  })
                                  .catch(err => {
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db
  
}));

// #####################################UPDATE TRANSITION PARAMETER GLOBAL ############################################################
app.put('/tnt/parameterEdit/:id', accessHandler((req, res) => { 


    //var parameterId = req.params.id;
    //Maria db

    pool.getConnection()
    .then(conn=>{



        const query = "update  PARAMETER_GLOBAL " + 
                        "set PARAMETER_NAME ='" + req.body.PARAMETER_NAME + "', " +
                            "DESCRIPTION  ='" + req.body.DESCRIPTION + "',  " +     
                            "RESOURCE_TYPE_MEASURED  ='" + req.body.RESOURCE_TYPE_MEASURED + "',  " +     
                            "EVALUATION_TECHNIQUE_MANUAL  ='" + req.body.EVALUATION_TECHNIQUE_MANUAL + "',  " +     
                            "EVALUATION_EXPRESSION  ='" + req.body.EVALUATION_EXPRESSION + "',  " +     
                            "RAG_R_OPERATOR_1  ='" + req.body.RAG_R_OPERATOR_1 + "',  " +    
                            "RAG_R_OPERATOR_2  ='" + req.body.RAG_R_OPERATOR_2 + "',  " +     
                            "RAG_R_CUTOFF_VALUE_LOW  ='" + req.body.RAG_R_CUTOFF_VALUE_LOW + "',  " +     
                            "RAG_R_CUTOFF_VALUE_HIGH  ='" + req.body.RAG_R_CUTOFF_VALUE_HIGH + "',  " +     
                            "RAG_A_OPERATOR_1  ='" + req.body.RAG_A_OPERATOR_1 + "',  " +     
                            "RAG_A_OPERATOR_2  ='" + req.body.RAG_A_OPERATOR_2 + "',  " +     
                            "RAG_A_CUTOFF_VALUE_LOW  ='" + req.body.RAG_A_CUTOFF_VALUE_LOW + "',  " +     
                            "RAG_A_CUTOFF_VALUE_HIGH  ='" + req.body.RAG_A_CUTOFF_VALUE_HIGH + "',  " +     
                            "RAG_G_OPERATOR_1  ='" + req.body.RAG_G_OPERATOR_1 + "',  " +     
                            "RAG_G_OPERATOR_2  ='" + req.body.RAG_G_OPERATOR_2 + "',  " +     
                            "RAG_G_CUTOFF_VALUE_LOW  ='" + req.body.RAG_G_CUTOFF_VALUE_LOW + "',  " +     
                            "RAG_G_CUTOFF_VALUE_HIGH  ='" + req.body.RAG_G_CUTOFF_VALUE_HIGH + "'  " +                                                                   
                        "where  "+
                            "PARAMETER_GLOBAL_ID ='" +req.params.id +"' " ; 
    
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result1)=>{
                                    conn.query(" SELECT LAST_INSERT_ID() ")
                                    .then((result)=>{
                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);  
                                    })
                                    .catch(err => {
                                                        wpdlog(err);
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                    })                                                                                            
                                  })
                                  .catch(err => {
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db
  
}));

// Get Parameter Custom List
app.get('/tnt/parameterCustomList/:id', accessHandler((req, res) => { 

    wpdlog("Get Parameter Custom List");
    //Maria db
    pool.getConnection()
    .then(conn=>{

              wpdlog("Get Parameter Custom List Connected");

                    var transitionId = req.params.id;

                    const queryDesign = ""+
                    ' (select ' +
                    ' COALESCE(custom.CUSTOM_OR_GLOBAL_QUESTION, global.CUSTOM_OR_GLOBAL_QUESTION) as CUSTOM_OR_GLOBAL_QUESTION, '+
                    ' COALESCE(custom.PARAMETER_ID,global.PARAMETER_ID) as PARAMETER_ID, '+
                    ' COALESCE(custom.PARAMETER_NAME, global.PARAMETER_NAME) as PARAMETER_NAME, '+
                    ' COALESCE(custom.DESCRIPTION  , global.DESCRIPTION) as DESCRIPTION,'+
                    ' COALESCE(custom.ADOPTED_PARAMETER ,global.ADOPTED_PARAMETER) as ADOPTED_PARAMETER, '+
                    ' COALESCE(custom.ADOPTION_COMPLETED ,global.ADOPTION_COMPLETED) as ADOPTION_COMPLETED, '+
                    ' COALESCE(custom.PARAMETER_GLOBAL_ID,  global.PARAMETER_GLOBAL_ID) as PARAMETER_GLOBAL_ID, '+
                    ' COALESCE(custom.RESOURCE_TYPE_MEASURED  ,global.RESOURCE_TYPE_MEASURED) as RESOURCE_TYPE_MEASURED, '+
                    ' COALESCE(custom.EVALUATION_TECHNIQUE_MANUAL  ,global.EVALUATION_TECHNIQUE_MANUAL) as EVALUATION_TECHNIQUE_MANUAL, '+            
                    ' COALESCE(custom.EVALUATION_EXPRESSION  ,global.EVALUATION_EXPRESSION) as EVALUATION_EXPRESSION,  '+                                        
                    ' COALESCE(custom.RAG_R_OPERATOR_1   , global.RAG_R_OPERATOR_1) as RAG_R_OPERATOR_1,'+
                    ' COALESCE(custom.RAG_R_OPERATOR_2  ,global.RAG_R_OPERATOR_2) as RAG_R_OPERATOR_2, '+
                    ' COALESCE(custom.RAG_R_CUTOFF_VALUE_LOW  ,global.RAG_R_CUTOFF_VALUE_LOW) as RAG_R_CUTOFF_VALUE_LOW, '+
                    ' COALESCE(custom.RAG_R_CUTOFF_VALUE_HIGH  ,global.RAG_R_CUTOFF_VALUE_HIGH) as RAG_R_CUTOFF_VALUE_HIGH, '+            
                    ' COALESCE(custom.RAG_A_OPERATOR_1   ,global.RAG_A_OPERATOR_1) as RAG_A_OPERATOR_1,'+                                        
                    ' COALESCE(custom.RAG_A_OPERATOR_2   ,global.RAG_A_OPERATOR_2) as RAG_A_OPERATOR_2,'+
                    ' COALESCE(custom.RAG_A_CUTOFF_VALUE_LOW  ,global.RAG_A_CUTOFF_VALUE_LOW) as RAG_A_CUTOFF_VALUE_LOW, '+
                    ' COALESCE(custom.RAG_A_CUTOFF_VALUE_HIGH  ,global.RAG_A_CUTOFF_VALUE_HIGH) as RAG_A_CUTOFF_VALUE_HIGH, '+
                    ' COALESCE(custom.RAG_G_OPERATOR_1  ,global.RAG_G_OPERATOR_1) as RAG_G_OPERATOR_1, '+            
                    ' COALESCE(custom.RAG_G_OPERATOR_2  ,global.RAG_G_OPERATOR_2) as RAG_G_OPERATOR_2,  '+
                    ' COALESCE(custom.RAG_G_CUTOFF_VALUE_LOW  ,global.RAG_G_CUTOFF_VALUE_LOW) as RAG_G_CUTOFF_VALUE_LOW, '+
                    ' COALESCE(custom.RAG_G_CUTOFF_VALUE_HIGH,global.RAG_G_CUTOFF_VALUE_HIGH) as RAG_G_CUTOFF_VALUE_HIGH'+  
' from '+
                    '( select ' +
                    ' "G" as CUSTOM_OR_GLOBAL_QUESTION, '+                                                                    
                    ' COALESCE(PARAMETER_GLOBAL_ID    ,"") as PARAMETER_ID    , '+                                                                    
                    ' COALESCE(PARAMETER_NAME    ,"") as PARAMETER_NAME    , '+
                    ' COALESCE(DESCRIPTION  ,"") as DESCRIPTION  , '+
                    ' "N" as ADOPTED_PARAMETER   , '+
                    ' "N" as ADOPTION_COMPLETED   , '+
                    ' COALESCE(PARAMETER_GLOBAL_ID   ,"") as PARAMETER_GLOBAL_ID   , '+                                                                    
                    ' COALESCE(RESOURCE_TYPE_MEASURED  ,"") as RESOURCE_TYPE_MEASURED  , '+
                    ' COALESCE(EVALUATION_TECHNIQUE_MANUAL  ,"") as EVALUATION_TECHNIQUE_MANUAL  , '+            
                    ' COALESCE(EVALUATION_EXPRESSION   ,"") as EVALUATION_EXPRESSION  ,  '+                                        
                    ' COALESCE(RAG_R_OPERATOR_1   ,"") as RAG_R_OPERATOR_1   , '+
                    ' COALESCE(RAG_R_OPERATOR_2  ,"") as RAG_R_OPERATOR_2  , '+
                    ' COALESCE(RAG_R_CUTOFF_VALUE_LOW  ,"") as RAG_R_CUTOFF_VALUE_LOW  , '+
                    ' COALESCE(RAG_R_CUTOFF_VALUE_HIGH  ,"") as RAG_R_CUTOFF_VALUE_HIGH  , '+            
                    ' COALESCE(RAG_A_OPERATOR_1  ,"") as RAG_A_OPERATOR_1   ,'+                                        
                    ' COALESCE(RAG_A_OPERATOR_2   ,"") as RAG_A_OPERATOR_2   ,'+
                    ' COALESCE(RAG_A_CUTOFF_VALUE_LOW  ,"") as RAG_A_CUTOFF_VALUE_LOW  , '+
                    ' COALESCE(RAG_A_CUTOFF_VALUE_HIGH  ,"") as RAG_A_CUTOFF_VALUE_HIGH  , '+
                    ' COALESCE(RAG_G_OPERATOR_1  ,"") as RAG_G_OPERATOR_1  , '+            
                    ' COALESCE(RAG_G_OPERATOR_2  ,"") as RAG_G_OPERATOR_2  ,  '+
                    ' COALESCE(RAG_G_CUTOFF_VALUE_LOW  ,"") as RAG_G_CUTOFF_VALUE_LOW  , '+
                    ' COALESCE(RAG_G_CUTOFF_VALUE_HIGH  ,"") as RAG_G_CUTOFF_VALUE_HIGH  '+  
                    ' from '+
                    ' PARAMETER_GLOBAL  )   as global '+                    
            ' left join '+
                    ' (select ' +
                    ' "C" as CUSTOM_OR_GLOBAL_QUESTION, '+
                    ' PARAMETER_CUSTOM_ID as PARAMETER_ID, '+
                    ' COALESCE(PARAMETER_NAME    ,"") as PARAMETER_NAME    , '+
                    ' COALESCE(DESCRIPTION  ,"") as DESCRIPTION  , '+
                    ' COALESCE(ADOPTED_PARAMETER   ,"") as ADOPTED_PARAMETER   , '+
                    ' COALESCE(ADOPTION_COMPLETED   ,"") as ADOPTION_COMPLETED   , '+
                    ' COALESCE(PARAMETER_GLOBAL_ID   ,"") as PARAMETER_GLOBAL_ID   , '+
                    ' COALESCE(RESOURCE_TYPE_MEASURED  ,"") as RESOURCE_TYPE_MEASURED  , '+
                    ' COALESCE(EVALUATION_TECHNIQUE_MANUAL  ,"") as EVALUATION_TECHNIQUE_MANUAL  , '+            
                    ' COALESCE(EVALUATION_EXPRESSION   ,"") as EVALUATION_EXPRESSION  ,  '+                                        
                    ' COALESCE(RAG_R_OPERATOR_1   ,"") as RAG_R_OPERATOR_1   , '+
                    ' COALESCE(RAG_R_OPERATOR_2  ,"") as RAG_R_OPERATOR_2  , '+
                    ' COALESCE(RAG_R_CUTOFF_VALUE_LOW  ,"") as RAG_R_CUTOFF_VALUE_LOW  , '+
                    ' COALESCE(RAG_R_CUTOFF_VALUE_HIGH  ,"") as RAG_R_CUTOFF_VALUE_HIGH  , '+            
                    ' COALESCE(RAG_A_OPERATOR_1  ,"") as RAG_A_OPERATOR_1   ,'+                                        
                    ' COALESCE(RAG_A_OPERATOR_2   ,"") as RAG_A_OPERATOR_2   ,'+
                    ' COALESCE(RAG_A_CUTOFF_VALUE_LOW  ,"") as RAG_A_CUTOFF_VALUE_LOW  , '+
                    ' COALESCE(RAG_A_CUTOFF_VALUE_HIGH  ,"") as RAG_A_CUTOFF_VALUE_HIGH  , '+
                    ' COALESCE(RAG_G_OPERATOR_1  ,"") as RAG_G_OPERATOR_1  , '+            
                    ' COALESCE(RAG_G_OPERATOR_2  ,"") as RAG_G_OPERATOR_2  ,  '+
                    ' COALESCE(RAG_G_CUTOFF_VALUE_LOW  ,"") as RAG_G_CUTOFF_VALUE_LOW  , '+
                    ' COALESCE(RAG_G_CUTOFF_VALUE_HIGH  ,"") as RAG_G_CUTOFF_VALUE_HIGH  '+  
                    ' from '+
                    '  PARAMETER_CUSTOM   '+
                    " WHERE TRANSITION_ID ='"+transitionId+"' ) as custom "+            
            " ON "+
                    "global.PARAMETER_ID = custom.PARAMETER_GLOBAL_ID ) " +
            " UNION "+     
                    ' (select ' +
                    ' "C" as CUSTOM_OR_GLOBAL_QUESTION, '+
                    ' PARAMETER_CUSTOM_ID as PARAMETER_ID, '+
                    ' COALESCE(PARAMETER_NAME    ,"") as PARAMETER_NAME    , '+
                    ' COALESCE(DESCRIPTION  ,"") as DESCRIPTION  , '+
                    ' COALESCE(ADOPTED_PARAMETER   ,"") as ADOPTED_PARAMETER   , '+
                    ' COALESCE(ADOPTION_COMPLETED   ,"") as ADOPTION_COMPLETED   , '+
                    ' COALESCE(PARAMETER_GLOBAL_ID   ,"") as PARAMETER_GLOBAL_ID   , '+
                    ' COALESCE(RESOURCE_TYPE_MEASURED  ,"") as RESOURCE_TYPE_MEASURED  , '+
                    ' COALESCE(EVALUATION_TECHNIQUE_MANUAL  ,"") as EVALUATION_TECHNIQUE_MANUAL  , '+            
                    ' COALESCE(EVALUATION_EXPRESSION   ,"") as EVALUATION_EXPRESSION  ,  '+                                        
                    ' COALESCE(RAG_R_OPERATOR_1   ,"") as RAG_R_OPERATOR_1   , '+
                    ' COALESCE(RAG_R_OPERATOR_2  ,"") as RAG_R_OPERATOR_2  , '+
                    ' COALESCE(RAG_R_CUTOFF_VALUE_LOW  ,"") as RAG_R_CUTOFF_VALUE_LOW  , '+
                    ' COALESCE(RAG_R_CUTOFF_VALUE_HIGH  ,"") as RAG_R_CUTOFF_VALUE_HIGH  , '+            
                    ' COALESCE(RAG_A_OPERATOR_1  ,"") as RAG_A_OPERATOR_1   ,'+                                        
                    ' COALESCE(RAG_A_OPERATOR_2   ,"") as RAG_A_OPERATOR_2   ,'+
                    ' COALESCE(RAG_A_CUTOFF_VALUE_LOW  ,"") as RAG_A_CUTOFF_VALUE_LOW  , '+
                    ' COALESCE(RAG_A_CUTOFF_VALUE_HIGH  ,"") as RAG_A_CUTOFF_VALUE_HIGH  , '+
                    ' COALESCE(RAG_G_OPERATOR_1  ,"") as RAG_G_OPERATOR_1  , '+            
                    ' COALESCE(RAG_G_OPERATOR_2  ,"") as RAG_G_OPERATOR_2  ,  '+
                    ' COALESCE(RAG_G_CUTOFF_VALUE_LOW  ,"") as RAG_G_CUTOFF_VALUE_LOW  , '+
                    ' COALESCE(RAG_G_CUTOFF_VALUE_HIGH  ,"") as RAG_G_CUTOFF_VALUE_HIGH  '+  
                    ' from '+
                    '  PARAMETER_CUSTOM   '+
                    " WHERE TRANSITION_ID ='"+transitionId+"'  "+
                    " and PARAMETER_GLOBAL_ID is null) ";                
                    


//######################

/*
const queryDesign = ""+
' select ' +
' custom.CUSTOM_OR_GLOBAL_QUESTION, '+
' custom.PARAMETER_ID, '+
' custom.PARAMETER_NAME     '+
' from '+
'( select ' +
' "G" as CUSTOM_OR_GLOBAL_QUESTION, '+                                                                    
' COALESCE(PARAMETER_GLOBAL_ID    ,"") as PARAMETER_ID    , '+                                                                    
' COALESCE(PARAMETER_NAME    ,"") as PARAMETER_NAME     '+
' from '+
' PARAMETER_GLOBAL  )   as global '+
' left join (' +
' select ' +
' "C" as CUSTOM_OR_GLOBAL_QUESTION, '+
' PARAMETER_CUSTOM_ID as PARAMETER_ID, '+
' COALESCE(PARAMETER_NAME    ,"") as PARAMETER_NAME    , '+
' from '+
'  PARAMETER_CUSTOM   '+
" WHERE TRANSITION_ID ='"+transitionId+"' ) as custom "+
" ON "+
"global.PARAMETER_ID = custom.PARAMETER_GLOBAL_ID ";
*/

//######################



                            
                      wpdlog("query "+queryDesign);

                      conn.query(queryDesign)
                                  .then((result1)=>{

                                    var objToJson = result1;
                                    var response = [];
                                    //var designFound = 'false';
                                    wpdlog(" result1.length() = "+result1.length);

                                    if (result1.length >0){
                                            for (var key in result1) {
                                                wpdlog("Result 1..."+result1[key]);
                                                response.push(result1[key]);
                                                //designFound = 'true';
                                            }
                                            objToJson.response = response;
                                            finalresponse = JSON.stringify(objToJson);  
                    
                                            wpdlog("Design response 1 ....");
                                            //finalresponse = response;   
                                            res.end(finalresponse); 
                                    }else{
                                            res.end("[]");
                                    }      

                                    
                                       
                                    conn.release();  
                                              
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })          
      }).catch(err => {
          wpdlog("Not connected");
          wpdlog(err);
      });
    //Maria db      
}));

// Get Parameter Custom List For Tracking
app.get('/tnt/parameterCustomListForTracking/:id', accessHandler((req, res) => { 

    wpdlog("Get Parameter Custom List");
    //Maria db
    pool.getConnection()
    .then(conn=>{

              wpdlog("Get Parameter Custom List Connected");

                    var transitionId = req.params.id;

                    const queryDesign =  ' select ' +
                                                ' "C" as CUSTOM_OR_GLOBAL_QUESTION, '+
                                                ' PARAMETER_CUSTOM_ID as PARAMETER_ID, '+
                                                ' COALESCE(PARAMETER_NAME    ,"") as PARAMETER_NAME    , '+
                                                ' COALESCE(DESCRIPTION  ,"") as DESCRIPTION  , '+
                                                ' COALESCE(ADOPTED_PARAMETER   ,"") as ADOPTED_PARAMETER   , '+
                                                ' COALESCE(ADOPTION_COMPLETED   ,"") as ADOPTION_COMPLETED   , '+
                                                ' COALESCE(PARAMETER_GLOBAL_ID   ,"") as PARAMETER_GLOBAL_ID   , '+
                                                ' COALESCE(RESOURCE_TYPE_MEASURED  ,"") as RESOURCE_TYPE_MEASURED  , '+
                                                ' COALESCE(EVALUATION_TECHNIQUE_MANUAL  ,"") as EVALUATION_TECHNIQUE_MANUAL  , '+            
                                                ' COALESCE(EVALUATION_EXPRESSION   ,"") as EVALUATION_EXPRESSION  ,  '+                                        
                                                ' COALESCE(RAG_R_OPERATOR_1   ,"") as RAG_R_OPERATOR_1   , '+
                                                ' COALESCE(RAG_R_OPERATOR_2  ,"") as RAG_R_OPERATOR_2  , '+
                                                ' COALESCE(RAG_R_CUTOFF_VALUE_LOW  ,"") as RAG_R_CUTOFF_VALUE_LOW  , '+
                                                ' COALESCE(RAG_R_CUTOFF_VALUE_HIGH  ,"") as RAG_R_CUTOFF_VALUE_HIGH  , '+            
                                                ' COALESCE(RAG_A_OPERATOR_1  ,"") as RAG_A_OPERATOR_1   ,'+                                        
                                                ' COALESCE(RAG_A_OPERATOR_2   ,"") as RAG_A_OPERATOR_2   ,'+
                                                ' COALESCE(RAG_A_CUTOFF_VALUE_LOW  ,"") as RAG_A_CUTOFF_VALUE_LOW  , '+
                                                ' COALESCE(RAG_A_CUTOFF_VALUE_HIGH  ,"") as RAG_A_CUTOFF_VALUE_HIGH  , '+
                                                ' COALESCE(RAG_G_OPERATOR_1  ,"") as RAG_G_OPERATOR_1  , '+            
                                                ' COALESCE(RAG_G_OPERATOR_2  ,"") as RAG_G_OPERATOR_2  ,  '+
                                                ' COALESCE(RAG_G_CUTOFF_VALUE_LOW  ,"") as RAG_G_CUTOFF_VALUE_LOW  , '+
                                                ' COALESCE(RAG_G_CUTOFF_VALUE_HIGH  ,"") as RAG_G_CUTOFF_VALUE_HIGH  '+  
                                        ' from '+
                                            '  PARAMETER_CUSTOM   '+
                                        " WHERE TRANSITION_ID ='"+transitionId+"'  "+
                                        " and ADOPTED_PARAMETER in ('Y', 'NA') ";
                        
              
              
                      wpdlog("query "+queryDesign);

                      conn.query(queryDesign)
                                  .then((result1)=>{

                                    var objToJson = result1;
                                    var response = [];
                                    //var designFound = 'false';
                                    wpdlog(" result1.length() = "+result1.length);                    
                                    if (result1.length >0){

                                            for (var key in result1) {
                                                wpdlog("Result 1..."+result1[key]);
                                                response.push(result1[key]);
                                                //designFound = 'true';
                                            }
                                            objToJson.response = response;
                                            finalresponse = JSON.stringify(objToJson);  
                    
                                            wpdlog("Design response 1 ....");
                                            //finalresponse = response;  
                                            res.end(finalresponse);            
                                    } 
                                    else{
                                        res.end("[]");  
                                    }
                                    res.end(finalresponse)
                                    conn.release();                                                 
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })          
      }).catch(err => {
          wpdlog("Not connected");
          wpdlog(err);
      });
    //Maria db      
}));


// #####################################CREATE PARAMETER CUSTOM ############################################################
app.post('/tnt/parameterCreateCustom/:id', accessHandler((req, res) => { 

        
    wpdlog(" globalParameterList "+req.body.globalParameterList);
    
    var transitionId = req.params.id;
    var parameters = req.body.globalParameterList;

    wpdlog("parameters "+parameters);
    //var criteria = JSON.parse(paramValue);

    wpdlog("parameters[0] "+   parameters[0]);
    var query ="";

  
    //Maria db
    pool.getConnection()
    .then(conn=>{


        for( var i=0; i< parameters.length; i++){

             // Adopt only those which have not been adopted yet

             wpdlog("parameters[i].parameterId "+parameters[i].customOrGlobal);
             if (parameters[i].customOrGlobal ==='G'){
       
                    query =  " insert into PARAMETER_CUSTOM(  "+
                                            "PARAMETER_CUSTOM_ID, "+  
                                            "TRANSITION_ID,"+                              
                                            "PARAMETER_NAME, "+
                                            "DESCRIPTION, "+
                                            "ADOPTED_PARAMETER, "+
                                            "ADOPTION_COMPLETED, "+
                                            "PARAMETER_GLOBAL_ID, "+
                                            "RESOURCE_TYPE_MEASURED, "+
                                            "EVALUATION_TECHNIQUE_MANUAL, "+                                
                                            "EVALUATION_EXPRESSION, "+       
                                            "RAG_R_OPERATOR_1, "+                                
                                            "RAG_R_OPERATOR_2, "+
                                            "RAG_R_CUTOFF_VALUE_LOW, "+
                                            "RAG_R_CUTOFF_VALUE_HIGH, "+
                                            "RAG_A_OPERATOR_1, "+                                
                                            "RAG_A_OPERATOR_2, "+                                                                            
                                            "RAG_A_CUTOFF_VALUE_LOW, "+
                                            "RAG_A_CUTOFF_VALUE_HIGH, "+
                                            "RAG_G_OPERATOR_1, "+
                                            "RAG_G_OPERATOR_2, "+                                
                                            "RAG_G_CUTOFF_VALUE_LOW, "+       
                                            "RAG_G_CUTOFF_VALUE_HIGH "+                                                                                                                                                                    
                                    " ) values ( "+
                                        "null,"+     
                                        "'"+transitionId+"',"+                           
                                        "'"+parameters[i].parameterName+"',"+                            
                                        "'"+parameters[i].description+"',"+
                                        "'"+parameters[i].adoptedField+"',"+
                                        "'"+parameters[i].adoptionCompleted+"',"+
                                        "'"+parameters[i].parameterIdGlobal+"',"+                                                                                                                        
                                        "'"+parameters[i].resourceTypeMeasured+"',"+                            
                                        "'"+parameters[i].evalTechniqueManual+"', "+  
                                        "'"+parameters[i].evaluationExpression+"',  "+   
                                        "'"+parameters[i].RAG_R_operation_1+"',  "+                                             
                                        "'"+parameters[i].RAG_R_operation_2+"',"+                            
                                        "'"+parameters[i].RAG_R_cutoff_value_low+"',"+
                                        "'"+parameters[i].RAG_R_cutoff_value_high+"',"+                            
                                        "'"+parameters[i].RAG_A_operation_1+"', "+  
                                        "'"+parameters[i].RAG_A_operation_2+"',  "+                                                                
                                        "'"+parameters[i].RAG_A_cutoff_value_low+"',"+                            
                                        "'"+parameters[i].RAG_A_cutoff_value_high+"',"+
                                        "'"+parameters[i].RAG_G_operation_1+"',"+                            
                                        "'"+parameters[i].RAG_G_operation_2+"', "+  
                                        "'"+parameters[i].RAG_G_cutoff_value_low +"',  "+ 
                                        "'"+parameters[i].RAG_G_cutoff_value_high +"'  "+                                                                                                                                                       
                                    ") ";

                                    wpdlog("query for inserting to  PARAMETER_CUSTOM table "+query); 
             }else{
                    query =   " update PARAMETER_CUSTOM  "+
                                    " set ADOPTED_PARAMETER='"+parameters[i].adoptedField+"' "+
                                    " where PARAMETER_CUSTOM_ID='"+parameters[i].parameterId+"'";
                                    wpdlog("query for updating to  PARAMETER_CUSTOM table "+query);
             }              

                                

                      wpdlog("query for inserting to  PARAMETER_CUSTOM table "+query);

                      conn.query(query)
                                  .then((result1)=>{
                                            conn.query(" SELECT LAST_INSERT_ID() ")
                                                    .then((result)=>{                                    

                                                    var objToJson = result;
                                                    var response = [];
                                                    for (var key in result) {
                                                        //wpdlog("Result "+result[key]);
                                                        response.push(result[key]);
                                                    }
                                                    objToJson.response = response;
                                                    finalresponse = JSON.stringify(objToJson);                             
                                            
                                                    })  
                                                    .catch(err => {
                                                        //handle error
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                            })
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })                        
        }  // end of for   
            
        conn.release();    
        res.end(finalresponse);
          
    }).catch(err => {
          //not connected
    });

}));


// #####################################APPEND PARAMETER CUSTOM ############################################################
app.post('/tnt/parameterAppendCustom/:id', accessHandler((req, res) => { 

        
    //wpdlog(" customParameter "+req.body.customParameterList);
    
    var transitionId = req.params.id;
    //var parameters = req.body.customParameterList;
    //var criteria = JSON.parse(paramValue);


    
 
    var customOrGlobal = req.body.CUSTOM_OR_GLOBAL_QUESTION; 
    


    var customParameters = req.body.CUSTOM_PARAMETER;    

    //wpdlog("req.body.GLOBAL_PARAMETER "+req.body.GLOBAL_PARAMETER +"  Lenth "+parameters.length );
    wpdlog("req.body.CUSTOM_PARAMETER "+customParameters.PARAMETER_NAME );

 
    //var query = "";
 
    //Maria db
    pool.getConnection()
    .then(conn=>{


        if (customOrGlobal === 'G'){
            var parameters = req.body.GLOBAL_PARAMETER;
        for( var i=0; i< parameters.length; i++){
          

                   

                   const query =  " insert into PARAMETER_CUSTOM(  "+
                                           "PARAMETER_CUSTOM_ID, "+  
                                           "TRANSITION_ID,"+                              
                                           "PARAMETER_NAME, "+
                                           "DESCRIPTION, "+
                                           "ADOPTED_PARAMETER, "+
                                           "ADOPTION_COMPLETED, "+
                                           "PARAMETER_GLOBAL_ID, "+
                                           "RESOURCE_TYPE_MEASURED, "+
                                           "EVALUATION_TECHNIQUE_MANUAL, "+                                
                                           "EVALUATION_EXPRESSION, "+       
                                           "RAG_R_OPERATOR_1, "+                                
                                           "RAG_R_OPERATOR_2, "+
                                           "RAG_R_CUTOFF_VALUE_LOW, "+
                                           "RAG_R_CUTOFF_VALUE_HIGH, "+
                                           "RAG_A_OPERATOR_1, "+                                
                                           "RAG_A_OPERATOR_2, "+                                                                            
                                           "RAG_A_CUTOFF_VALUE_LOW, "+
                                           "RAG_A_CUTOFF_VALUE_HIGH, "+
                                           "RAG_G_OPERATOR_1, "+
                                           "RAG_G_OPERATOR_2, "+                                
                                           "RAG_G_CUTOFF_VALUE_LOW, "+       
                                           "RAG_G_CUTOFF_VALUE_HIGH "+                                                                                                                                                                    
                                   " ) values ( "+
                                       "null,"+     
                                       "'"+transitionId+"',"+                           
                                       "'"+parameters[i].parameterName+"',"+                            
                                       "'"+parameters[i].description+"',"+
                                       "'"+parameters[i].adoptedField+"',"+
                                       "'"+parameters[i].adoptionCompleted+"',"+
                                       "'"+parameters[i].parameterIdGlobal+"',"+                                                                                                                        
                                       "'"+parameters[i].resourceTypeMeasured+"',"+                            
                                       "'"+parameters[i].evalTechniqueManual+"', "+  
                                       "'"+parameters[i].evaluationExpression+"',  "+   
                                       "'"+parameters[i].RAG_R_operation_1+"',  "+                                             
                                       "'"+parameters[i].RAG_R_operation_2+"',"+                            
                                       "'"+parameters[i].RAG_R_cutoff_value_low+"',"+
                                       "'"+parameters[i].RAG_R_cutoff_value_high+"',"+                            
                                       "'"+parameters[i].RAG_A_operation_1+"', "+  
                                       "'"+parameters[i].RAG_A_operation_2+"',  "+                                                                
                                       "'"+parameters[i].RAG_A_cutoff_value_low+"',"+                            
                                       "'"+parameters[i].RAG_A_cutoff_value_high+"',"+
                                       "'"+parameters[i].RAG_G_operation_1+"',"+                            
                                       "'"+parameters[i].RAG_G_operation_2+"', "+  
                                       "'"+parameters[i].RAG_G_cutoff_value_low +"',  "+ 
                                       "'"+parameters[i].RAG_G_cutoff_value_high +"'  "+                                                                                                                                                       
                                   ") ";

                            wpdlog("query ............................"+query);

                            conn.query(query)
                                        .then((result1)=>{
                                                conn.query(" SELECT LAST_INSERT_ID() ")
                                                        .then((result)=>{                                    

                                                        var objToJson = result;
                                                        var response = [];
                                                        for (var key in result) {
                                                            //wpdlog("Result "+result[key]);
                                                            response.push(result[key]);
                                                        }
                                                        objToJson.response = response;
                                                        finalresponse = JSON.stringify(objToJson);                             
                                                
                                                        })  
                                                        .catch(err => {
                                                            //handle error
                                                            wpdlog(err);
                                                            res.send({"Fetch" : "Fail" });
                                                            conn.release();  
                                                })
                                        })
                                        .catch(err => {
                                                    //handle error
                                                    wpdlog(err);
                                                    res.send({"Fetch" : "Fail" });
                                                    conn.release();  
                                        })                        
                   }  // end of for   
                }

                   //Now add the current parameter
                    const query =  " insert into PARAMETER_CUSTOM(  "+
                                            "PARAMETER_CUSTOM_ID, "+  
                                            "TRANSITION_ID,"+                              
                                            "PARAMETER_NAME, "+
                                            "DESCRIPTION, "+
                                            "ADOPTED_PARAMETER, "+
                                            "ADOPTION_COMPLETED, "+
                                            "RESOURCE_TYPE_MEASURED, "+
                                            "EVALUATION_TECHNIQUE_MANUAL, "+                                
                                            "EVALUATION_EXPRESSION, "+       
                                            "RAG_R_OPERATOR_1, "+                                
                                            "RAG_R_OPERATOR_2, "+
                                            "RAG_R_CUTOFF_VALUE_LOW, "+
                                            "RAG_R_CUTOFF_VALUE_HIGH, "+
                                            "RAG_A_OPERATOR_1, "+                                
                                            "RAG_A_OPERATOR_2, "+                                                                            
                                            "RAG_A_CUTOFF_VALUE_LOW, "+
                                            "RAG_A_CUTOFF_VALUE_HIGH, "+
                                            "RAG_G_OPERATOR_1, "+
                                            "RAG_G_OPERATOR_2, "+                                
                                            "RAG_G_CUTOFF_VALUE_LOW, "+       
                                            "RAG_G_CUTOFF_VALUE_HIGH "+                                                                                                                                                                    
                                    " ) values ( "+
                                        "null,"+     
                                        "'"+transitionId+"',"+                           
                                        "'"+customParameters.PARAMETER_NAME+"',"+                            
                                        "'"+customParameters.DESCRIPTION+"',"+
                                        " 'NA',"+
                                        " 'NA',"+
                                        "'"+customParameters.RESOURCE_TYPE_MEASURED+"',"+                            
                                        "'"+customParameters.EVALUATION_TECHNIQUE_MANUAL+"', "+  
                                        "'"+customParameters.EVALUATION_EXPRESSION+"',  "+   
                                        "'"+customParameters.RAG_R_OPERATOR_1+"',  "+   
                                        "'"+customParameters.RAG_R_OPERATOR_2+"',"+                            
                                        "'"+customParameters.RAG_R_CUTOFF_VALUE_LOW+"',"+
                                        "'"+customParameters.RAG_R_CUTOFF_VALUE_HIGH+"',"+                            
                                        "'"+customParameters.RAG_A_OPERATOR_1+"', "+  
                                        "'"+customParameters.RAG_A_OPERATOR_2+"',  "+                                                                
                                        "'"+customParameters.RAG_A_CUTOFF_VALUE_LOW+"',"+                            
                                        "'"+customParameters.RAG_A_CUTOFF_VALUE_HIGH+"',"+
                                        "'"+customParameters.RAG_G_OPERATOR_1+"',"+                            
                                        "'"+customParameters.RAG_G_OPERATOR_2+"', "+  
                                        "'"+customParameters.RAG_G_CUTOFF_VALUE_LOW +"',  "+ 
                                        "'"+customParameters.RAG_G_CUTOFF_VALUE_HIGH +"'  "+                                                                                                                                                       
                                    ") ";
              
              
                      wpdlog("query for inserting to  PARAMETER_CUSTOM table "+query);

                      conn.query(query)
                                  .then((result1)=>{
                                            conn.query(" SELECT LAST_INSERT_ID() ")
                                                    .then((result)=>{                                    

                                                    var objToJson = result;
                                                    var response = [];
                                                    for (var key in result) {
                                                        //wpdlog("Result "+result[key]);
                                                        response.push(result[key]);
                                                    }
                                                    objToJson.response = response;
                                                    finalresponse = JSON.stringify(objToJson);                             
                                            
                                                    })  
                                                    .catch(err => {
                                                        //handle error
                                                        wpdlog(err);
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                            })
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
    
            
        conn.release();    
        res.end(finalresponse);
          
    }).catch(err => {
          //not connected
          wpdlog(err);
    });

}));

// #####################################  GET PARAMETER CUSTOM DATA ############################################################
app.get('/tnt/parameterDataCustom/:id', accessHandler((req, res) => { 

    //Maria db
    
    var parameterId = req.params.id;

    pool.getConnection()
    .then(conn=>{

                    const query =  ' select ' +
                                        ' PARAMETER_CUSTOM_ID , '+
                                        ' COALESCE(PARAMETER_NAME    ,"") as PARAMETER_NAME    , '+
                                        ' COALESCE(DESCRIPTION  ,"") as DESCRIPTION  , '+
                                        ' COALESCE(RESOURCE_TYPE_MEASURED  ,"") as RESOURCE_TYPE_MEASURED  , '+
                                        ' COALESCE(EVALUATION_TECHNIQUE_MANUAL  ,"") as EVALUATION_TECHNIQUE_MANUAL  , '+            
                                        ' COALESCE(EVALUATION_EXPRESSION   ,"") as EVALUATION_EXPRESSION  ,  '+                                        
                                        ' COALESCE(RAG_R_OPERATOR_1   ,"") as RAG_R_OPERATOR_1   , '+
                                        ' COALESCE(RAG_R_OPERATOR_2  ,"") as RAG_R_OPERATOR_2  , '+
                                        ' COALESCE(RAG_R_CUTOFF_VALUE_LOW  ,"") as RAG_R_CUTOFF_VALUE_LOW  , '+
                                        ' COALESCE(RAG_R_CUTOFF_VALUE_HIGH  ,"") as RAG_R_CUTOFF_VALUE_HIGH  , '+            
                                        ' COALESCE(RAG_A_OPERATOR_1  ,"") as RAG_A_OPERATOR_1   ,'+                                        
                                        ' COALESCE(RAG_A_OPERATOR_2   ,"") as RAG_A_OPERATOR_2   ,'+
                                        ' COALESCE(RAG_A_CUTOFF_VALUE_LOW  ,"") as RAG_A_CUTOFF_VALUE_LOW  , '+
                                        ' COALESCE(RAG_A_CUTOFF_VALUE_HIGH  ,"") as RAG_A_CUTOFF_VALUE_HIGH  , '+
                                        ' COALESCE(RAG_G_OPERATOR_1  ,"") as RAG_G_OPERATOR_1  , '+            
                                        ' COALESCE(RAG_G_OPERATOR_2  ,"") as RAG_G_OPERATOR_2  ,  '+
                                        ' COALESCE(RAG_G_CUTOFF_VALUE_LOW  ,"") as RAG_G_CUTOFF_VALUE_LOW  , '+
                                        ' COALESCE(RAG_G_CUTOFF_VALUE_HIGH  ,"") as RAG_G_CUTOFF_VALUE_HIGH  '+                                                                                        
                                    ' from '+
                                        '  PARAMETER_CUSTOM  '+
                                    ' where PARAMETER_CUSTOM_ID ='+parameterId    ;
                            
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{
                                            var objToJson = result;
                                            var response = [];
                                            for (var key in result) {
                                            //wpdlog("Result "+result[key]);
                                            response.push(result[key]);
                                            }
                                            objToJson.response = response;
                                            finalresponse = JSON.stringify(objToJson);     
                                            wpdlog("finalresponse parameter global.... "+finalresponse);
                                            conn.release();    
                                            res.end(finalresponse);                                               
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          wpdlog(err);
          //not connected
      });    
    //Maria db
 
}));

// #####################################UPDATE TRANSITION PARAMETER CUSTOM ############################################################
app.put('/tnt/parameterEditCustom/:id', accessHandler((req, res) => { 


    var parameterId = req.params.id;
    //Maria db

    pool.getConnection()
    .then(conn=>{



        const query = "update  PARAMETER_CUSTOM " + 
                        "set PARAMETER_NAME ='" + req.body.PARAMETER_NAME + "', " +
                            "DESCRIPTION  ='" + req.body.DESCRIPTION + "',  " +     
                            "RESOURCE_TYPE_MEASURED  ='" + req.body.RESOURCE_TYPE_MEASURED + "',  " +     
                            "EVALUATION_TECHNIQUE_MANUAL  ='" + req.body.EVALUATION_TECHNIQUE_MANUAL + "',  " +     
                            "EVALUATION_EXPRESSION  ='" + req.body.EVALUATION_EXPRESSION + "',  " +     
                            "RAG_R_OPERATOR_1  ='" + req.body.RAG_R_OPERATOR_1 + "',  " +    
                            "RAG_R_OPERATOR_2  ='" + req.body.RAG_R_OPERATOR_2 + "',  " +     
                            "RAG_R_CUTOFF_VALUE_LOW  ='" + req.body.RAG_R_CUTOFF_VALUE_LOW + "',  " +     
                            "RAG_R_CUTOFF_VALUE_HIGH  ='" + req.body.RAG_R_CUTOFF_VALUE_HIGH + "',  " +     
                            "RAG_A_OPERATOR_1  ='" + req.body.RAG_A_OPERATOR_1 + "',  " +     
                            "RAG_A_OPERATOR_2  ='" + req.body.RAG_A_OPERATOR_2 + "',  " +     
                            "RAG_A_CUTOFF_VALUE_LOW  ='" + req.body.RAG_A_CUTOFF_VALUE_LOW + "',  " +     
                            "RAG_A_CUTOFF_VALUE_HIGH  ='" + req.body.RAG_A_CUTOFF_VALUE_HIGH + "',  " +     
                            "RAG_G_OPERATOR_1  ='" + req.body.RAG_G_OPERATOR_1 + "',  " +     
                            "RAG_G_OPERATOR_2  ='" + req.body.RAG_G_OPERATOR_2 + "',  " +     
                            "RAG_G_CUTOFF_VALUE_LOW  ='" + req.body.RAG_G_CUTOFF_VALUE_LOW + "',  " +     
                            "RAG_G_CUTOFF_VALUE_HIGH  ='" + req.body.RAG_G_CUTOFF_VALUE_HIGH + "'  " +                                                                   
                        "where  "+
                            "PARAMETER_CUSTOM_ID ='" +parameterId +"' " ; 
    
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result1)=>{
                                    conn.query(" SELECT LAST_INSERT_ID() ")
                                    .then((result)=>{
                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);  
                                    })
                                    .catch(err => {
                                                        wpdlog(err);
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                    })                                                                                            
                                  })
                                  .catch(err => {
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db
  
}));


//Generate Health & Readiness Excel Tracker For Multiple Reports

app.get('/getExcelHealthReadinessTracker/:IntegrationID/:paramId/:appIds/:account', accessHandler((req, res) => { 

    var IntegrationID = req.params.IntegrationID;
    var parameterId = "";
    var appIds = "";
    var lisfofsheetname = []
    var account = decodeURIComponent(req.params.account);
    var today = displayDayDDMONYYYY();

    var obj = {};
    
    wpdlog("today "+today);

    wpdlog("account "+account);
    

    var account = account.split(' ').join('');
    wpdlog("after account "+account);

    //console.log("req.params.paramId "+req.params.paramId)
    if (req.params.paramId != 'all'){
        parameterId = " and PARAMETER_CUSTOM_ID='"+req.params.paramId +"' ";  
    }


    if (req.params.appIds != 'all'){
        // appIds  =  " and AppUNID in ("+decodeURIComponent(req.params.appIds) +" ) ";  
        appIds  =  " in ("+decodeURIComponent(req.params.appIds) +" ) ";  
    }    

    var wb = new xl.Workbook();
    //const filename = "HealthAndReadinessReport"+IntegrationID.replace(/\s/g,'')+".xlsx";
    const filename = "HRReport-"+account+"-"+today+".xlsx";
    var filePath = __dirname+'\\'+filename;
    
    
    var myStyle = wb.createStyle({
        fill: {
          type: 'pattern',
          patternType: 'solid',
          bgColor: '#1D3649',
          fgColor: '#1D3649',
        },
        font: {
          name: 'Arial',
           size: 10 ,
          bold: true,
          color: 'FFFFFF',
        },
        alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: true,
        },
      });

      var myAnswerStyle = wb.createStyle({
        alignment: {
            horizontal: 'left',
            vertical: 'center',
            wrapText: true,
        },
      });

      
      var myStyleRed = wb.createStyle({
        fill: {
         type: 'pattern',
         patternType: 'solid',
         bgColor: '#FF0000',
         fgColor: '#FF0000',
        },
        });
      
        var myStyleGreen = wb.createStyle({
          fill: {
           type: 'pattern',
           patternType: 'solid',
           bgColor: '#00FF00',
           fgColor: '#00FF00',
          },
          });
      
          var myStyleAmber = wb.createStyle({
            fill: {
             type: 'pattern',
             patternType: 'solid',
             bgColor: '#FFCC00',
             fgColor: '#FFCC00',
            },
            });
            const data = [
                {   "ColumnName": "Profile Name",   "Format": "Value" },   
                {   "ColumnName": "Client Name",   "Format": "ClientName"},   
                {   "ColumnName": "Sector",   "Format": "Sector"},    
                {   "ColumnName": "Industry",   "Format": "Industry"},
                {   "ColumnName": "IOT",   "Format": "IOT"},   
                ];
              var ws = wb.addWorksheet('Profile'); 
              ws.column(1).setWidth(20);
              ws.column(2).setWidth(40);
            
              ws.cell( 1, 1, 1, 2,true).string('Health & Readiness Indicator Category List For Tracking ')
              ws.cell( 1, 1).style(myStyle);
              ws.cell( 2, 1, 2, 2,true)
              ws.row(2).setHeight(2);
              ws.cell( 3, 1).style(myStyle);
              ws.cell( 3, 2).style(myStyle);


            


              var queryProfileKeyword ="select * from transitionprofile WHERE IntegrationID='"+ IntegrationID +"'";  
              ResourceName =  " CONCAT(CONCAT('Category : ', STScopeLevel),CONCAT(' - ',CONCAT('ST Scope : ', STScope) ),CONCAT(' - ',CONCAT('ST Details : ', STDetailedScope) ),CONCAT(' - ', CONCAT('ST Activity : ', STScopeActivity))) as  RESOURCE_NAME "
              ResourceOtherName =  " CONCAT(CONCAT('Category : ', STScopeLevel),CONCAT(' - ',CONCAT('ST Scope : ', Others) ),CONCAT(' - ',CONCAT('ST Details : ', STDetailedScope) ),CONCAT(' - ', CONCAT('ST Activity : ', STScopeActivity))) as  RESOURCE_NAME "
              
              var queryAllResourceTypeUnion =   "(select 'trainee' as RESOURCE_TYPE_MEASURED , Trainee_SNO as RESOURCE_ID, Trainee_Name as RESOURCE_NAME, 'NA' as RESOURCE_STATUS "+
                                                "from  traineeinfo where Trainee_IntegrationID='"+IntegrationID+"' "+
                                            ")  "+  
                                            "UNION "+
                                            "(select 'application' as RESOURCE_TYPE_MEASURED , AppUNID as RESOURCE_ID, AppName as RESOURCE_NAME, 'NA' as RESOURCE_STATUS "+
                                                "from  application_information where IntegrationID='"+IntegrationID+"'  "+" and AppUNID "+ appIds +
                                            ") "+
                                            "UNION "+
                                            "(select 'ST-scope' as RESOURCE_TYPE_MEASURED , MasterSTInfoid as RESOURCE_ID, STScope as RESOURCE_NAME, 'NA' as RESOURCE_STATUS "+
                                                "from  masterstinfo where IntegrationID='"+IntegrationID+"'  "+" and MasterSTInfoid " + appIds +
                                            ") "+
                                            // "(select 'ST-sprint-scope' as RESOURCE_TYPE_MEASURED, IntegrationID as RESOURCE_ID, 'STScope' as RESOURCE_NAME, 'NA' as RESOURCE_STATUS "+
                                            //    "from  transitionprofile "+
                                            //     " where IntegrationID='"+IntegrationID+"' "+
                                            // ") "+
                                            "UNION "+                                                      
                                            "(select 'ST-scope-process' as RESOURCE_TYPE_MEASURED , MasterSTInfoid as RESOURCE_ID,"+ResourceOtherName+ ", 'NA' as RESOURCE_STATUS "+
                                                "from  masterstinfo where IntegrationID='"+IntegrationID+"'  "+" and STScope = 'Others' and MasterSTInfoid " + appIds +"and STScopeLevel='Process'"+
                                            ") "+
                                            "UNION "+                                                      
                                            "(select 'ST-scope-process' as RESOURCE_TYPE_MEASURED , MasterSTInfoid as RESOURCE_ID,"+ResourceName+ ", 'NA' as RESOURCE_STATUS "+
                                                "from  masterstinfo where IntegrationID='"+IntegrationID+"'  "+" and STScope <> 'Others' and MasterSTInfoid " + appIds +"and STScopeLevel='Process'"+
                                            ") "+
                                            "UNION "+
                                            "(select 'ST-scope-metrics' as RESOURCE_TYPE_MEASURED , MasterSTInfoid as RESOURCE_ID,"+ResourceName+" , 'NA' as RESOURCE_STATUS "+
                                                "from  masterstinfo where IntegrationID='"+IntegrationID+"'  "+" and STScope <> 'Others' and MasterSTInfoid " + appIds +"and STScopeLevel='Metrics'"+
                                            ") "+
                                            "UNION "+
                                            "(select 'ST-scope-metrics' as RESOURCE_TYPE_MEASURED , MasterSTInfoid as RESOURCE_ID,"+ResourceOtherName+" , 'NA' as RESOURCE_STATUS "+
                                                "from  masterstinfo where IntegrationID='"+IntegrationID+"'  "+" and STScope = 'Others' and MasterSTInfoid " + appIds +"and STScopeLevel='Metrics'"+
                                            ") "+
                                            "UNION "+
                                            "(select 'ST-scope-reports' as RESOURCE_TYPE_MEASURED , MasterSTInfoid as RESOURCE_ID, "+ResourceName+ " , 'NA' as RESOURCE_STATUS "+
                                                "from  masterstinfo where IntegrationID='"+IntegrationID+"'  "+" and STScope <> 'Others' and MasterSTInfoid " + appIds +"and STScopeLevel='Reports'"+
                                            ") "+
                                            "UNION "+
                                            "(select 'ST-scope-reports' as RESOURCE_TYPE_MEASURED , MasterSTInfoid as RESOURCE_ID, "+ResourceOtherName+ " , 'NA' as RESOURCE_STATUS "+
                                                "from  masterstinfo where IntegrationID='"+IntegrationID+"'  "+" and STScope = 'Others' and MasterSTInfoid " + appIds +"and STScopeLevel='Reports'"+
                                            ") "+
                                            "UNION "+
                                            "(select 'ST-scope-tools' as RESOURCE_TYPE_MEASURED , MasterSTInfoid as RESOURCE_ID,"+ResourceName+ " , 'NA' as RESOURCE_STATUS "+
                                                "from  masterstinfo where IntegrationID='"+IntegrationID+"'  "+" and STScope <> 'Others' and MasterSTInfoid " + appIds +"and STScopeLevel='Tools'"+
                                            ") "+
                                            "UNION "+
                                            "(select 'ST-scope-tools' as RESOURCE_TYPE_MEASURED , MasterSTInfoid as RESOURCE_ID,"+ResourceOtherName+ " , 'NA' as RESOURCE_STATUS "+
                                                "from  masterstinfo where IntegrationID='"+IntegrationID+"'  "+" and STScope = 'Others' and MasterSTInfoid " + appIds +"and STScopeLevel='Tools'"+
                                            ") "+
                                            "UNION "+
                                            "(select 'ST-scope-Governance' as RESOURCE_TYPE_MEASURED , MasterSTInfoid as RESOURCE_ID,"+ResourceName+ " , 'NA' as RESOURCE_STATUS "+
                                                "from  masterstinfo where IntegrationID='"+IntegrationID+"'  "+" and STScope <> 'Others' and MasterSTInfoid " + appIds +"and STScopeLevel='Tools'"+
                                            ") "+
                                            "UNION "+
                                            "(select 'ST-scope-Governance' as RESOURCE_TYPE_MEASURED , MasterSTInfoid as RESOURCE_ID,"+ResourceOtherName+ " , 'NA' as RESOURCE_STATUS "+
                                                "from  masterstinfo where IntegrationID='"+IntegrationID+"'  "+" and STScope = 'Others' and MasterSTInfoid " + appIds +"and STScopeLevel='Tools'"+
                                            ") "+
                                            "UNION "+
                                            "(select 'epic' as RESOURCE_TYPE_MEASURED , epicUNID as RESOURCE_ID, epicName as RESOURCE_NAME, rag as RESOURCE_STATUS "+
                                               "from  epics "+
                                                 " where IntegrationID='"+IntegrationID+"' "+
                                                 ") "+                                                
                                            "UNION "+
                                            "(select 'sprint' as RESOURCE_TYPE_MEASURED, sp.sprintUNID as RESOURCE_ID, CONCAT(ep.epicName,CONCAT('-', sp.sprintName)) as RESOURCE_NAME, sp.rag as RESOURCE_STATUS "+
                                               "from  epics as ep, sprint as sp "+
                                                " where ep.IntegrationID='"+IntegrationID+"' "+
                                                   " and sp.epicUNID = ep.epicUNID "+
                                            ") "+
                                            "UNION "+
                                            "(select 'transition' as RESOURCE_TYPE_MEASURED, IntegrationID as RESOURCE_ID, 'Transition' as RESOURCE_NAME, 'NA' as RESOURCE_STATUS "+
                                               "from  transitionprofile "+
                                                " where IntegrationID='"+IntegrationID+"' "+
                                            ") "+
                                            "UNION "+
                                            "(select 'sprintbacklog' as RESOURCE_TYPE_MEASURED , 'sprintbacklog' as RESOURCE_ID, 'Sprint Backlog' as RESOURCE_NAME, 'NA' as RESOURCE_STATUS "+
                                               "from  transitionprofile "+
                                                " where IntegrationID='"+IntegrationID+"' "+
                                            ") "+
                                            "UNION "+
                                            "(select 'servicebacklog' as RESOURCE_TYPE_MEASURED , 'servicebacklog' as RESOURCE_ID, 'Service Backlog' as RESOURCE_NAME, 'NA' as RESOURCE_STATUS "+
                                               "from  transitionprofile "+
                                                 " where IntegrationID='"+IntegrationID+"' "+
                                            ") "+

                                            "UNION "+
                                            "(select 'ST-sprint' as RESOURCE_TYPE_MEASURED, sp.sprintUNID as RESOURCE_ID, CONCAT(ep.epicName,CONCAT('-', sp.sprintName)) as RESOURCE_NAME, sp.rag as RESOURCE_STATUS "+
                                               "from  epics as ep, sprint as sp "+
                                                " where ep.IntegrationID='"+IntegrationID+"' "+
                                                   " and sp.epicUNID = ep.epicUNID and scopelevel='ST'"+
                                            ") "+

                                            "UNION "+
                                            "(select 'AT-sprint' as RESOURCE_TYPE_MEASURED, sp.sprintUNID as RESOURCE_ID, CONCAT(ep.epicName,CONCAT('-', sp.sprintName)) as RESOURCE_NAME, sp.rag as RESOURCE_STATUS "+
                                               "from  epics as ep, sprint as sp "+
                                                " where ep.IntegrationID='"+IntegrationID+"' "+
                                                   " and sp.epicUNID = ep.epicUNID and scopelevel='AT'"+
                                            ") "+
                                            
                                            "UNION "+
                                            "(select 'Others-sprint' as RESOURCE_TYPE_MEASURED, sp.sprintUNID as RESOURCE_ID, CONCAT(ep.epicName,CONCAT('-', sp.sprintName)) as RESOURCE_NAME, sp.rag as RESOURCE_STATUS "+
                                               "from  epics as ep, sprint as sp "+
                                                " where ep.IntegrationID='"+IntegrationID+"' "+
                                                   " and sp.epicUNID = ep.epicUNID and scopelevel='Others'"+
                                            ") "+
                                            "UNION "+
                                            "(select 'closure' as RESOURCE_TYPE_MEASURED , 'closure' as RESOURCE_ID, 'closure' as RESOURCE_NAME, 'NA' as RESOURCE_STATUS "+
                                               "from  transitionprofile "+
                                                  " where IntegrationID='"+IntegrationID+"' "+
                                            ") " ;
                                                                                                                                                                                                                                                                 
                                    //   console.log("queryAllResourceTypeUnion")     
                                    //   console.log(queryAllResourceTypeUnion)     
                                    //   console.log("queryAllResourceTypeUnion")     
             var queryForEpicSprintAppStatus = "select 'application' as RESOURCE_TYPE_MEASURED, sa.RESOURCE_ID as RESOURCE_ID, sa.RESOURCE_NAME as RESOURCE_NAME,  sa.EPIC_NAME as EPIC_NAME, sa.SPRINT_ID as SPRINT_ID, sa.SPRINT_NAME as SPRINT_NAME, aps.STATUS "+
                                                " from "+
                                                        " (select 'application' as RESOURCE_TYPE_MEASURED, sprint_app.RESOURCE_ID as RESOURCE_ID, sprint_app.RESOURCE_NAME as RESOURCE_NAME,  sprint_epic.EPIC_NAME as EPIC_NAME, sprint_epic.SPRINT_ID as SPRINT_ID, sprint_epic.SPRINT_NAME as SPRINT_NAME, sprint_app.Scope_UNID "+
                                                        "      from "+
                                                        "             (select EPICS.epicUNID EPIC_ID, epicName EPIC_NAME, sprintUNID SPRINT_ID, sprintName SPRINT_NAME "+
                                                                                "from EPICS LEFT JOIN SPRINT  "+
                                                                                "ON EPICS.epicUNID = SPRINT.epicUNID "+
                                                                                "and EPICS.IntegrationID='"+IntegrationID+"' "+"  "+
                                                                "    ) sprint_epic, "+
                                                                    "( select  app_info.AppUNID as RESOURCE_ID, app_info.AppName as RESOURCE_NAME, sprint_scope.sprintUNID as SPRINT_ID,  sprint_scope.Scope_UNID "+
                                                                                " from  "+
                                                                                        "(select * from APPLICATION_INFORMATION where APPLICATION_INFORMATION.IntegrationID =  '"+IntegrationID+"' and AppUNID   "+appIds+"   ) as app_info, "+
                                                                                        "(select * from SPRINTSCOPE where SPRINTSCOPE.Scope_IntegrationID = '"+IntegrationID+"' and AppUNID "+appIds+" ) as sprint_scope "+
                                                                                " where app_info.AppUNID = sprint_scope.AppUNID "+
                                                                        ") sprint_app   "+                                                          
                                                        "      where sprint_app. SPRINT_ID = sprint_epic.SPRINT_ID "+
                                                        " )  sa "+
                                                        " LEFT JOIN "+
                                                        "( "+
                                                             "select Scope_UNID, status   "+
                                                             "   from  "+
                                                                    "appln_level_sprint_plan "+
                                                                         "where IntegrationID = '"+IntegrationID+"'  "+ 
                                                         ") aps"+
                                                         " ON "+
                                                         "( "+
                                                             " sa.Scope_UNID = aps.Scope_UNID "+
                                                         " ) ";    
              
              
                    // console.log("queryForEpicSprintAppStatus")
                    // console.log(queryForEpicSprintAppStatus)
                    // console.log("queryForEpicSprintAppStatus")
              var queryForOtherDetails = 
              "select param_res_q_sprint.PARAMETER_ID, param_res_q_sprint.PARAMETER_NAME, param_res_q_sprint.RESOURCE_TYPE_MEASURED,  param_res_q_sprint.RESOURCE_ID, param_res_q_sprint.RESOURCE_NAME, param_res_q_sprint.RESOURCE_STATUS, param_res_q_sprint.Q_ID_AND_QUESTION_NAME,COALESCE(param_res_q_sprint.EPIC_NAME,'Not mapped') as EPIC_NAME, COALESCE(param_res_q_sprint.SPRINT_NAME,'Not mapped') as SPRINT_NAME, rqt.MULTIPLE_LOGICAL_COLS, rqt.RAG, param_res_q_sprint.STATUS  as STATUS "+
                                         "from "+
                                               " ( "+
                                                    "select param_resource_question.PARAMETER_ID, param_resource_question.PARAMETER_NAME, param_resource_question.RESOURCE_TYPE_MEASURED,  param_resource_question.RESOURCE_ID, param_resource_question.RESOURCE_NAME, param_resource_question.RESOURCE_STATUS, param_resource_question.Q_ID_AND_QUESTION_NAME, app_resource_sprint.EPIC_NAME, app_resource_sprint.SPRINT_NAME, app_resource_sprint.STATUS  "+
                                                           " from "+
                                                                  " (   "+
                                                                          "select p.PARAMETER_CUSTOM_ID PARAMETER_ID, p.PARAMETER_NAME, p.RESOURCE_TYPE_MEASURED, r.RESOURCE_ID, r.RESOURCE_NAME, r.RESOURCE_STATUS, p.Q_ID_AND_QUESTION_NAME "+
                                                                                 "from  "+   
                                                                                        "(select PARAMETER_CUSTOM_ID, PARAMETER_NAME, RESOURCE_TYPE_MEASURED, CONCAT(GROUP_CONCAT(CONCAT(READINESS_QUESTION_CUSTOM_ID,'-8*1!$', READINESS_QUESTION, '*9$*1!')),',') as Q_ID_AND_QUESTION_NAME "+ // at the end additional comma
                                                                                                  "from "+
                                                                                                        "  READINESS_QUESTION_CUSTOM  RIGHT JOIN "+	
                                                                                                        " ( select PARAMETER_CUSTOM_ID, PARAMETER_NAME, RESOURCE_TYPE_MEASURED, TRANSITION_ID  "+
                                                                                                               "from PARAMETER_CUSTOM  "+
                                                                                                                     "where PARAMETER_CUSTOM.TRANSITION_ID = '"+IntegrationID+"' "+ 
                                                                                                                      parameterId +" "+
                                                                                                                     " and ADOPTED_PARAMETER in ('Y', 'NA') "+
                                                                                                         ") as pc  "+                                                                                                			   
                                                                                                  "ON (pc.TRANSITION_ID = READINESS_QUESTION_CUSTOM.TRANSITION_ID  "+                     
                                                                                                  "     and READINESS_QUESTION_CUSTOM.TRANSITION_ID = '"+IntegrationID+"' "+
                                                                                                  "     and pc.PARAMETER_CUSTOM_ID = READINESS_QUESTION_CUSTOM.READINESS_QUESTION_CATEGORY "+
                                                                                                  "     and READINESS_QUESTION_CUSTOM.READINESS_QUESTION_ADOPTED in ('Y', 'NA') "+
                                                                                                  ")  "+                         
                                                                                                  "GROUP BY PARAMETER_NAME  "+
                                                                                        ")  as p, "+
                                                                                        "(	"+		
                                                                                             queryAllResourceTypeUnion +
                                                                                        ") as r "+
                                                                                  "where p. RESOURCE_TYPE_MEASURED = r.RESOURCE_TYPE_MEASURED "+                        
                                                                  ") param_resource_question "+
                                                                  "LEFT JOIN "+
                                                                  "(  "+
                                                                       queryForEpicSprintAppStatus +
                                                                  ") as app_resource_sprint   "+       
                                                                 "  ON ( "+
                                                                          " param_resource_question.RESOURCE_ID = app_resource_sprint.RESOURCE_ID "+           
                                                                          "  and param_resource_question.RESOURCE_TYPE_MEASURED  = app_resource_sprint.RESOURCE_TYPE_MEASURED "+
                                                                 "     ) "+                             
                                                     ")  as param_res_q_sprint "+
                                                     "LEFT JOIN READINESS_QUESTION_TRACKER as rqt "+
                                                     "ON "+
                                                     "(param_res_q_sprint.PARAMETER_ID = rqt.PARAMETER_CUSTOM_ID  "+
                                                      "and param_res_q_sprint.RESOURCE_ID = rqt.READINESS_QUESTION_MEASURED_AGAINST_PARAMETER_VALUE "+
                                                     " ) "+                 
                " ORDER BY param_res_q_sprint.PARAMETER_NAME,param_res_q_sprint.EPIC_NAME, param_res_q_sprint.SPRINT_NAME, param_res_q_sprint.RESOURCE_NAME  ";


                // console.log("queryForOtherDetails")
                // console.log(queryForOtherDetails)
                // console.log("queryForOtherDetails")

              pool.getConnection().then(conn => {        
                 conn.query(queryProfileKeyword).then((ProfileData) => {       
                       var ProfileDataVal=JSON.parse(JSON.stringify(ProfileData));      
                       for (let i = 0; i < data.length; i += 1) {
                            ws.cell(i + 3, 1).string(data[i].ColumnName);                  
                            if (data[i].Format !== 'Value') {
                                ws.cell(i + 3, 2).string(ProfileDataVal[0][data[i].Format]);
                            } else {
                                ws.cell(i + 3, 2).string(data[i].Format);
                            }    
                        }
                        //ws.cell(8, 1).string("Parameter"); 
                        //ws.cell(8, 2).string(parameterNameOverall); 
                        ws.cell(1, 1, 7, 2).style({border: {
                                            left: { style: 'thin'},        
                                            right: { style: 'thin'},  
                                            top: { style: 'thin'},  
                                            bottom: { style: 'thin'} 
                                            }});   

                        // OTHER TABS            
                        wpdlog(queryForOtherDetails);                              
                        conn.query(queryForOtherDetails).then((OtherDetails) => {       
                                var OtherDetailVal=JSON.parse(JSON.stringify(OtherDetails)); 

          
                                var rowcounter = 1;
                                var colCounter = 1;
                                var lastSheetName = "";   
                                // console.log("OtherDetailVal" )
                                // console.log(OtherDetails )
                                // console.log("OtherDetailVal" )
                                var lisfofsheetnameincrement = 0
                                var updatedSheetName 
                                for(let i=0; i<OtherDetails.length;i++){
                                    //console.log("OtherDetails[i].resourceTypeMeasured"+OtherDetails[i].resourceTypeMeasured)
                                    if ((i==0)  || (lastSheetName !=  OtherDetails[i].PARAMETER_NAME)){//Create the first tab

                                        //Draw the border for the existing sheet before creating a new sheet
                                        
                                        lisfofsheetname[i] = OtherDetails[i].PARAMETER_NAME .substring(0,29)
                                                    
                                        if(lisfofsheetname.includes(OtherDetails[i].PARAMETER_NAME.substring(0,29))  === true
                                             && OtherDetails[i].PARAMETER_NAME.length >29 ){
                                            lisfofsheetnameincrement = lisfofsheetnameincrement +1
                                            updatedSheetName = ''
                                            updatedSheetName = OtherDetails[i].PARAMETER_NAME.substring(0,26)+"-"+(lisfofsheetnameincrement)                                            
                                        }else{
                                            updatedSheetName = ''
                                            updatedSheetName = OtherDetails[i].PARAMETER_NAME.substring(0,29)
                                        }
//                                          console.log("lisfofsheetname ===" + lisfofsheetname)
// console.log("updatedSheetName   = " + updatedSheetName)
                                        if (i>0){
                                            
                                                if ((OtherDetails[i-1].RESOURCE_TYPE_MEASURED == 'transition' ) || (OtherDetails[i-1].RESOURCE_TYPE_MEASURED == 'sprintbacklog' ) || (OtherDetails[i-1].RESOURCE_TYPE_MEASURED == 'servicebacklog' ) || (OtherDetails[i-1].RESOURCE_TYPE_MEASURED == 'closure' )) {                                                                                
                                                    
                                                    ws.cell(1, 1, rowcounter, 2).style({ 
                                                        border: {
                                                                 left: { style: 'thin'},        
                                                                 right: { style: 'thin'},  
                                                                 top: { style: 'thin'},  
                                                                 bottom: { style: 'thin'} 
                                                        },
                                                        alignment: {
                                                            wrapText: true,
                                                            horizontal: 'center',
                                                        },
                                                    });

                                                    //Left aligned
                                                    ws.cell(3, 1, rowcounter, 2).style({ 

                                                        alignment: {
                                                            wrapText: true,
                                                            horizontal: 'left',
                                                        },
                                                    });

                                                    ws.column(1).setWidth(150);

                                                }else{       
                                                    ws.cell(1, 1, rowcounter-1, colCounter).style({ 
                                                        border: {
                                                                left: { style: 'thin'},        
                                                                right: { style: 'thin'},  
                                                                top: { style: 'thin'},  
                                                                bottom: { style: 'thin'} 
                                                        },
                                                        alignment: {
                                                            wrapText: true,
                                                            horizontal: 'center',
                                                        },
                                                    });   
                                                    
                                                    //Left aligned
                                                    ws.cell(2, 1, rowcounter-1, colCounter).style({ 
                                                        alignment: {
                                                            wrapText: true,
                                                            horizontal: 'left',
                                                        },
                                                    });

                                                }


                                        }

                                        
                                        
                                        ws = wb.addWorksheet(updatedSheetName);
                                        //   ws = wb.addWorksheet(OtherDetails[i].PARAMETER_NAME.substring(0,29)); 
                                          lastSheetName = OtherDetails[i].PARAMETER_NAME   ;   
                                          console.log('lastSheetName ='+lastSheetName)                                       
                                          rowcounter = 1;
                                          Excelrownum = 2
                                        
                                          ws.cell(1,1,1,7,true)
                                          .string("Health & Readiness Traker : "+OtherDetails[i].PARAMETER_NAME)
                                        .style(wb.createStyle({
                                            font : {    
                                                bold    :   true,
                                                color   :   '#1D3649',                                                
                                                size    :   14
                                            },
                                            alignment :{
                                                horizontal: ['left'],
                                                indent : 3
                                                // vertical: 'center',
                                                // wrapText: true,
                                            }
                                        }))  
                                         
                                        

                                        //   ws.column(1).setWidth(150)
                                          if (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'application'){ 
                                              console.log("1")
                                               
                                                ws.cell(Excelrownum,1).style(myStyle);
                                                ws.cell(Excelrownum,1).string("EPIC");
                                                ws.cell(Excelrownum,2).style(myStyle);
                                                ws.cell(Excelrownum,2).string("SPRINT");
                                                ws.cell(Excelrownum,3).style(myStyle);
                                                ws.cell(Excelrownum,3).string("APPS");
                                                ws.cell(Excelrownum,4).style(myStyle);
                                                ws.cell(Excelrownum,4).string("STATUS");
                                                ws.cell(Excelrownum,5).style(myStyle);
                                                ws.cell(Excelrownum,5).string("RAG");
                                                colCounter = 5;
                                          }else if ((OtherDetails[i].RESOURCE_TYPE_MEASURED == 'epic') || (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'sprint')
                                          || (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'ST-sprint')
                                          || (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'AT-sprint') ){
                                                ws.cell(Excelrownum,1).style(myStyle);
                                                ws.cell(Excelrownum,1).string("RESOURCE");
                                                ws.cell(Excelrownum,2).style(myStyle);
                                                ws.cell(Excelrownum,2).string("STATUS");
                                                ws.cell(Excelrownum,3).style(myStyle);
                                                ws.cell(Excelrownum,3).string("RAG");                                                
                                                colCounter = 3;                                          
                                          }else if ((OtherDetails[i].RESOURCE_TYPE_MEASURED == 'transition' ) || (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'sprintbacklog' ) || (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'servicebacklog' ) || (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'closure' )) {
                                               
                                                ws.cell(Excelrownum,1).style(myStyle);
                                                ws.cell(Excelrownum,1).string("Overall RAG");
                                              
                                                ws.cell(Excelrownum,1).style(myStyle);
                                                ws.cell(Excelrownum,1).string("QUESTION");
                                                ws.cell(Excelrownum,2).style(myStyle);
                                                ws.cell(Excelrownum,2).string("ANSWER");
                                                ws.column(1).setWidth(150);
                                                                                                    
                                                colCounter = 2;
                                          }else{
                                                ws.cell(Excelrownum,1).style(myStyle);
                                                ws.cell(Excelrownum,1).string("RESOURCE");
                                                ws.cell(Excelrownum,2).style(myStyle);
                                                ws.cell(Excelrownum,2).string("RAG");
                                                colCounter = 2;
                                          }    
                                        
                                          
                                          if (OtherDetails[i].Q_ID_AND_QUESTION_NAME != undefined){
                                                var qidQuestion = OtherDetails[i].Q_ID_AND_QUESTION_NAME;
                                                var qid_commma_questions = (qidQuestion).split("*9$*1!,");
                                                wpdlog("qid_commma_questions.length "+qid_commma_questions.length);


                                                colCounter = colCounter + qid_commma_questions.length-1;                                            

                                                for(var j = 0; j<qid_commma_questions.length-1; j++){
                                                        var qid_commma_questions_tmp = qid_commma_questions[j];
                                                        if (qid_commma_questions_tmp != 'undefined'  || qid_commma_questions_tmp != null || qid_commma_questions_tmp != ''){
                                                               
                                                                //wpdlog("Before spliting "+qid_commma_questions_tmp);
                                                                var qid_and_questions = (qid_commma_questions_tmp).split("-8*1!$");
                                                                //wpdlog("After spliting "+qid_commma_questions_tmp);
                                                                console.log(OtherDetails[i].RESOURCE_TYPE_MEASURED)
                                                                //wpdlog("qid_and_questions[1] "+qid_and_questions[1]);
                                                                if (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'application'
                                                                //  || OtherDetails[i].resourceTypeMeasured === 'ST-scope' 
                                                                // || OtherDetails[i].resourceTypeMeasured === 'Process'
                                                                // || OtherDetails[i].resourceTypeMeasured === 'Metrics'
                                                                // || OtherDetails[i].resourceTypeMeasured === 'Reports'
                                                                // || OtherDetails[i].resourceTypeMeasured === 'Governance'
                                                                // || OtherDetails[i].resourceTypeMeasured === 'Tools'
                                                                ){ 

                                                                    ws.cell(Excelrownum,j+6).style(myStyle);

                                                                    if (qid_and_questions[1] != undefined)
                                                                        ws.cell(Excelrownum,j+6).string(qid_and_questions[1]);
                                                                    // Question ID as key and value as column position
                                                                    obj[qid_and_questions[0]] = j+6;

                                                                
                                                                }else if ((OtherDetails[i].RESOURCE_TYPE_MEASURED == 'epic') 
                                                                || (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'sprint') || (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'ST-sprint')
                                                                || (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'AT-sprint') ){
                                                                        ws.cell(Excelrownum,j+4).style(myStyle);
                                                                        if (qid_and_questions[1] != undefined)
                                                                            ws.cell(Excelrownum,j+4).string(qid_and_questions[1]);
                                                                        // Question ID as key and value as column position
                                                                        obj[qid_and_questions[0]] = j+4;
                                                                                                                               
                                                                }else if ((OtherDetails[i].RESOURCE_TYPE_MEASURED == 'transition' ) || (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'sprintbacklog' ) || (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'servicebacklog' ) || (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'closure' )) {
                                                                    ws.cell(Excelrownum,1).style(myStyle);
                                                                    ws.cell(Excelrownum,2).style(myStyle);
                                                                    //ws.cell(1,3).style(myStyle);
                                                                    if (qid_and_questions[1] != undefined){
                                                                        ws.cell(j+3,1).style(myAnswerStyle);
                                                                        ws.cell(j+3,1).string(qid_and_questions[1]+"");
                                                                    }    
                                                                     // Question ID as key and value as column position
                                                                    obj[qid_and_questions[0].trim()+''] = j+3;
                                                                    wpdlog("transition "+(j+3)+" QID "+qid_and_questions[0]);
                                                                    wpdlog("Colvalu inserted "+obj[qid_and_questions[0].trim()]);


                                                                }else{
                                                                        ws.cell(2,j+3).style(myStyle);
                                                                        if (qid_and_questions[1] != undefined)
                                                                            ws.cell(2,j+3).string(qid_and_questions[1]+"");
                                                                        // Question ID as key and value as column position
                                                                        obj[qid_and_questions[0]] = j+3;
                                                                }
                                                        }
                                                }
                                               
                                                // if ressource of type transition/sprintbacklog/servicebacklog/closure then it is count of questions is ypur rows                                
                                                if ((OtherDetails[i].RESOURCE_TYPE_MEASURED == 'transition' ) || (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'sprintbacklog' ) || (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'servicebacklog' ) || (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'closure' )) {
                                                      rowcounter = qid_commma_questions.length - 1;
                                                }    

                                          }

                                          rowcounter = rowcounter + 2;                                                                                  
                                }

                                
                                if (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'application'){ // in case of 'application' type only epics , sprint etc to be displayed
                                
                                                if (OtherDetails[i].EPIC_NAME != undefined)
                                                     ws.cell(rowcounter,1).string(OtherDetails[i].EPIC_NAME)
                                                if (OtherDetails[i].SPRINT_NAME != undefined)                                                     
                                                    ws.cell(rowcounter,2).string(OtherDetails[i].SPRINT_NAME)

                                                if (OtherDetails[i].RESOURCE_NAME != undefined)
                                                    ws.cell(rowcounter,3).string(OtherDetails[i].RESOURCE_NAME)
//console.log("OtherDetails[i].STATUS"+OtherDetails[i].STATUS)
                                                if (OtherDetails[i].STATUS != undefined)
                                                    ws.cell(rowcounter,4).string(OtherDetails[i].STATUS)                                                    

                                                if (OtherDetails[i].RAG === 'R'){
                                                    ws.cell(rowcounter,5).style(myStyleRed);
                                                }
                                                if (OtherDetails[i].RAG === 'A'){
                                                    ws.cell(rowcounter,5).style(myStyleAmber);
                                                }
                                                if (OtherDetails[i].RAG === 'G'){
                                                    ws.cell(rowcounter,5).style(myStyleGreen);
                                                }
                                                if (OtherDetails[i].RAG != undefined)
                                                    ws.cell(rowcounter,5).string(OtherDetails[i].RAG)
                                    }else if ((OtherDetails[i].RESOURCE_TYPE_MEASURED == 'sprint')  || (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'epic')
                                    || (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'ST-sprint')
                                    || (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'AT-sprint') ){

                                                if (OtherDetails[i].RESOURCE_NAME != undefined)
                                                    ws.cell(rowcounter,1).string(OtherDetails[i].RESOURCE_NAME)

                                                if (OtherDetails[i].RESOURCE_NAME != undefined)
                                                    ws.cell(rowcounter,2).string(OtherDetails[i].RESOURCE_STATUS)

                                                if (OtherDetails[i].RAG === 'R'){
                                                    ws.cell(rowcounter,3).style(myStyleRed);
                                                }
                                                if (OtherDetails[i].RAG === 'A'){
                                                    ws.cell(rowcounter,3).style(myStyleAmber);
                                                }
                                                if (OtherDetails[i].RAG === 'G'){
                                                    ws.cell(rowcounter,3).style(myStyleGreen);
                                                }
                                                if (OtherDetails[i].RAG != undefined)
                                                   ws.cell(rowcounter,3).string(OtherDetails[i].RAG)

                                    }else if ((OtherDetails[i].RESOURCE_TYPE_MEASURED == 'transition' ) || (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'sprintbacklog' ) || (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'servicebacklog' ) || (OtherDetails[i].RESOURCE_TYPE_MEASURED == 'closure' )) {
                                   
                                                if (OtherDetails[i].RAG === 'R'){
                                                    ws.cell(rowcounter,2).style(myStyleRed);
                                                }
                                                if (OtherDetails[i].RAG === 'A'){
                                                    ws.cell(rowcounter,2).style(myStyleAmber);
                                                }
                                                if (OtherDetails[i].RAG === 'G'){
                                                    ws.cell(rowcounter,2).style(myStyleGreen);
                                                }
                                                if (OtherDetails[i].RAG != undefined)
                                                   ws.cell(rowcounter,2).string(OtherDetails[i].RAG+"")     
                                                                                     
                                    }else{
                                        // rowcounter = rowcounter+1
                                                if (OtherDetails[i].RESOURCE_NAME != undefined)
                                                    ws.cell(rowcounter,1).string(OtherDetails[i].RESOURCE_NAME)
                                                if (OtherDetails[i].RAG === 'R'){
                                                    ws.cell(rowcounter,2).style(myStyleRed);
                                                }
                                                if (OtherDetails[i].RAG === 'A'){
                                                    ws.cell(rowcounter,2).style(myStyleAmber);
                                                }
                                                if (OtherDetails[i].RAG === 'G'){
                                                    ws.cell(rowcounter,2).style(myStyleGreen);
                                                }
                                                if (OtherDetails[i].RAG != undefined)
                                                    ws.cell(rowcounter,2).string(OtherDetails[i].RAG+"") 
                                    }

                                                                                         
                                    var multipleLogicalColumnForAnswers = JSON.parse(OtherDetails[i].MULTIPLE_LOGICAL_COLS);
                              

                                    if (multipleLogicalColumnForAnswers != null)
                                    for(var k=0; k<multipleLogicalColumnForAnswers.length; k++) {
                                                                                        
                                            // get the column
                                            var colValue = obj[multipleLogicalColumnForAnswers[k].Q_ID.trim()+''];
                                            // wpdlog("multipleLogicalColumnForAnswers[k].Q_ID "+multipleLogicalColumnForAnswers[k].Q_ID);
                                            // wpdlog("multipleLogicalColumnForAnswers[k].ANSWER "+multipleLogicalColumnForAnswers[k].ANSWER);

                                            if (multipleLogicalColumnForAnswers[k].ANSWER != undefined){
                                                if (OtherDetails[i].RESOURCE_TYPE_MEASURED != 'transition'){
                                                     if (colValue != undefined)
                                                            ws.cell(rowcounter,colValue).string(multipleLogicalColumnForAnswers[k].ANSWER);  
                                                }else { 
                                                            //ws.cell(colValue,2).string(multipleLogicalColumnForAnswers[k].ANSWER);  
                                                            // wpdlog("Have enetered  ");
                                                            // wpdlog("Answers "+multipleLogicalColumnForAnswers[k].ANSWER+"  Colvalue "+colValue);

                                                            if (colValue !== undefined){
                                                                console.log("Colvalue  "+colValue)
                                                                    wpdlog("Colvalue  "+colValue);
                                                                    ws.cell(colValue,2).string(multipleLogicalColumnForAnswers[k].ANSWER+"");
                                                            }        
                                                            xrownumber =2
                                                            if (OtherDetails[i].RAG === 'R'){
                                                                ws.cell(xrownumber,2).style(myStyleRed);
                                                            }
                                                            if (OtherDetails[i].RAG === 'A'){
                                                                ws.cell(xrownumber,2).style(myStyleAmber);
                                                            }
                                                            if (OtherDetails[i].RAG === 'G'){
                                                                ws.cell(xrownumber,2).style(myStyleGreen);
                                                            }
                                                            if (OtherDetails[i].RAG != undefined)
                                                               ws.cell(xrownumber,2).string(OtherDetails[i].RAG)  
                                                }
                                            }    
                                    }



                                    rowcounter = rowcounter + 1;
                                    //wpdlog("rowcounter "+rowcounter);
                                    
                                } //for(let i=0; i<OtherDetails.length;i++){

                                // At the end draw the border for the last sheet

                                /*
                                ws.cell(1, 1, rowcounter-1, colCounter).style({border: {
                                    left: { style: 'thin'},        
                                    right: { style: 'thin'},  
                                    top: { style: 'thin'},  
                                    bottom: { style: 'thin'} 
                                }});//
                                */

                                if ((OtherDetails[OtherDetails.length-1].RESOURCE_TYPE_MEASURED == 'transition' ) || (OtherDetails[OtherDetails.length-1].RESOURCE_TYPE_MEASURED == 'sprintbacklog' ) || (OtherDetails[OtherDetails.length-1].RESOURCE_TYPE_MEASURED == 'servicebacklog' ) || (OtherDetails[OtherDetails.length-1].RESOURCE_TYPE_MEASURED == 'closure' )) {                                                                                

                                        ws.cell(1, 1, rowcounter, 2).style({ 
                                            border: {
                                                     left: { style: 'thin'},        
                                                     right: { style: 'thin'},  
                                                     top: { style: 'thin'},  
                                                     bottom: { style: 'thin'} 
                                            },
                                            alignment: {
                                                    wrapText: true,
                                                    horizontal: 'left',
                                            },
                                        });


                                        //Alignment
                                        ws.cell(1, 1, 2, 2).style({ 
                                            alignment: {
                                                    wrapText: true,
                                                    horizontal: 'center',
                                            },
                                        });


                                }else{                                                                                
                                        ws.cell(1, 1, rowcounter-1, colCounter).style({ 
                                            border: {
                                                     left: { style: 'thin'},        
                                                     right: { style: 'thin'},  
                                                     top: { style: 'thin'},  
                                                     bottom: { style: 'thin'} 
                                            },
                                            alignment: {
                                                    wrapText: true,
                                                    horizontal: 'center',
                                            },
                                        });
                                }                                    


                                wb.write(filePath);
                                conn.release();    

                                setTimeout(() => {  
                                    res.setHeader('Content-Type', 'application/octet-stream');
                                    res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
                                       setTimeout(()=>{
                                        try {
                                            // //wpdlog('remove' +filePath)
                                         fs.unlinkSync(filePath)
                                         //file removed
                                       } catch(err) {
                                         console.error(err)
                                       }
                                        }, 16000)
                                    return res.sendFile(filePath);
                                    },14000);
                                //}); 

                                //return res.sendFile(filePath);                                                            
                        })
                        .catch(err => {
                            //handle error
                            wpdlog(err);
                            res.send({"Fetch" : "Fail" });
                            conn.release();  
                })
                 
               });       
              });

}));





// #####################################  GET CONFIG PARAMETER LIST ############################################################
app.get('/tnt/ConfigParameters/', accessHandler((req, res) => { 


    //Maria db

    pool.getConnection()
    .then(conn=>{




                        const query =  ' select ' +
                                            ' distinct ap.FieldCategoryName '+                                            
                                        ' from '+
                                            '  ADMINPROFILE ap ';
                      
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db

}));


// #####################################  GET CONFIG PARAMETER VALUES ############################################################
app.get('/tnt/ConfigParameterValues/:id', accessHandler((req, res) => { 


    var fieldCategoryName = req.params.id;

    //Maria db

    pool.getConnection()
    .then(conn=>{
                      const query =  ' select ' +
                                            ' ap.id, ap.FieldCategoryName, ap.Categoryvalues '+                                            
                                        ' from '+
                                            '  ADMINPROFILE ap '+
                                            " where ap.FieldCategoryName='"+fieldCategoryName+"' "+
                                            " order by ap.FieldCategoryName ";
                      
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db

}));


// #####################################CREATE CONFIG PARAMETER VALUES ############################################################
app.post('/tnt/createConfigParameter/', accessHandler((req, res) => { 


    //Maria db

    pool.getConnection()
    .then(conn=>{

                    const query =  " insert into adminprofile(  "+
                                            "id," +
                                            "FieldCategoryName, "+                                
                                            "Categoryvalues "+                                                                                       
                                    " ) values ( "+
                                            "null,"+                            
                                            "'"+req.body.FieldCategoryName+"',"+
                                            "'"+req.body.Categoryvalues+"' "+                                                                                                            
                                    ") ";
              
              
                      wpdlog("query "+query);

                      conn.query(query)
                                  .then((result1)=>{

                                        conn.query(" SELECT LAST_INSERT_ID() ")
                                             .then((result)=>{

                                                var objToJson = result;
                                                var response = [];
                                                for (var key in result) {
                                                    //wpdlog("Result "+result[key]);
                                                    response.push(result[key]);
                                                }
                                                objToJson.response = response;
                                                finalresponse = JSON.stringify(objToJson);                             
                                                conn.release();    
                                                res.end(finalresponse);   


                                            })
                                            .catch(err => {
                                                        //handle error
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                            })                                                 
                                             
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db
    wpdlog(" Name "+req.body.ROLE_NAME);
    wpdlog("Description "+req.body.ROLE_DESCRIPTION);
  
}));


// #####################################  UPDATE CONFIG PARAMETER VALUES  ############################################################
app.put('/tnt/updateConfigParameter/:id', accessHandler((req, res) => { 

    //Maria db
    pool.getConnection()
    .then(conn=>{

                    const query = "update  adminprofile " + 
                    "set Categoryvalues ='" + req.body.Categoryvalues + "'  " +                                        
                    "where  "+
                        "id ='" +req.params.id +"' " ; 
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db

}));

// #####################################  DELETE CONFIG PARAMETER   ############################################################
app.delete('/tnt/deleteConfigParameter/:id', accessHandler((req, res) => { 

    //Maria db
    pool.getConnection()
    .then(conn=>{

                    const query = "delete from  adminprofile " +                                                          
                                    "where  "+
                                        "FieldCategoryName ='" +req.params.id +"' " ; 
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db

}));

// #####################################  DELETE CONFIG PARAMETER VALUE   ############################################################
app.delete('/tnt/deleteConfigParameterValue/:id', accessHandler((req, res) => { 

    //Maria db
    pool.getConnection()
    .then(conn=>{

                    const query = "delete from  adminprofile " +                                                          
                                    "where  "+
                                        "id ='" +req.params.id +"' " ; 
              
                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db

}));


  // #####################################  GET APPLICATION LIST ############################################################
  app.get('/tnt/applications/:id/:resourceTypeMeasured', accessHandler((req, res) => { 
  
    //Maria db
    pool.getConnection()
    .then(conn=>{
             var resourceQuery;
             var subprocess;
            var unidField = '';
            if(req.params.resourceTypeMeasured === 'application')
            {
                resourceQuery  = "(select AppUNID as RESOURCE_ID, AppName as RESOURCE_NAME from  APPLICATION_INFORMATION where IntegrationID='"+req.params.id+"')  ai "
                unidField = 'AppUNID'
            }
            else 
            {
                console.log("req.params.resourceTypeMeasured")
                console.log(req.params.resourceTypeMeasured)
                unidField = 'STUNID'
                if (req.params.resourceTypeMeasured === 'ST-scope')
                {
                    subprocess =''
                }else{
                    subprocess =  " and STScopeLevel ='"+ req.params.resourceTypeMeasured+"' "
                }
                ResourceName =  " CONCAT(CONCAT('Category : ', STScopeLevel),CONCAT(' - ',CONCAT('ST Scope : ', STScope) ),CONCAT(' - ',CONCAT('ST Details : ', STDetailedScope) ),CONCAT(' - ', CONCAT('ST Activity : ', STScopeActivity))) as  RESOURCE_NAME "
                ResourceOtherName =  " CONCAT(CONCAT('Category : ', STScopeLevel),CONCAT(' - ',CONCAT('ST Scope : ', Others) ),CONCAT(' - ',CONCAT('ST Details : ', STDetailedScope) ),CONCAT(' - ', CONCAT('ST Activity : ', STScopeActivity))) as  RESOURCE_NAME "
               
                resourceQuery = " (select RESOURCE_ID,RESOURCE_NAME from "+
                "(SELECT  MasterSTInfoid as RESOURCE_ID,"+ ResourceOtherName+"FROM masterstinfo where IntegrationID = '"+req.params.id+"' and STScope = 'Others' "+subprocess +
                " union " +
                "SELECT MasterSTInfoid as RESOURCE_ID,"+ResourceName+" FROM masterstinfo where IntegrationID = '"+req.params.id+
                "' and STScope <> 'Others'"+subprocess+" ) as STcope) as ai "
                
            }

                     const query = " select  ai.RESOURCE_ID as RESOURCE_ID, ai.RESOURCE_NAME as RESOURCE_NAME, COALESCE(ai_ec.EPIC_NAME,'NA') as EPIC_NAME, ai_ec.SPRINT_ID as SPRINT_ID, COALESCE(ai_ec.SPRINT_NAME,'NA') as SPRINT_NAME "+
                                        "  from  "+
                                        resourceQuery +
                                        "    LEFT JOIN "+                     
                                        // "  ( select 'application' as RESOURCE_TYPE_MEASURED, SPRINTSCOPE.AppUNID as RESOURCE_ID,  COALESCE(EPICS.epicName,'NA') as EPIC_NAME, SPRINT.sprintUNID as SPRINT_ID, COALESCE(SPRINT.sprintName,'NA') as SPRINT_NAME "+    
                                         "  ( select '"+req.params.resourceTypeMeasured+"' as RESOURCE_TYPE_MEASURED, SPRINTSCOPE."+unidField+" as RESOURCE_ID,  COALESCE(EPICS.epicName,'NA') as EPIC_NAME, SPRINT.sprintUNID as SPRINT_ID, COALESCE(SPRINT.sprintName,'NA') as SPRINT_NAME "+
                                                                    " from EPICS, SPRINT, SPRINTSCOPE "+
                                                                            "  where SPRINTSCOPE.Scope_IntegrationID ='"+req.params.id+"' "+ 
                                                                            "   and SPRINTSCOPE.sprintUNID = SPRINT.sprintUNID  "+   
                                                                            "   and EPICS.epicUNID = SPRINT.epicUNID "+                                                    
                                            "           ) ai_ec "+
                                             " ON ai.RESOURCE_ID = ai_ec.RESOURCE_ID "+                                             
                                             " order by EPIC_NAME, SPRINT_NAME ";

              
                      wpdlog("query for application list: "+query);
 
                      conn.query(query)
                                  .then((result)=>{
 
                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });
 
    //Maria db
 
  
 }));

 
  // #####################################  GET APPLICATION SEARCH LIST FOR APP VS TRAINEE ############################################################
  app.get('/tnt/applicationSearchList/:transitionId/:appName/:mapped/:epic/:sprint', accessHandler((req, res) => { 

    //wpdlog("############################################### applicationSearchList #########################################");
  
    var transitionId = req.params.transitionId;


    
    var appNameCriteria = "";
    if (req.params.appName != 'all'){
        appNameCriteria =  " and RESOURCE_NAME LIKE '%"+req.params.appName+"%'  ";

    }


    var epicCriteria = "";
    if (req.params.epic != 'all'){
        epicCriteria = " and EPIC_ID in ("+req.params.epic+") ";
        
    }

    var sprintCriteria = "";
    if (req.params.sprint != 'all'){
        sprintCriteria =  " and SPRINT_ID in ("+req.params.sprint+")  ";
        
    }    


    var mappedCriteria = "";
    if (req.params.mapped != 'all'){                
        mappedCriteria =" and MAPPED='"+req.params.mapped+"'  "; // trick to apply not to get any rows from APP-TRAINEE-MAP table
    }    



    //Maria db
    pool.getConnection()
    .then(conn=>{
                          
                   /*
 
                                         
                    //query_app_trainee_count = all_query_app_trainee_count;                     

                    if (searchQuery){
                                
                                if (req.params.mapped =='Y'){                                        
                                    query_app_trainee_count = criteria_query_app_trainee_count;
                                }
                                if (req.params.mapped =='N'){
                                    PICK_WHO_ARE_NOT_MAPPED = " and ti.APP_ID is null ";
                                    const criteria_query_app_trainee_count = "select ai.AppUNID APP_ID, ai.AppName APP_NAME, count(ti.APP_ID) TRAINEE_COUNT, sum(COALESCE(ti.FTE,'')) FTE, group_concat(concat(' ',ti.TRAINEE_NAME,',',COALESCE(ti.FTE,''))) TRAINEES, group_concat(concat(ti.TRAINEE_ID,',')) TRAINEE_IDS "+
                                    "from (select AppUNID, AppName from  APPLICATION_INFORMATION where IntegrationID='"+transitionId+"' "+appName+" ) ai, "+                                                                
                                            "( "+
                                                "( select atmap.APP_ID as APP_ID, atmap.TRAINEE_ID TRAINEE_ID, atmap.FTE as FTE, ti.Trainee_Name TRAINEE_NAME  "+
                                                        "from "+
                                                            "(select APP_ID,TRAINEE_ID, FTE from app_trainee_map where transition_id = '"+transitionId+"' "+mapped+" ) atmap,  (select Trainee_SNO TRAINEE_ID, Trainee_Name TRAINEE_NAME from traineeinfo where Trainee_IntegrationID = '"+transitionId+"') ti "+
                                                                "where  ti.TRAINEE_ID = atmap.TRAINEE_ID "+
                                                            ") "+  
                                            ")   ti "+
                                        "where ai.AppUNID = ti.APP_ID "+
                                               PICK_WHO_ARE_NOT_MAPPED +
                                            "group by ai.AppUNID "+
                                                "order by ai.AppName "; 
                                    const all_query_app_trainee_count = "select ai.AppUNID APP_ID, ai.AppName APP_NAME, count(ti.APP_ID) TRAINEE_COUNT, sum(COALESCE(ti.FTE,'')) FTE, group_concat(concat(' ',ti.TRAINEE_NAME,',',COALESCE(ti.FTE,''))) TRAINEES, group_concat(concat(ti.TRAINEE_ID,',')) TRAINEE_IDS "+
                                    "from (select AppUNID, AppName from  APPLICATION_INFORMATION where IntegrationID='"+transitionId+"' "+appName+" ) ai "+
                                        "left join "+
                                            "( "+
                                                "( select atmap.APP_ID as APP_ID, atmap.TRAINEE_ID TRAINEE_ID, atmap.FTE as FTE, ti.Trainee_Name TRAINEE_NAME  "+
                                                        "from "+
                                                            "(select APP_ID,TRAINEE_ID, FTE from app_trainee_map where transition_id = '"+transitionId+"' "+mapped+" ) atmap,  (select Trainee_SNO TRAINEE_ID, Trainee_Name TRAINEE_NAME from traineeinfo where Trainee_IntegrationID = '"+transitionId+"') ti "+
                                                                "where  ti.TRAINEE_ID = atmap.TRAINEE_ID "+
                                                            ") "+  
                                            ")   ti "+
                                        "on ai.AppUNID = ti.APP_ID "+
                                            "group by ai.AppUNID "+
                                                "order by ai.AppName ";
                                    query_app_trainee_count = criteria_query_app_trainee_count;
                                }
                                const criteriaQuery = " select  atc.APP_ID as RESOURCE_ID, atc.APP_NAME as RESOURCE_NAME, atc.FTE FTE, atc.TRAINEE_COUNT TRAINEE_COUNT, atc.TRAINEES TRAINEES, atc.TRAINEE_IDS TRAINEE_IDS, COALESCE(ai_ec.EPIC_NAME,'NA') as EPIC_NAME, ai_ec.SPRINT_ID as SPRINT_ID, COALESCE(ai_ec.SPRINT_NAME,'NA') as SPRINT_NAME "+
                                "  from  "+
                                "      ( "+query_app_trainee_count+"  )  atc, "+
                                                     
                                    "  ( select 'application' as RESOURCE_TYPE_MEASURED, SPRINTSCOPE.AppUNID as RESOURCE_ID,  COALESCE(EPICS.epicName,'NA') as EPIC_NAME, SPRINT.sprintUNID as SPRINT_ID, COALESCE(SPRINT.sprintName,'NA') as SPRINT_NAME "+
                                                            " from EPICS, SPRINT, SPRINTSCOPE "+
                                                                    "  where SPRINTSCOPE.Scope_IntegrationID ='"+transitionId+"' "+ 
                                                                    "   and SPRINTSCOPE.sprintUNID = SPRINT.sprintUNID  "+   
                                                                    "   and EPICS.epicUNID = SPRINT.epicUNID "+     
                                                                    epic +                                               
                                    "           ) ai_ec "+
                                    " where atc.APP_ID = ai_ec.RESOURCE_ID "+                                             
                                    " order by EPIC_NAME, SPRINT_NAME ";   

                                query = criteriaQuery;
                    }else{
                                query_app_trainee_count = all_query_app_trainee_count;
                                const allQuery = " select  atc.APP_ID as RESOURCE_ID, atc.APP_NAME as RESOURCE_NAME, atc.FTE FTE, atc.TRAINEE_COUNT TRAINEE_COUNT, atc.TRAINEES TRAINEES, atc.TRAINEE_IDS TRAINEE_IDS, COALESCE(ai_ec.EPIC_NAME,'NA') as EPIC_NAME, ai_ec.SPRINT_ID as SPRINT_ID, COALESCE(ai_ec.SPRINT_NAME,'NA') as SPRINT_NAME "+
                                "  from  "+
                                "      ( "+query_app_trainee_count+"  )  atc "+
                                "    LEFT JOIN "+                     
                                    "  ( select 'application' as RESOURCE_TYPE_MEASURED, SPRINTSCOPE.AppUNID as RESOURCE_ID,  COALESCE(EPICS.epicName,'NA') as EPIC_NAME, SPRINT.sprintUNID as SPRINT_ID, COALESCE(SPRINT.sprintName,'NA') as SPRINT_NAME "+
                                                            " from EPICS, SPRINT, SPRINTSCOPE "+
                                                                    "  where SPRINTSCOPE.Scope_IntegrationID ='"+transitionId+"' "+ 
                                                                    "   and SPRINTSCOPE.sprintUNID = SPRINT.sprintUNID  "+   
                                                                    "   and EPICS.epicUNID = SPRINT.epicUNID "+     
                                                                    epic +                                               
                                    "           ) ai_ec "+
                                     " ON atc.APP_ID = ai_ec.RESOURCE_ID "+                                             
                                     " order by EPIC_NAME, SPRINT_NAME ";    
                                query  = allQuery;
                    }



                    */
                                                       
                    const query_app_trainee_count = "select ai.AppUNID APP_ID, ai.AppName APP_NAME, ai.IntegrationID TRANSITION_ID, COALESCE(ti.MAPPED,'N') MAPPED,  count(ti.APP_ID) TRAINEE_COUNT, sum(COALESCE(ti.FTE,'')) FTE, group_concat(concat(' ',ti.TRAINEE_NAME,',',COALESCE(ti.FTE,''))) TRAINEES, group_concat(concat(ti.TRAINEE_ID,',')) TRAINEE_IDS "+
                                                    "from (select AppUNID, AppName, IntegrationID from  APPLICATION_INFORMATION where IntegrationID='"+transitionId+"'  ) ai "+
                                                            "left join "+
                                                            "( "+
                                                                "( select atmap.APP_ID as APP_ID, atmap.TRAINEE_ID TRAINEE_ID, atmap.FTE  FTE, atmap.MAPPED MAPPED, ti.Trainee_Name TRAINEE_NAME  "+
                                                                        "from "+
                                                                            "(select APP_ID, TRAINEE_ID, FTE, 'Y' as MAPPED from app_trainee_map where transition_id = '"+transitionId+"'  ) atmap,  (select Trainee_SNO TRAINEE_ID, Trainee_Name TRAINEE_NAME from traineeinfo where Trainee_IntegrationID = '"+transitionId+"') ti "+
                                                                                "where  ti.TRAINEE_ID = atmap.TRAINEE_ID "+
                                                                            ") "+  
                                                            ")   ti "+
                                                        " on ai.AppUNID = ti.APP_ID "+
                                                            "group by ai.AppUNID "+
                                                                "order by ai.AppName ";

                    const allQuery = " ( select  atc.APP_ID as RESOURCE_ID, atc.TRANSITION_ID TRANSITION_ID, atc.APP_NAME as RESOURCE_NAME, atc.FTE FTE, atc.TRAINEE_COUNT TRAINEE_COUNT, atc.MAPPED MAPPED, atc.TRAINEES TRAINEES, atc.TRAINEE_IDS TRAINEE_IDS, COALESCE(ai_ec.EPIC_ID,'NA') as EPIC_ID, COALESCE(ai_ec.EPIC_NAME,'NA') as EPIC_NAME, ai_ec.SPRINT_ID as SPRINT_ID, COALESCE(ai_ec.SPRINT_NAME,'NA') as SPRINT_NAME "+
                                         "  from  "+
                                             "      ( "+query_app_trainee_count+"  )  atc "+
                                                "    LEFT JOIN "+                     
                                                    "  ( select 'application' as RESOURCE_TYPE_MEASURED, SPRINTSCOPE.AppUNID as RESOURCE_ID, EPICS.epicUNID as EPIC_ID,  COALESCE(EPICS.epicName,'NA') as EPIC_NAME, SPRINT.sprintUNID as SPRINT_ID, COALESCE(SPRINT.sprintName,'NA') as SPRINT_NAME "+
                                                                            " from EPICS, SPRINT, SPRINTSCOPE "+
                                                                                    "  where SPRINTSCOPE.Scope_IntegrationID ='"+transitionId+"' "+ 
                                                                                    "   and SPRINTSCOPE.sprintUNID = SPRINT.sprintUNID  "+   
                                                                                    "   and EPICS.epicUNID = SPRINT.epicUNID "+                                               
                                                    "           ) ai_ec "+
                                                        " ON atc.APP_ID = ai_ec.RESOURCE_ID ) ";                                           
                                 


                    const query = " select * "+
                                     "from "+
                                        allQuery +"allq "+
                                           " where "+
                                              " allq.TRANSITION_ID ='"+transitionId+"' "+
                                                appNameCriteria+
                                                mappedCriteria+
                                                epicCriteria+
                                                sprintCriteria +
                                                " order by allq.EPIC_NAME, allq.SPRINT_NAME, allq.RESOURCE_NAME ";

                            
                      wpdlog("query for application list: "+query);
 
                      conn.query(query)
                                  .then((result)=>{
 
                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });
 
    //Maria db
 
  
 }));



   // #####################################  GET TRAINEE LIST ############################################################
   app.get('/tnt/trainees/:transitionId/:traineeIds/:traineeName/:traineeEmail/:traineeSkill', accessHandler((req, res) => { 
  
    var IntegrationID = req.params.transitionId;
    var traineeIds = "";
    if (req.params.traineeIds != 'all'){
        traineeIds = "and Trainee_SNO in ("+req.params.traineeIds+" ) ";
    }
    var traineeName = "";
    if (req.params.traineeName != 'all'){
        traineeName = "and Trainee_Name LIKE  '%"+req.params.traineeName+"%'  ";
    }

    var traineeEmail = "";
    if (req.params.traineeEmail != 'all'){
        traineeEmail = "and Trainee_email LIKE '%"+req.params.traineeEmail+"%' ";
    }

    var traineeSkill = "";
    if (req.params.traineeSkill != 'all'){
        traineeSkill =  "and Trainee_Skills LIKE '%"+req.params.traineeSkill+"%'  ";
    }    


    //Maria db
    pool.getConnection()
    .then(conn=>{
                     /*
                      const query = "Select Trainee_SNO as TRAINEE_ID, Trainee_Name as TRAINEE_NAME, COALESCE(Trainee_email,'NA') as TRAINEE_EMAIL, COALESCE(Trainee_Skills,'NA') as TRAINEE_SKILLS "+
                                         "from traineeinfo "+
                                                "where Trainee_IntegrationID = '"+IntegrationID+"' "+traineeIds+""+
                                                    " order by TRAINEE_NAME ";
                     */


                      const query = "select ti.TRAINEE_ID, ti.TRAINEE_NAME TRAINEE_NAME, TRIM(ti.TRAINEE_EMAIL) TRAINEE_EMAIL, ti.TRAINEE_SKILLS TRAINEE_SKILLS, count(tapp.APP_ID) APP_COUNT, sum(COALESCE(tapp.FTE,'')) FTE, group_concat(concat(' ',tapp.APP_NAME,',',COALESCE(tapp.FTE,''))) APPS, group_concat(concat(tapp.APP_ID,',')) APP_IDS "+
                                       "from "+
                                               "( Select Trainee_SNO as TRAINEE_ID, Trainee_Name as TRAINEE_NAME, COALESCE(Trainee_email,'NA') as TRAINEE_EMAIL, COALESCE(Trainee_Skills,'NA') as TRAINEE_SKILLS  "+
                                                   "  from traineeinfo "+
                                                          "where Trainee_IntegrationID = '"+IntegrationID+"'  "+traineeIds+ traineeEmail+ traineeName + traineeSkill+" ) ti "+
                                                "left join  "+                                                
                                                "(select TRAINEE_ID, APP_ID, ai.AppName APP_NAME, COALESCE(atm.FTE,0) FTE "+
                                                    "from app_trainee_map atm, application_information ai "+
                                                         "where atm.transition_id = '"+IntegrationID+"'  "+
                                                             "and ai.IntegrationID = '"+IntegrationID+"'  "+
                                                             "and atm.APP_ID = ai.AppUNID ) tapp "+
                                                "ON ti.TRAINEE_ID = tapp.TRAINEE_ID "+
                                                     "group by ti.TRAINEE_ID "+
                                                         "order by ti.TRAINEE_NAME  ";                            
              
                      //wpdlog("query for trainee list: "+query);
 
                      conn.query(query)
                                  .then((result)=>{
 
                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });
 
    //Maria db
 
  
 }));


// #############################  GET EXCEL TEMPLATE FOR APP VS TRAINEE MAPPING  ###########################
app.get('/getExcelTemplateAppVsTraineeMapping/:IntegrationID/:appIds/:traineeIds', accessHandler((req, res) => { 

    var IntegrationID = req.params.IntegrationID;
    var appIds = "";
    var traineeIds = "";
    var APP_IDS_MAP = '';
    var TRAINEE_IDS_MAP = '';
    var objMap = {}; 
    

    if (req.params.appIds != 'all'){
        appIds = " and AppUNID in ("+req.params.appIds +") ";  
        APP_IDS_MAP = "and APP_ID in ("+req.params.appIds+"  ) ";
    }


    if (req.params.traineeIds != 'all'){
        traineeIds  =  " and Trainee_SNO in ("+decodeURIComponent(req.params.traineeIds) +" ) ";  
        TRAINEE_IDS_MAP = "and TRAINEE_ID in ("+req.params.traineeIds+"  ) ";
    }    

    var wb = new xl.Workbook();
    const filename = "AppVsTraineeMappingTemplate"+IntegrationID.replace(/\s/g,'')+".xlsx";
    var filePath = __dirname+'\\'+filename;
    

    const lockCell = (worksheet, range) => {
        worksheet.addDataValidation({
          type: "textLength",
          error: "This cell is locked",   
          allowBlank: 1,      
          operator: "equal",
          sqref: range,
          formulas: [""],
        });
      };
      
      

    var myStyle = wb.createStyle({
        fill: {
          type: 'pattern',
          patternType: 'solid',
          bgColor: '#1D3649',
          fgColor: '#1D3649',
        },
        font: {
          name: 'Arial',
           size: 10 ,
          bold: true,
          color: 'FFFFFF',
        },
        alignment: {
        horizontal: 'left',
        vertical: 'center',
        wrapText: true,
        },
      });
      
      var myStyleRed = wb.createStyle({
        fill: {
         type: 'pattern',
         patternType: 'solid',
         bgColor: '#FF0000',
         fgColor: '#FF0000',
        },
        });
      
        var myStyleGreen = wb.createStyle({
          fill: {
           type: 'pattern',
           patternType: 'solid',
           bgColor: '#00FF00',
           fgColor: '#00FF00',
          },
          });
      
          var myStyleAmber = wb.createStyle({
            fill: {
             type: 'pattern',
             patternType: 'solid',
             bgColor: '#FFCC00',
             fgColor: '#FFCC00',
            },
            });


            var myStyleGrey = wb.createStyle({
                fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    bgColor: '#808080',
                    fgColor: '#808080',
                  },
                  font: {
                    name: 'Arial',
                     size: 10 ,
                    bold: true,
                    color: 'FFFFFF',
                  },
                  alignment: {
                  horizontal: 'center',
                  vertical: 'center',
                  wrapText: true,
                  },

                });

              const queryAppTraineeMap = "select APP_ID, TRAINEE_ID, FTE  "+
                                              "from APP_TRAINEE_MAP "+
                                                 "where TRANSITION_ID='"+IntegrationID+"' "+APP_IDS_MAP+" "+TRAINEE_IDS_MAP;
                                                     
                                                                                                                                  
              var queryForAppDeatils ="select AppUNID as APP_ID, AppName as APP_NAME, COALESCE(Technology, 'NA') as APP_TECHNOLOGY, COALESCE(Complexity,'NA') as APP_COMPLEXITY  "+
                                          "from application_information "+
                                               "where IntegrationID ='"+IntegrationID+"' "+appIds +
                                               " order by APP_NAME ";
                                                                                                                                                                                                                                                                                                                    
              var queryForTraineeDetails = "Select Trainee_SNO as TRAINEE_ID, Trainee_Name as TRAINEE_NAME, COALESCE(Trainee_email,'NA') as TRAINEE_EMAIL, COALESCE(Trainee_Skills,'NA') as TRAINEE_SKILLS "+
                                                 "from traineeinfo "+
                                                        "where Trainee_IntegrationID = '"+IntegrationID+"' "+traineeIds +
                                                        " order by TRAINEE_NAME ";
              
              pool.getConnection().then(conn => {  


                 // APP DETAILS
                 wpdlog(queryForAppDeatils);  
                 conn.query(queryForAppDeatils).then((appDetails) => {   
                     
                    
                       ws = wb.addWorksheet("App Vs Trainee Mapping"); 
                       ws2 = wb.addWorksheet("Instructions"); 

                       ws2.cell(1,4).string("INSTRUCTIONS");

                       ws2.cell(2,1).string("(1)");
                       ws2.cell(2,2).string("No rows or columns to be removed from this excel");
                       ws2.cell(3,1).string("(2)LEGEND");

                       ws2.cell(4,1).style(myStyleGrey);
                       ws2.cell(4,2).string("Non editable cells - if they are modified or content is cleared, upload may not work properly");
                       ws2.cell(5,1).style(myStyleGreen);
                       ws2.cell(5,2).string("Editable cells -Enter FTE value here, must be numeric. Possible values are +Ve numeric, cells can be left empty ie not all cells are mandatory ");
                       ws2.cell(6,2).string("Zero(0) FTE values will be ignored for processing. If you want to remove FTE relationship between App & Trainee, please use delete feature instead of putting ZEROs. This screen is explicitely for inserting/updating NON ZERO +ve fte values ");
                       ws2.column(2).setWidth(60); 
                       ws2.column(4).setWidth(40); 


                       //lockCell(ws,'A1:G3');

                       lockCell(ws,'A1:G3');

                       ws.cell(3,1,2,1).style(myStyleGrey);
                       ws.cell(3,1).style(myStyleGrey);
                       ws.cell(3,1).string("APP NAME");
                       ws.cell(3,2).style(myStyleGrey);
                       ws.cell(3,2).string("APP TECHNOLOGY");   
                       ws.cell(3,3).style(myStyleGrey);
                       ws.cell(3,3).string("APP COMPLEXITY");    
                       
                       
                       ws.cell(1,4).style(myStyleGrey);
                       ws.cell(1,4).string("TRAINEE EMAIL");                                                        
                       ws.cell(2,4).style(myStyleGrey);
                       ws.cell(2,4).string("TRAINEE NAME");  
                       ws.cell(3,4).style(myStyleGrey);
                       ws.cell(3,4).string("TRAINEE SKILL");   
                       ws.column(4).setWidth(20); 


                       var appDetails=JSON.parse(JSON.stringify(appDetails));      

                                           

                        // TRAINEE DETAILS            
                        //wpdlog(queryForTraineeDetails);        
                        conn.query(queryForTraineeDetails).then((TraineeDetails) => {    

                                //var TraineeDetailVal=JSON.parse(JSON.stringify(TraineeDetails)); 


                                //Get the map details and form key-value object
                                //wpdlog(queryAppTraineeMap);  
                                conn.query(queryAppTraineeMap).then((appTraineeMapDetails) => {                                     
                                    for(let i=0; i<appTraineeMapDetails.length;i++){
                                    
                                        objMap[''+appTraineeMapDetails[i].APP_ID+'-'+appTraineeMapDetails[i].TRAINEE_ID]=appTraineeMapDetails[i].FTE;  
                                        //wpdlog(''+appTraineeMapDetails[i].APP_ID+'-'+appTraineeMapDetails[i].TRAINEE_ID);
                                        //wpdlog(appTraineeMapDetails[i].FTE);
                                        //wpdlog(objMap[''+appTraineeMapDetails[i].APP_ID+'-'+appTraineeMapDetails[i].TRAINEE_ID]);
                                    }    

                                    var rowcounter = 0;
                                    var colCounter = 5;
                                    var appRowCounter = 4;
                                    var mapRowCounter = 4;

                                    //Create a sheet                                
                                    for(let i=0; i<TraineeDetails.length;i++){
                                        ws.cell(rowcounter+1,colCounter).style(myStyleGrey);
                                        ws.cell(rowcounter+1,colCounter).string(TraineeDetails[i].TRAINEE_EMAIL);
                                        ws.column(colCounter).setWidth(20);
    
                                        ws.cell(rowcounter+2,colCounter).style(myStyleGrey);
                                        ws.cell(rowcounter+2,colCounter).string(TraineeDetails[i].TRAINEE_NAME);
                                        
    
                                        ws.cell(rowcounter+3,colCounter).style(myStyleGrey);
                                        ws.cell(rowcounter+3,colCounter).string(TraineeDetails[i].TRAINEE_SKILLS);
                                        
    
                                        // Loop for APP
                                       // var appRowCounter = 4;
                                        var appColCounter = 0;
                 
                                         for(let j=0; j<appDetails.length;j++){
                                             ws.cell(appRowCounter+j,appColCounter+1).style(myStyleGrey);
                                             ws.cell(appRowCounter+j,appColCounter+1).string(appDetails[j].APP_NAME);
                                             ws.column(appColCounter+1).setWidth(20);
                                             ws.cell(appRowCounter+j,appColCounter+2).style(myStyleGrey);
                                             ws.cell(appRowCounter+j,appColCounter+2).string(appDetails[j].APP_TECHNOLOGY);
                                             ws.column(appColCounter+2).setWidth(20);                                            
                                             ws.cell(appRowCounter+j,appColCounter+3).style(myStyleGrey);
                                             ws.cell(appRowCounter+j,appColCounter+3).string(appDetails[j].APP_COMPLEXITY);
                                             ws.column(appColCounter+3).setWidth(20);                                             
    
                                             ws.cell(appRowCounter+j,appColCounter+4).style(myStyleGrey);
                                             ws.cell(appRowCounter+j,appColCounter+4).string('');   // This column should be empty
    
                                             //ws.cell(appRowCounter,appColCounter+5).style(myStyle);
                                             //if (objMap[''+appDetails[j].APP_ID+'-'+TraineeDetails[i].TRAINEE_ID] != undefined )
                                                // ws.cell(appRowCounter,appColCounter+5).number(objMap[''+appDetails[j].APP_ID+'-'+TraineeDetails[i].TRAINEE_ID]);
    
                                                                               
                                         }   

                                         //appRowCounter = appRowCounter + 1;  
                                        // Map data
                                        
                                        var appColCounter = 5;
                                        mapRowCounter = 4;
                                        let traineeFteTot = 0;
                                         for(let k=0; k<appDetails.length;k++){
                                            ws.cell(mapRowCounter+k,appColCounter+i).style(myStyleGreen);
                                            ws.cell(mapRowCounter+k,appColCounter+i).comment('Enter FTE value here, must be numeric. For details see Instructions tab');
                                            ws.column(appColCounter+i).setWidth(30);
                                            if (objMap[''+appDetails[k].APP_ID+'-'+TraineeDetails[i].TRAINEE_ID] != undefined ){
                                                ws.cell(mapRowCounter+k,appColCounter+i).number(objMap[''+appDetails[k].APP_ID+'-'+TraineeDetails[i].TRAINEE_ID]);                                                                                                                                            
                                                traineeFteTot = traineeFteTot + (+objMap[''+appDetails[k].APP_ID+'-'+TraineeDetails[i].TRAINEE_ID]);
                                            }    
                                            //appColCounter = appColCounter + 1;
                                         }    

                                         if (appDetails.length>0) {                                             
                                                   ws.cell(mapRowCounter+appDetails.length,appColCounter+i).number(traineeFteTot);
                                                   //ws.cell(mapRowCounter+appDetails.length, 1, mapRowCounter+appDetails.length, 4, true).string('TOTAL TRAINEE FTE');
                                                   let col = (5+i);   
                                                   let row = mapRowCounter+appDetails.length-1;                                                                                
                                                   ws.cell(mapRowCounter+appDetails.length,appColCounter+i).formula("=SUM("+excelColumnName.intToExcelCol(col)+"4:"+excelColumnName.intToExcelCol(col)+row+")");
                                                   ws.cell(mapRowCounter+appDetails.length,appColCounter+i).style(myStyleGrey);
                                                   
                                         }          

                                          

                                         //mapRowCounter = mapRowCounter + 1;   
    
    
                                        colCounter = colCounter + 1;                                    
                                    }  // end of trainee for loop  

                                    
                                    if (appDetails.length>0) {                                             
                                        //ws.cell(mapRowCounter+appDetails.length,appColCounter+i).number(traineeFteTot);
                                        ws.cell(mapRowCounter+appDetails.length, 1, mapRowCounter+appDetails.length, 4, true).string('TOTAL TRAINEE FTE');
                                        ws.cell(mapRowCounter+appDetails.length, 1, mapRowCounter+appDetails.length, 4).style(myStyleGrey);
                                        
                                    }    
    

                                    // Calculate the app total against trainees
                                    for(let k=0; k<appDetails.length;k++){
                                        let appFteTot = 0;
                                        for(let i=0; i<TraineeDetails.length;i++){
                                            if (objMap[''+appDetails[k].APP_ID+'-'+TraineeDetails[i].TRAINEE_ID] != undefined ){                                                
                                                appFteTot = appFteTot + (+objMap[''+appDetails[k].APP_ID+'-'+TraineeDetails[i].TRAINEE_ID]);
                                            }    
                                        }    
                                        if (TraineeDetails.length >0){
                                            ws.cell(4+k,5+TraineeDetails.length).number(appFteTot); 
                                            let row = (4+k);                                                                                   
                                            ws.cell(4+k,5+TraineeDetails.length).formula("=SUM(E"+row+":"+excelColumnName.intToExcelCol(4+TraineeDetails.length)+row+")");
                                            ws.cell(4+k,5+TraineeDetails.length).style(myStyleGrey);
                                        }    
                                    }    

                                    ws.cell(1, 5+TraineeDetails.length, 3, 5+TraineeDetails.length, true).string('TOTAL APP FTE');
                                    ws.cell(1, 5+TraineeDetails.length, 3, 5+TraineeDetails.length).style(myStyleGrey);


                                    // At the end draw the border 
                                    ws.cell(4, 5, mapRowCounter+appDetails.length-1, colCounter-1).style({border: {
                                        left: { style: 'thin'},        
                                        right: { style: 'thin'},  
                                        top: { style: 'thin'},  
                                        bottom: { style: 'thin'} 
                                        }});
    
    
                                    //ws.row(3).freeze(); 
                                    //ws.column(4).freeze();
                                    ws.cell(1, 1, 2, 3).style(myStyleGrey);
                                    ws.cell(1, 1, 2, 3).style({border: {
                                        left: { style: 'thin'},        
                                        right: { style: 'thin'},  
                                        top: { style: 'thin'},  
                                        bottom: { style: 'thin'} 
                                        }});
                                    ws.cell(1, 1, 2, 3, true).string('APP vs TRAINEE mapping');
                                    
                                    

                                    wb.write(filePath);
                                    conn.release();    
    
                                    setTimeout(() => {  
                                        res.setHeader('Content-Type', 'application/octet-stream');
                                        res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
                                           setTimeout(()=>{
                                            try {
                                                // //wpdlog('remove' +filePath)
                                             fs.unlinkSync(filePath)
                                             //file removed
                                           } catch(err) {
                                             console.error(err)
                                           }
                                            }, 16000)
                                        return res.sendFile(filePath);
                                        },14000);     

                                })
                                .catch(err => {
                                    //handle error
                                    wpdlog(err);                                     
                                })                                                                                                  
                        })
                        .catch(err => {
                            //handle error
                            wpdlog(err);
                            res.send({"Fetch" : "Fail" });
                            conn.release();  
                        })                 
               });       
              });

}));


// INSERT OR UPDATE APP VS TRAINEE MAP UPLOAD SCREEN
app.post('/tnt/appVsTraineeMapInsertUpdateUpload/', accessHandler((req, res) => { 

    //wpdlog("Insert or Update App Vs Trainee Map ...");
    //Maria db
    var transitionId = req.body.transitionId;
    var appTraineeMapList = req.body.appTraineeMapList;
    var appId = "";
    var traineeId = "";
    var fte = "";
   

    //var query = "";
    pool.getConnection()
    .then(conn=>{         
                for( let i=0; i< appTraineeMapList.length; i++){

                            //appTraineeMapId = appTraineeMapList[i].APP_TRAINEE_MAP_ID;
                            let appId = appTraineeMapList[i].APP_ID;
                            let traineeId = appTraineeMapList[i].TRAINEE_ID;
                            let fte = appTraineeMapList[i].FTE;



                            var querySelect =  ' select  APP_TRAINEE_MAP_ID  '+
                                                ' from APP_TRAINEE_MAP '+
                                                "   where APP_ID='"+appId+"' "+
                                                "     and TRAINEE_ID='"+traineeId +"' "+
                                                "     and TRANSITION_ID='"+transitionId+"' " ;     

                            wpdlog(querySelect);                    
                            conn.query(querySelect)
                                 .then((resultQuerySelect)=>{  


                                    if (resultQuerySelect.length >0){
                                           //wpdlog("Update will happen ...");
                                           var mapDetails=JSON.parse(JSON.stringify(resultQuerySelect));  
                                           //UPDATE
                                           query = "update  APP_TRAINEE_MAP " + 
                                                               "set FTE =" + fte + "  " +        
                                                                    "where APP_TRAINEE_MAP_ID ='"+ mapDetails[0].APP_TRAINEE_MAP_ID+ "' ";                                                                       

                                    }else{
                                           //INSERT
                                           //wpdlog("Insert will happen ...");

                                           //wpdlog(" i =  "+i);
                                           //wpdlog(" appId "+appId);
                                           //wpdlog(" traineeId "+traineeId);
                                           //wpdlog(" fte "+fte);
                                           query =  " insert into APP_TRAINEE_MAP (  "+
                                                        "APP_TRAINEE_MAP_ID, "+      
                                                        "TRANSITION_ID, "+   
                                                        "APP_ID, "+                                
                                                        "TRAINEE_ID, "+
                                                        "FTE "+
                                                    " ) values ( "+
                                                        "null,"+      
                                                        "'"+transitionId+"', "+                      
                                                        "'"+appId+"',"+
                                                        "'"+traineeId+"',"+
                                                        ""+fte+" )" ;

                                          //wpdlog("Insert Query"+query);            
                                    }              
                                    
                                    // Now execute the query update or insert
                                    //wpdlog(query);
                                    conn.query(query)
                                    .then((result)=>{                                               
                                    })
                                    .catch(err => {
                                           //handle error
                                           wpdlog(err);
                                    })
                            })
                            .catch(err => {
                                            //handle error
                                            wpdlog(err);
                                            //res.send({"Fetch" : "Fail" });                                             
                            })                                       
                }// end of for    
                conn.release(); 
                //send the final response
                res.end("[]");               
      }).catch(err => {
            wpdlog("Not connected");
            wpdlog(err);
            conn.release(); 
      });
}));


// INSERT OR UPDATE APP VS TRAINEE MAP SAVE ( from EDIT SCREEN)
app.post('/tnt/appVsTraineeMapInsertUpdateSave/', accessHandler((req, res) => { 

    //wpdlog("Insert or Update App Vs Trainee Map ...");
    //Maria db
    var transitionId = req.body.transitionId;
    var appTraineeMapList = req.body.appTraineeMapList;
    var appId = "";
    var traineeId = "";
    var fte = "";
   

    //var query = "";
    pool.getConnection()
    .then(conn=>{         
                for( let i=0; i< appTraineeMapList.length; i++){

                            let appTraineeMapId = appTraineeMapList[i].APP_TRAINEE_MAP_ID;
                            let appId = appTraineeMapList[i].APP_ID;
                            let traineeId = appTraineeMapList[i].TRAINEE_ID;
                            let fte = appTraineeMapList[i].FTE;

                            //wpdlog("appTraineeMapId.length "+appTraineeMapId.length);


                            /*
                            var querySelect =  ' select  APP_TRAINEE_MAP_ID  '+
                                               ' from APP_TRAINEE_MAP '+
                                                "   where APP_ID='"+appId+"' "+
                                                "     and TRAINEE_ID='"+traineeId +"' "+
                                                "     and TRANSITION_ID='"+transitionId+"' " ;     
                            */                    

                            //wpdlog(querySelect);                    
                            //conn.query(querySelect)
                              //   .then((resultQuerySelect)=>{  

                                    //wpdlog("appTraineeMapId "+appTraineeMapId);
                                    if (appTraineeMapId ==''){


                                                                    
                                           //INSERT
                                           //wpdlog("Insert will happen ...");

                                           //wpdlog(" i =  "+i);
                                           //wpdlog(" appId "+appId);
                                           //wpdlog(" traineeId "+traineeId);
                                           //wpdlog(" appTraineeMapId "+appTraineeMapId);
                                           //wpdlog(" fte "+fte);
                                           query =  " insert into APP_TRAINEE_MAP (  "+
                                                        "APP_TRAINEE_MAP_ID, "+      
                                                        "TRANSITION_ID, "+   
                                                        "APP_ID, "+                                
                                                        "TRAINEE_ID, "+
                                                        "FTE "+
                                                    " ) values ( "+
                                                        "null,"+      
                                                        "'"+transitionId+"', "+                      
                                                        "'"+appId+"',"+
                                                        "'"+traineeId+"',"+
                                                        ""+fte+" )" ;

                                          //wpdlog("Insert Query"+query);                                                                       

                                    }else{
                                        //wpdlog("Update will happen ...");
                                        //var mapDetails=JSON.parse(JSON.stringify(resultQuerySelect));  
                                        //UPDATE
                                        query = "update  APP_TRAINEE_MAP " + 
                                                            "set FTE =" + fte + "  " +        
                                                                 "where APP_TRAINEE_MAP_ID ='"+ appTraineeMapId+ "' ";
         
                                     }              
                                    
                                      // Now execute the query update or insert
                                      //wpdlog(query);
                                      conn.query(query)

                                    .then((result)=>{       

                                    })
                                    .catch(err => {
                                           //handle error
                                           wpdlog(err);
                                    })

                            /*        
                            })
                            .catch(err => {
                                            //handle error
                                            wpdlog(err);
                                            //res.send({"Fetch" : "Fail" });                                             
                            })   
                            */                                    
                }// end of for    
                conn.release(); 
                //send the final response
                res.end("[]");               
      }).catch(err => {
            wpdlog("Not connected");
            wpdlog(err);
            conn.release(); 
      });
}));


// #####################################  GET APP TRAINEE MAP TRACKER ############################################################
app.get('/tnt/getAppTraineeMapTracker/:transitionId/:appIds/:traineeIds', accessHandler((req, res) => { 


    var trainsitionId = req.params.transitionId;
    var APP_IDS = '';
    var APP_IDS_MAP = '';
    var TRAINEE_IDS_MAP = '';

    if (req.params.appIds !='all'){
        var appIds = req.params.appIds;

        APP_IDS = " and AppUNID in ("+appIds+"  ) ";
        APP_IDS_MAP = " and APP_ID in ("+appIds+"  ) ";
    }


    if (req.params.traineeIds !='all'){
        var traineeIds = req.params.traineeIds;        
        TRAINEE_IDS_MAP = " and TRAINEE_ID in ("+traineeIds+"  ) ";
    }

    //Maria db

    pool.getConnection()
    .then(conn=>{
                      const query = "select COALESCE(atm.APP_TRAINEE_MAP_ID,'') APP_TRAINEE_MAP_ID, ai.AppUNID APP_ID, ai.AppName APP_NAME, COALESCE(ai.Technology,'') TECHNOLOGY, COALESCE(ai.Complexity,'') COMPLEXITY, COALESCE(atm.tf,'') TRAINEE_FTE_INFO  "+
                                        "from  "+
                                            "(select AppUNID, AppName, Technology, Complexity "+
                                                  "from application_information "+
                                                       "where IntegrationID = '"+trainsitionId+"' "+ APP_IDS +") ai left join (select APP_TRAINEE_MAP_ID, APP_ID, group_concat(concat(TRAINEE_ID, '-', FTE, '-',APP_TRAINEE_MAP_ID )) tf  "+
                                                                                                                        "from app_trainee_map "+
                                                                                                                                "where transition_id = '"+trainsitionId+"' "+
                                                                                                                                         APP_IDS_MAP + TRAINEE_IDS_MAP +
                                                                                                                                        "group by APP_ID ) atm "+
                                                            " on ai.AppUNID = atm.APP_ID "+
                                                            " order by APP_NAME ";
                      
                      wpdlog("query for app trainee map tracker  "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db

}));


// #####################################  DELETE APP TRAINEE MAP TRACKER  ############################################################
app.delete('/tnt/deleteAppTraineeMapTracker/:appTraineeMapId', accessHandler((req, res) => { 



    //Maria db

    pool.getConnection()
    .then(conn=>{

                    const query = "delete from  APP_TRAINEE_MAP " + 
                                  "where  "+                                       
                                       " APP_TRAINEE_MAP_ID ='"+req.params.appTraineeMapId+"'"; 
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });



    //Maria db


}));

// #####################################CREATE A NEW CONTENT TYPE ############################################################
app.post('/tnt/contentType/', accessHandler((req, res) => { 


    //Maria db
    wpdlog("req.body.CONTENT_TYPE_NAME "+req.body.CONTENT_TYPE_NAME);
    wpdlog("req.body.CONTENT_TYPE_DESCRIPTION "+req.body.CONTENT_TYPE_DESCRIPTION);
    wpdlog("req.body.CONTENT_TYPE_QUERY "+req.body.CONTENT_TYPE_QUERY);


   //var qTypeQry = req.body.CONTENT_TYPE_QUERY.replace("'","\'");

   var qTypeQry = escapeChar(req.body.CONTENT_TYPE_QUERY,"'",'"' );
   wpdlog(" ================================================================== ");
   wpdlog("qTypeQry "+qTypeQry);
   wpdlog(" ================================================================== ");

    pool.getConnection()
    .then(conn=>{

                    const query =  " insert into CONTENT_TYPE(  "+
                                            "CONTENT_TYPE_ID, "+                                
                                            "CONTENT_TYPE_NAME, "+
                                            "CONTENT_TYPE_CATEGORY, "+
                                            "CONTENT_TYPE_DESCRIPTION, "+
                                            "CONTENT_TYPE_QUERY "+                                                                                     
                                    " ) values ( "+
                                        "null,"+                            
                                        "'"+req.body.CONTENT_TYPE_NAME+"',"+
                                        "'"+req.body.CONTENT_TYPE_CATEGORY+"',"+
                                        "'"+req.body.CONTENT_TYPE_DESCRIPTION+"', "+
                                        "'"+qTypeQry+"'"+                                                              
                                     ") ";  
                            
                      wpdlog("query "+query);

                      conn.query(query)
                                  .then((result1)=>{

                                        conn.query(" SELECT LAST_INSERT_ID() ")
                                             .then((result)=>{

                                                var objToJson = result;
                                                var response = [];
                                                for (var key in result) {
                                                    //wpdlog("Result "+result[key]);
                                                    response.push(result[key]);
                                                }
                                                objToJson.response = response;
                                                finalresponse = JSON.stringify(objToJson);                             
                                                conn.release();    
                                                res.end(finalresponse);   


                                            })
                                            .catch(err => {
                                                        //handle error
                                                        wpdlog(err)
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                            })                                                 
                                             
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err)
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
          wpdlog(err);
      });


    //Maria db
    //wpdlog(" Name "+req.body.ROLE_NAME);
    //wpdlog("Description "+req.body.ROLE_DESCRIPTION);
  
}));

// #####################################  GET CONTENT TYPE LIST ############################################################
app.get('/tnt/contentTypes/:id', accessHandler((req, res) => { 


    var contentTypeCategoryExpression = '';
    if (req.params.id !=='TEMPLATE'){
            contentTypeCategoryExpression =  " where ct.CONTENT_TYPE_CATEGORY='"+req.params.id+"'"; 
    }

    //Maria db
    pool.getConnection()
    .then(conn=>{

                    const query =  ' select ' +
                                        ' ct.CONTENT_TYPE_ID as CONTENT_TYPE_ID, '+
                                        ' COALESCE(ct.CONTENT_TYPE_NAME,"") as CONTENT_TYPE_NAME, '+
                                        ' COALESCE(ct.CONTENT_TYPE_CATEGORY,"") as CONTENT_TYPE_CATEGORY, '+
                                        ' COALESCE(ct.CONTENT_TYPE_DESCRIPTION,"") as CONTENT_TYPE_DESCRIPTION, '+
                                        ' COALESCE(ct.CONTENT_TYPE_QUERY,"") as CONTENT_TYPE_QUERY '+
                                    ' from '+
                                        '  CONTENT_TYPE ct '+
                                               contentTypeCategoryExpression;  
              
                                      
                      wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{
                                              logger.info("WINSTON LOG"+query);
                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db
  
}));


// #####################################  GET CONTENT TYPE LIST ALL ############################################################
app.get('/tnt/contentTypesAll/', accessHandler((req, res) => { 

    //Maria db
    pool.getConnection()
    .then(conn=>{

                    const query =  ' select ' +
                                        ' ct.CONTENT_TYPE_ID as CONTENT_TYPE_ID, '+
                                        ' COALESCE(ct.CONTENT_TYPE_NAME,"") as CONTENT_TYPE_NAME, '+
                                        ' COALESCE(ct.CONTENT_TYPE_CATEGORY,"") as CONTENT_TYPE_CATEGORY, '+
                                        ' COALESCE(ct.CONTENT_TYPE_DESCRIPTION,"") as CONTENT_TYPE_DESCRIPTION, '+
                                        ' COALESCE(ct.CONTENT_TYPE_QUERY,"") as CONTENT_TYPE_QUERY '+
                                    ' from '+
                                        '  CONTENT_TYPE ct ';  
              
                                      
                      wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{
                                              logger.info("WINSTON LOG"+query);
                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db
  
}));

// #####################################  GET CONTENT TYPE DATA ############################################################
app.get('/tnt/contentType/:id', accessHandler((req, res) => { 

    //Maria db
    pool.getConnection()
    .then(conn=>{

                    const query =  ' select ' +
                                        ' ct.CONTENT_TYPE_ID as CONTENT_TYPE_ID, '+
                                        ' COALESCE(ct.CONTENT_TYPE_NAME,"") as CONTENT_TYPE_NAME, '+
                                        ' COALESCE(ct.CONTENT_TYPE_CATEGORY,"") as CONTENT_TYPE_CATEGORY, '+
                                        ' COALESCE(ct.CONTENT_TYPE_DESCRIPTION,"") as CONTENT_TYPE_DESCRIPTION, '+
                                        ' replace(ct.CONTENT_TYPE_QUERY,"\\\"", "\\"")  as CONTENT_TYPE_QUERY '+
                                    ' from '+
                                        '  CONTENT_TYPE ct '+
                                        " where ct.CONTENT_TYPE_ID='"+req.params.id+"' ";  
              
                                      
                      wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{
                                              logger.info("WINSTON LOG"+query);
                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db
  
}));

// #####################################  UPDATE CONTENT TYPE  ############################################################
app.put('/tnt/contentType/:id', accessHandler((req, res) => { 

    //wpdlog("functionality_id "+req.params.id);

    //Maria db

    pool.getConnection()
    .then(conn=>{

                    var qTypeQry = escapeChar(req.body.CONTENT_TYPE_QUERY,"'",'"' );
                    qTypeQry = escapeChar(qTypeQry, '\\"', '"');

                    const query = "update  CONTENT_TYPE " + 
                                    "set CONTENT_TYPE_NAME  ='" + req.body.CONTENT_TYPE_NAME  + "', " +
                                        "CONTENT_TYPE_CATEGORY   ='" + req.body.CONTENT_TYPE_CATEGORY  + "',  " +     
                                        "CONTENT_TYPE_DESCRIPTION   ='" + req.body.CONTENT_TYPE_DESCRIPTION  + "',  " +     
                                        "CONTENT_TYPE_QUERY  ='" + qTypeQry  + "'  " +  
                                    "where  "+
                                        "CONTENT_TYPE_ID  ='" +req.params.id +"' " ; 
              
              
                      wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          wpdlog(err);
          //not connected
      });



    //Maria db


}));

// #####################################  DELETE CONTENT TYPE  ############################################################
app.delete('/tnt/contentType/:id', accessHandler((req, res) => { 

    

    //Maria db

    pool.getConnection()
    .then(conn=>{

                    const query = "delete from  CONTENT_TYPE " + 
                                  "where  "+
                                  "CONTENT_TYPE_ID  ='" +req.params.id +"' " ; 
              
              
                      //wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{

                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);                             
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });



    //Maria db


}));

// #####################################  GET CUSTOM REPORT LIST ############################################################
app.get('/tnt/customReports/:id', accessHandler((req, res) => { 

    //Maria db
    pool.getConnection()
    .then(conn=>{

      
                    const query =  ' select ' +
                                        ' cr.CUSTOM_REPORT_ID as CUSTOM_REPORT_ID, '+
                                        " COALESCE(replace(cr.CUSTOM_REPORT_NAME,'\\\'','\\''),'') as CUSTOM_REPORT_NAME, "+  
                                        ' COALESCE(cr.TRANSITION_ID,"") as TRANSITION_ID, '+                                        
                                        ' COALESCE(cr.VERSION,"") as VERSION, '+
                                        ' COALESCE(date_format(cr.UPDATED_AT, "%m/%d/%Y"),"") as LAST_MODIFIED, '+
                                        ' COALESCE(date_format(cr.REPORT_GENERATED_AT, "%m/%d/%Y"),"") as REPORT_GENERATED_AT '+
                                    ' from '+
                                        '  CUSTOM_REPORT cr '+
                                        '  where '+
                                        "      cr.TRANSITION_ID ='" +req.params.id +"' " ; 
              
                                      
                      wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{
                                              logger.info("WINSTON LOG"+query);
                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);     
                                              wpdlog("finalresponse "+finalresponse);                         
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db
  
}));

// #####################################  GET CUSTOM REPORT LIST ADMIN ############################################################
app.get('/tnt/customReportsAdmin/:reportType', accessHandler((req, res) => { 

    var reportType = req.params.reportType;

    //Maria db
    pool.getConnection()
    .then(conn=>{

                    const query =  ' select ' +
                                        ' cr.CUSTOM_REPORT_ADMIN_ID as CUSTOM_REPORT_ID, '+
                                        ' COALESCE(cr.CUSTOM_REPORT_NAME,"") as CUSTOM_REPORT_NAME, '+                                        
                                        ' COALESCE(cr.VERSION,"") as VERSION, '+
                                        ' COALESCE(date_format(cr.UPDATED_AT, "%m/%d/%Y"),"") as LAST_MODIFIED, '+
                                        ' COALESCE(date_format(cr.REPORT_GENERATED_AT, "%m/%d/%Y"),"") as REPORT_GENERATED_AT '+
                                    ' from '+
                                        '  CUSTOM_REPORT_ADMIN cr '+
                                        "    where cr.REPORT_TYPE='"+reportType+"'"; 
                                                    
                      wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{
                                              logger.info("WINSTON LOG"+query);
                                              var objToJson = result;
                                              var response = [];
                                              for (var key in result) {
                                                  //wpdlog("Result "+result[key]);
                                                  response.push(result[key]);
                                              }
                                              objToJson.response = response;
                                              finalresponse = JSON.stringify(objToJson);     
                                              wpdlog("finalresponse "+finalresponse);                         
                                              conn.release();    
                                              res.end(finalresponse);                                                
                                  })
                                  .catch(err => {
                                              //handle error
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });


    //Maria db
  
}));

// #####################################CREATE A NEW CUSTOM REPORT ############################################################
app.post('/tnt/customReport/:id', accessHandler((req, res) => { 

    transitionId = req.params.id
    fileContent = JSON.stringify(req.body.FILE_CONTENT);
    wpdlog("fileContent "+fileContent);

    pool.getConnection()
    .then(conn=>{

                    const query =  " insert into CUSTOM_REPORT(  "+
                                            "CUSTOM_REPORT_ID, "+                                
                                            "CUSTOM_REPORT_NAME, "+                                            
                                            "TRANSITION_ID,"+     
                                            "VERSION,"+     
                                            "UPDATED_AT,"+
                                            "REPORT_GENERATED_AT"+ " ) values ( "+
                                            "null,"+                            
                                            "'"+escapeChar(req.body.CUSTOM_REPORT_NAME,"\'", "\\'")+"',"+                                            
                                            "'"+transitionId+"', "+     
                                            "'"+escapeChar(req.body.VERSION,"\'", "\\'")+"',now(),"+
                                            "null " +") ";  
                                            
              
              
                      wpdlog("query "+query);

                      

                      conn.query(query)
                                  .then((result1)=>{
                                        conn.query(" SELECT LAST_INSERT_ID() as PKEY ")
                                             .then((result)=>{

                                                wpdlog("Result "+result[0].PKEY);
                                                reportId = result[0].PKEY;
                                                //const filePath = '/report/'+transitionId+'/'+transitionId+"-"+reportId+'.txt';
                                                const filePath = '/report/'+transitionId+'/'+transitionId+"-"+reportId+'/'+transitionId+"-"+reportId+'.txt';
                                                fsextra.ensureFileSync(filePath);
                                                fsextra.writeFile(filePath,fileContent );

                                                //const imageFolderPath = '/report/'+transitionId+'/'+transitionId+"-"+reportId+'/'+'media';
                                                //fsextra.ensureFileSync(imageFolderPath);

                                                //const generatedReportPath = '/report/'+transitionId+'/'+transitionId+"-"+reportId+'/'+'generated';
                                                //fsextra.ensureFileSync(generatedReportPath);
                                               
                                                var objToJson = result;
                                                var response = [];
                                                for (var key in result) {
                                                    wpdlog("Result "+result[key].PKEY);
                                                    response.push(result[key]);
                                                }
                                                objToJson.response = response;
                                                finalresponse = JSON.stringify(objToJson);   
                                                wpdlog("finalresponse "+finalresponse);                                                
                                                conn.release();    
                                                res.end(finalresponse);   

                                            })
                                            .catch(err => {
                                                        //handle error
                                                        wpdlog(err);
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                            })                                                 
                                             
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })                                
          
      }).catch(err => {
          //not connected
      });
     

    //Maria db
    //wpdlog(" Name "+req.body.ROLE_NAME);
    //wpdlog("Description "+req.body.ROLE_DESCRIPTION);
  
}));

// #####################################CREATE A NEW CUSTOM REPORT TEMPLATE/ADMIN ############################################################
app.post('/tnt/customReportAdmin/:reportType', accessHandler((req, res) => { 


    wpdlog("customReportAdmin entered ");
    reportType = req.params.reportType;
    fileContent = JSON.stringify(req.body.FILE_CONTENT);
    wpdlog("fileContent "+fileContent);
    

    pool.getConnection()
    .then(conn=>{

                    const query =  " insert into CUSTOM_REPORT_ADMIN(  "+
                                            "CUSTOM_REPORT_ADMIN_ID, "+                                
                                            "CUSTOM_REPORT_NAME, "+
                                            "REPORT_TYPE, "+                                              
                                            "VERSION,"+     
                                            "UPDATED_AT,"+
                                            "REPORT_GENERATED_AT"+ " ) values ( "+
                                            "null,"+                            
                                            "'"+escapeChar(req.body.CUSTOM_REPORT_NAME,"\'", "\\'")+"',"+          
                                            "'"+reportType+"',"+                                          
                                            "'"+escapeChar(req.body.VERSION,"\'", "\\'")+"',now(),"+
                                            "null " +") ";  
              
                                            
                      wpdlog("query "+query);

                      

                      conn.query(query)
                                  .then((result1)=>{
                                        conn.query(" SELECT LAST_INSERT_ID() as PKEY ")
                                             .then((result)=>{

                                                wpdlog("Result "+result[0].PKEY);
                                                reportId = result[0].PKEY;
                                                //const filePath = '/report/'+transitionId+'/'+transitionId+"-"+reportId+'.txt';
                                                const filePath = '/report/admin/'+reportType+'/'+reportType+"-"+reportId+'/'+reportType+"-"+reportId+'.txt';
                                                fsextra.ensureFileSync(filePath);
                                                fsextra.writeFile(filePath,fileContent );                                               
                                                var objToJson = result;
                                                var response = [];
                                                for (var key in result) {
                                                    wpdlog("Result "+result[key].PKEY);
                                                    response.push(result[key]);
                                                }
                                                objToJson.response = response;
                                                finalresponse = JSON.stringify(objToJson);   
                                                wpdlog("finalresponse "+finalresponse);                                                
                                                conn.release();    
                                                res.end(finalresponse);   

                                            })
                                            .catch(err => {
                                                        //handle error
                                                        wpdlog(err);
                                                        res.send({"Fetch" : "Fail" });
                                                        conn.release();  
                                            })                                                 
                                             
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              res.send({"Fetch" : "Fail" });
                                              conn.release();  
                                  })                                
          
      }).catch(err => {
          //not connected
      });
     

    //Maria db
    //wpdlog(" Name "+req.body.ROLE_NAME);
    //wpdlog("Description "+req.body.ROLE_DESCRIPTION);
  
}));

// ##################################### UPDATE CUSTOM REPORT ############################################################
app.put('/tnt/customReport/:transitionId/:reportId', accessHandler((req, res) => { 

    transitionId = req.params.transitionId;
    reportId = req.params.reportId;
    fileContent = JSON.stringify(req.body.FILE_CONTENT);
    wpdlog("fileContent "+fileContent);


    pool.getConnection()
    .then(conn=>{              
                    const query =  " update CUSTOM_REPORT  "+
                                      " set CUSTOM_REPORT_NAME  ='"+escapeChar(req.body.CUSTOM_REPORT_NAME,"\'", "\\'") +"', "+                    
                                                      " VERSION ='"+escapeChar(req.body.VERSION,"\'", "\\'")+"', "+
                                                      "  UPDATED_AT=now() "+
                                                     " where CUSTOM_REPORT_ID='"+reportId+"'";                                                                                                                         
                      wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{
                                       conn.release();                  
                                       const filePath = '/report/'+transitionId+'/'+transitionId+"-"+reportId+'/'+transitionId+"-"+reportId+'.txt';
                                       fsextra.ensureFileSync(filePath);
                                       fsextra.writeFile(filePath,fileContent );
                                       var result = '{"result":"1"}';
                                       res.send("["+result+"]");                
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              var result = '{"result":"0"}';
                                              res.send("["+result+"]");   
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });
  
}));

// ##################################### DELETE CUSTOM REPORT ############################################################
app.delete('/tnt/customReport/:reportId', accessHandler((req, res) => { 

    transitionId = req.params.transitionId;
    reportId = req.params.reportId;
    fileContent = JSON.stringify(req.body.FILE_CONTENT);
    wpdlog("fileContent "+fileContent);


    pool.getConnection()
    .then(conn=>{              
                    const query =  " delete from  CUSTOM_REPORT  "+
                                                     " where CUSTOM_REPORT_ID='"+reportId+"'";                                                                                                                         
                      wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{
                                       conn.release();     

                                       const filePath = '/report/'+transitionId+'/'+transitionId+"-"+reportId;
                                       fsextra.remove(filePath)                                
                                       var result = '{"result":"1"}';
                                       res.send("["+result+"]");                
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              var result = '{"result":"0"}';
                                              res.send("["+result+"]");   
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });
  
}));

// ##################################### DELETE CUSTOM REPORT ADMIN ############################################################
app.delete('/tnt/customReportAdmin/:reportId', accessHandler((req, res) => { 

    transitionId = req.params.transitionId;
    reportId = req.params.reportId;
    fileContent = JSON.stringify(req.body.FILE_CONTENT);
    wpdlog("fileContent "+fileContent);


    pool.getConnection()
    .then(conn=>{              
                    const query =  " delete from  CUSTOM_REPORT_ADMIN  "+
                                                     " where CUSTOM_REPORT_ADMIN_ID='"+reportId+"'";                                                                                                                         
                      wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{
                                       conn.release();     

                                       const filePath = '/report/admin/'+reportId;
                                       fsextra.remove(filePath)                                
                                       var result = '{"result":"1"}';
                                       res.send("["+result+"]");                
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              var result = '{"result":"0"}';
                                              res.send("["+result+"]");   
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });
  
}));


// ##################################### UPDATE CUSTOM REPORT ADMIN ############################################################
app.put('/tnt/customReportAdmin/:reportId/:reportType', accessHandler((req, res) => { 

    
    reportId = req.params.reportId;
    reportType = req.params.reportType;

    fileContent = JSON.stringify(req.body.FILE_CONTENT);
    wpdlog("fileContent "+fileContent);

    req.body.VERSION
    pool.getConnection()
    .then(conn=>{              
                    const query =  " update CUSTOM_REPORT_ADMIN  "+
                                      " set CUSTOM_REPORT_NAME  ='"+escapeChar(req.body.CUSTOM_REPORT_NAME,"\'", "\\'") +"', "+                    
                                                      " VERSION ='"+escapeChar(req.body.VERSION,"\'", "\\'")+"', "+                                                      
                                                      "  UPDATED_AT=now() "+
                                                     " where CUSTOM_REPORT_ADMIN_ID='"+reportId+"'";                                                                                                                         
                      wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{
                                       conn.release();                  
                                       const filePath = '/report/admin/'+reportType+'/'+reportType+"-"+reportId+'/'+reportType+"-"+reportId+'.txt';
                                       fsextra.ensureFileSync(filePath);
                                       fsextra.writeFile(filePath,fileContent );
                                       var result = '{"result":"1"}';
                                       res.send("["+result+"]");                
                                  })
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              var result = '{"result":"0"}';
                                              res.send("["+result+"]");   
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });
  
}));

// #####################################  GET REPORT DATA ############################################################
app.get('/tnt/customReport/:transitionId/:reportId', accessHandler((req, res) => { 

    wpdlog("get customReport data");
    var transitionId = req.params.transitionId;
    var reportId = req.params.reportId;
    const filePath = '/report/'+transitionId+'/'+transitionId+"-"+reportId+'/'+transitionId+"-"+reportId+'.txt';
    var contents = fsextra.readFileSync(filePath, 'utf8');

    wpdlog("Before parse "+new Date());
    data_first_level = JSON.parse(contents);
    wpdlog("After parse "+new Date());

    var response = [];
    response.push(contents);

    res.send("["+contents+"]");
    wpdlog(contents);
  
}));

// #####################################  GET REPORT DATA ADMIN ############################################################
app.get('/tnt/customReportAdmin/:reportId/:reportType', accessHandler((req, res) => { 

    wpdlog("get customReport data");
    var transitionId = req.params.transitionId;
    var reportId = req.params.reportId;
    var reportType = req.params.reportType;    
    const inputFilePath = '/report/admin/'+reportType+'/'+reportType+"-"+reportId+'/'+reportType+"-"+reportId+'.txt';
    var contents = fsextra.readFileSync(inputFilePath, 'utf8');

    wpdlog("Before parse "+new Date());
    data_first_level = JSON.parse(contents);
    wpdlog("After parse "+new Date());

    var response = [];
    response.push(contents);

    res.send("["+contents+"]");
    wpdlog(contents);
  
}));


// #####################################  UPLOAD IMAGE DATA ############################################################

app.post('/tnt/uploadImage/:transitionId/:reportType/:customOrAdmin',  (req, res) => { 


    const file = req.file;

    var transitionId = req.params.transitionId;
    var reportType = req.params.reportType;
    var customOrAdmin = req.params.customOrAdmin;



    //wpdlog("transitionId"+req.body.transitionId); 
     
    var imagePath = '';
    if (customOrAdmin =='admin'){
           imagePath = '/report/admin/'+reportType+'/'+'media/';
    }else{
           imagePath = '/report/'+transitionId+'/'+'media/';
    }

    

    wpdlog("imagePath"+imagePath); 


    /*

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          //cb(null, './uploads/')
          cb(null, imagePath)
        },
        filename: function (req, file, cb) {
          //cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname));
          //cb(null, file.fieldname + '-' + Date.now()+".jpeg");
    
          cb(null, file.fieldname + '-' + Date.now());
        }
      })
       
      var upload = multer({ storage: storage }).single('fileKey')

      */


      let upload = multer({
        storage: multer.diskStorage({
          destination: (req, file, callback) => {
            
            //let path = '/report//${imagePath}';
            let path = '/report//${imagePath}';
            fsextra.mkdirsSync(imagePath);
            callback(null, imagePath);
          },
          filename: function (req, file, cb) {
            //cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname));
            //cb(null, file.fieldname + '-' + Date.now()+".jpeg");
      
            cb(null, file.fieldname + '-' + Date.now());
          }
        })
      }).single('fileKey');


    upload(req, res, (err) =>{

        //wpdlog("body TID"+req.body.transitionId); 

        if (err){

        }else{
            wpdlog(req.file);
            res.send(req.file);
        }
    });


    //res.send(file); 
    //res.send({"filename" : file.filename });
});

//######################################  DOWNLOAD IMAGE ###############################################################
app.get('/tnt/downloadImage/:transitionId/:filename/:reportType/:customOrAdmin', accessHandler((req, res) => { 

    wpdlog("downloadImage");
    //var pathname = '/uploads/fileKey-1574353052059';
    //var pathname ='./uploads/'+req.params.filename;

    var transitionId = req.params.transitionId;
    var reportType = req.params.reportType;
    var customOrAdmin = req.params.customOrAdmin;

    var imagePath = '';

    if (customOrAdmin == 'admin'){
           imagePath = '/report/admin/'+reportType+'/'+'media/'+req.params.filename;
    }else{
           imagePath = '/report/'+transitionId+'/'+'media/'+req.params.filename;
    }


    wpdlog("imagePath" +imagePath);

    fs.readFile(imagePath, function(err, data){
        wpdlog(data);
        res.setHeader('Content-type', 'image/jpg' );
        res.end(data);
    });

}));

//########################################## GENERATE PPT CUSTOM REPORT #################################################

//app.post('/tnt/generatePPTReport/:transitionId/:reportId/:customOrAdmin/:reportType/:reportMedium', accessHandler((req, res) => { 


function  generateCustomPPTReport(transitionId,reportId, customOrAdmin, reportType ){


    wpdlog("get customReport data");
    //var transitionId = req.params.transitionId;
    //var reportId = req.params.reportId;
    //var customOrAdmin = req.params.customOrAdmin;
    //var reportType = req.params.reportType;


    var inputFilePath ='';

    if (customOrAdmin =='admin'){
         inputFilePath = '/report/admin/'+reportType+'/'+reportType+"-"+reportId+'/'+reportType+"-"+reportId+'.txt';
         outputFilePath = '/report/admin/'+reportType+'/'+reportType+"-"+reportId+'/'+reportType+"-"+reportId+'.pptx';
    }else{
         inputFilePath = '/report/'+transitionId+'/'+transitionId+"-"+reportId+'/'+transitionId+"-"+reportId+'.txt';
         outputFilePath = '/report/'+transitionId+'/'+transitionId+"-"+reportId+'/'+transitionId+"-"+reportId+'.pptx';
    }
          
    var imagePathAbsolute =  '/report/'+transitionId+'/media/';
    var contents = fsextra.readFileSync(inputFilePath, 'utf8');

    var reports = JSON.parse(contents);

    

    let pptx = new PptxGenJS();
    



   let titleSlide = pptx.addNewSlide(); 

   let arrTitlePageObjs = [];
   arrTitlePageObjs.push({ text: reports.header.report_name, options:{  underline:true, color:titleColor,font:40 } });
   if (reports.header.version !=''){
        arrTitlePageObjs.push({ text: 'VERSION:'+reports.header.version, options:{  underline:true, color:titleColor, }});
   }
   titleSlide.addText(arrTitlePageObjs,   { shape:pptx.shapes.RECTANGLE, autoFit:true, x:'0%', y:'0%', w:'100%', h:'100%', fill:'F1F1F1', align:'center',fontSize:40 });        

   wpdlog("i "+reports.data);

   var textboxText ="";


   let slide = undefined;
   

    for(var i=0; i<reports.data.length;i++) {
           
        //based on the section type appropriate section to be intialized

        wpdlog(" Slide value "+reports.data[i].section_data.section_slide);

        if  (reports.data[i].section_data.section_slide =='SAME'){

            wpdlog(" Same slide");
            if (slide == undefined){
                slide = pptx.addNewSlide();
            }            
        }
        else{
               wpdlog(" New slide");
               slide = pptx.addNewSlide();
        }

        var positionX=reports.data[i].section_data.section_position_x+'%';
        wpdlog(" positionX"+positionX);
        var positionY=reports.data[i].section_data.section_position_y+'%';
        wpdlog(" positionY"+positionY);

        var fontSize =parseInt(reports.data[i].section_data.section_font_size);
        wpdlog ("fontSize "+fontSize);  

        
        var fontSizeTitle =parseInt(reports.data[i].section_data.section_title_font_size);
        wpdlog ("fontSizeTitle "+fontSizeTitle); 

        

        var bodyColor =reports.data[i].section_data.section_body_color;
        wpdlog(" bodyColor"+bodyColor);
        var titleColor =reports.data[i].section_data.section_title_color;
        wpdlog(" titleColor "+titleColor);
        var titleBgColor =reports.data[i].section_data.section_title_bg_color;      
        wpdlog ("titleBgColor "+titleBgColor);
        

        var titleHeight =reports.data[i].section_data.section_title_height+'%';
        var bodyHeight =reports.data[i].section_data.section_body_height+'%';
        wpdlog(parseFloat(reports.data[i].section_data.section_title_height/2) );
        wpdlog(parseFloat(reports.data[i].section_data.section_body_height/2));

        wpdlog("reports.data[i].section_data.section_name"+reports.data[i].section_data.section_name +" "+reports.data[i].section_data.section_name.length);

        var bodyPositionY = reports.data[i].section_data.section_position_y;
        if ((reports.data[i].section_data.section_name.trim()) !=='' ){

             bodyPositionY = (parseFloat(reports.data[i].section_data.section_position_y) + parseFloat(reports.data[i].section_data.section_title_height) + 2)+"%"
             let arrTextObjs1 = [];
             arrTextObjs1.push({ text: reports.data[i].section_data.section_name, options:{  underline:true, color:titleColor, } });
             slide.addText(arrTextObjs1,   { shape:pptx.shapes.RECTANGLE, autoFit:true, x:positionX, y:positionY, w:'90%', h:titleHeight, fill:titleBgColor, align:'left', fontSize:fontSizeTitle });        
        }

        if  (reports.data[i].section_data.section_type =='text'){
            wpdlog("reports[0].data[i]"+reports.data[i].section_data.section_content)  ;   
            //slide.addText(reports.data[i].section_data.section_content) ;       
            textboxText = reports.data[i].section_data.section_name +"\n"+reports.data[i].section_data.section_content;
            //let textboxOpts = { x: 1, y: 1, align: "left", color: "363636", fill: "f1f1f1" };
            //slide.addText(textboxText, textboxOpts);  
            //slide.addText(textboxText); 



            //var bodyPositionY = (parseFloat(reports.data[i].section_data.section_position_y) + parseFloat(reports.data[i].section_data.section_title_height/2) + parseFloat(reports.data[i].section_data.section_body_height/2))+'%';
            

            wpdlog ("bodyPositionY "+bodyPositionY);
        
            //slide.addText( arrTextObjs, { x:positionX, y:positionY, w:'90%',fill:bodyColor,outline:{ size:1.5, color:'FF0000' },line:{ pt:'2', color:'A9A9A9' }  } );


            let arrTextObjs = [];
            arrTextObjs.push({ text: reports.data[i].section_data.section_content, options:{ fill:bodyColor } });
            slide.addText(arrTextObjs,   { shape:pptx.shapes.RECTANGLE, autoFit:true, x:positionX, y:bodyPositionY+'%', w:'90%', h:bodyHeight, fill:bodyColor, align:'left', fontSize:fontSize });


        }

        if  (reports.data[i].section_data.section_type =='image'){

            var picTitlePositionY = 0.0;
            var picNotePositionY = 0.0;
            var noteHeight = parseFloat(reports.data[i].section_data.section_note_height);

            wpdlog("noteHeight "+noteHeight);

            // add a same size shape to add border

            slide.addShape( pptx.shapes.RECTANGLE, {x:positionX, y:bodyPositionY+'%', w:6, h:bodyHeight,line:'000000',lineSize:2, fontSize:fontSizeTitle} );

            wpdlog("imagePathAbsolute+reports.data[i].section_data.section_image"+imagePathAbsolute+reports.data[i].section_data.section_image);
            slide.addImage({ path:imagePathAbsolute+reports.data[i].section_data.section_image,x:positionX, y:bodyPositionY+'%', w:6, h:bodyHeight,line:'0088CC'  });
            picTitlePositionY = parseFloat(bodyPositionY) + parseFloat(bodyHeight);
            wpdlog("picTitlePositionY "+picTitlePositionY);

            if ((reports.data[i].section_data.section_pic_name.trim()) !=='' ){
                let arrPicTitleTextObjs = [];
                picTitlePositionY = parseFloat(picTitlePositionY) + 1 ;
                arrPicTitleTextObjs.push({ text: reports.data[i].section_data.section_pic_name, options:{} });
                slide.addText(arrPicTitleTextObjs,   { shape:pptx.shapes.RECTANGLE, autoFit:true, x:positionX, y:picTitlePositionY+'%', align:'left' });
                
                wpdlog("picTitlePositionY "+picTitlePositionY);
            }


            if ((reports.data[i].section_data.section_pic_note.trim()) !=='' ){
                picNotePositionY = parseFloat(picTitlePositionY) + 5 +3;
                let arrNoteTextObjs = [];
                arrNoteTextObjs.push({ text: reports.data[i].section_data.section_pic_note, options:{ fill:bodyColor } });
                slide.addText(arrNoteTextObjs,  { shape:pptx.shapes.RECTANGLE, autoFit:true, x:positionX, y:picNotePositionY+'%', w:'90%', h:noteHeight+'%', fill:bodyColor, align:'left' });

                wpdlog("picNotePositionY "+picNotePositionY);

            }


        }  


        if  (reports.data[i].section_data.section_type =='table'){

            var rows = [];
            var headerRow =[];
            wpdlog("bodyColor "+bodyColor);
           
            for(var k=0; k<reports.data[i].section_data.section_content.header.length; k++){
                   headerRow.push({text:reports.data[i].section_data.section_content.header[k],options:{fill:bodyColor,fontSize:fontSizeTitle}});
            }

            rows.push(headerRow);
            var tabOpts = { x:positionX, y:bodyPositionY+'%', w:'90%',  fontSize:fontSize, autoPage:true };

            for (var j=0; j<reports.data[i].section_data.section_content.data.length; j++){
                  rows.push(reports.data[i].section_data.section_content.data[j])
            }

            slide.addTable( rows, tabOpts );            

        }    


    }    
    

    pptx.save( outputFilePath);

    //Now update CUSTOM_REPORT table for report generation date

    pool.getConnection()
    .then(conn=>{              
                    const query =  " update CUSTOM_REPORT  "+
                                      " set REPORT_GENERATED_AT=now() "+
                                                     " where CUSTOM_REPORT_ID='"+reportId+"'";                                                                                                                         
                      wpdlog("query "+query);

                      conn.query(query)
                                  .then((result)=>{conn.release();})
                                  .catch(err => {
                                              //handle error
                                              wpdlog(err);
                                              conn.release();  
                                  })
          
      }).catch(err => {
          //not connected
      });

    wpdlog(transitionId+"-"+reportId+'.pptx');
    //res.send({"filename" : transitionId+"-"+reportId+'.pptx' });

    }    
//}));    


//####################################### VIEW PPT REPORT #################################################################
app.get('/getCustomReportPPT/:transitionId/:reportId/:reportName/:version/:account/:reportType/:customOrAdmin', accessHandler((req, res) => { 

    var transitionId = req.params.transitionId;
    var reportId = req.params.reportId;

    wpdlog("reportName "+req.params.reportName);
    var reportType = req.params.reportType;
    var customOrAdmin = req.params.customOrAdmin;
    
    //var reportName = decodeURIComponent(req.params.reportName);
    //var version = decodeURIComponent(req.params.version);
    //var account = decodeURIComponent(req.params.account);

    var reportName = req.params.reportName;
    var version = req.params.version;
    var account = req.params.account;

    var filePath = '';
    
    if (customOrAdmin == 'admin'){
           filePath =  '/report/admin/'+reportType+'/'+reportType+"-"+reportId+'/'+reportType+"-"+reportId+'.pptx';
    }else{
           filePath =  '/report/'+transitionId+'/'+transitionId+"-"+reportId+'/'+transitionId+"-"+reportId+'.pptx';
    }
    
    //return res.sendFile(filePath);

    var today = displayDayDDMONYYYY();
    const filename = reportName+'-'+version+"-"+account+"-"+today+".pptx";

    res.download(filePath, filename);    

}));  


//########################################## GENERATE EXCEL CUSTOM REPORT #################################################
//app.post('/tnt/generateExcelCustomReport/:transitionId/:reportId/:customOrAdmin/:reportType/:reportMedium', accessHandler((req, res) => { 

function generateCustomExcelReport(transitionId,reportId,customOrAdmin, reportType) {    

    wpdlog("get customReport data");
    //var transitionId = req.params.transitionId;
    ///var reportId = req.params.reportId;
    //var customOrAdmin = req.params.customOrAdmin;
    //var reportType = req.params.reportType;


    var filePath = '';

    if (customOrAdmin =='admin') {      
           inputFilePath = '/report/admin/'+reportType+'/'+reportType+"-"+reportId+'/'+reportType+"-"+reportId+'.txt';
           outputFilePath = '/report/admin/'+reportType+'/'+reportType+"-"+reportId+'/'+reportType+"-"+reportId+'.xlsx';
    }       
    else{      
           inputFilePath = '/report/'+transitionId+'/'+transitionId+"-"+reportId+'/'+transitionId+"-"+reportId+'.txt';
           outputFilePath = '/report/'+transitionId+'/'+transitionId+"-"+reportId+'/'+transitionId+"-"+reportId+'.xlsx';
    }       


    var imagePathAbsolute =  '/report/'+transitionId+'/media/';
    var contents = fsextra.readFileSync(inputFilePath, 'utf8');
    var reports = JSON.parse(contents);

    var wb = new xl.Workbook();



     wpdlog("Inside reports.data.length "+reports.data.length); 

    for(var i=0; i<reports.data.length;i++) {
           


        // Add section as header of the sheet

        if  (reports.data[i].section_data.section_type =='table'){

                var ws = wb.addWorksheet(reports.data[i].section_data.section_name.trim()); 
                var headerStyle = wb.createStyle({
                    fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    bgColor: '#1D3649',
                    fgColor: '#1D3649',
                    },
                    font: {
                    name: 'Arial',
                    size: 10 ,
                    bold: true,
                    color: 'FFFFFF',
                    },
                    alignment: {
                        horizontal: 'center',
                        vertical: 'center',
                        wrapText: true,
                    },
                });
    

                var row = 1;
                var col = 1;

                // Header
                for(var k=0; k<reports.data[i].section_data.section_content.header.length;k++){


                    ws.column(k+1).setWidth(20);
                    ws.cell( row, col).style(headerStyle);
                    ws.cell( row, col).string(reports.data[i].section_data.section_content.header[k]);
                    col = col + 1;
                }   


                // Data rows                
                var rowStyle = wb.createStyle({
                    alignment: {
                        horizontal: 'left',
                        vertical: 'center',
                        wrapText: true,
                    }
                });
                var row = 2;
                for(var k=0; k<reports.data[i].section_data.section_content.data.length;k++){
                    var col = 1;                                                
                    for(var j=0; j<reports.data[i].section_data.section_content.data[k].length;j++){
                        ws.cell(row, col).style(rowStyle);
                        ws.cell( row, col).string(reports.data[i].section_data.section_content.data[k][j]);
                        col = col + 1;
                    }    
                    row = row + 1;
                }                                 
                wpdlog(" ------------------------------- after drwaing table -------------------------------------");
        }    
    }    

    wb.write( outputFilePath);
    //res.send({"filename" : outputFilePath });
//})); 

}


//########################################## VIEW EXCEL CUSTOM REPORT ##########################################
app.get('/getCustomReportExcel/:transitionId/:reportId/:reportName/:version/:account/:reportType/:customOrAdmin', accessHandler((req, res) => { 

    var transitionId = req.params.transitionId;
    var reportId = req.params.reportId;
    var reportType = req.params.reportType;
    var customOrAdmin = req.params.customOrAdmin;
    //var reportName = decodeURIComponent(req.params.reportName);
    //var version = decodeURIComponent(req.params.version);
    //var account = decodeURIComponent(req.params.account);
    var reportName = req.params.reportName;
    var version = req.params.version;
    var account = req.params.account;

    wpdlog("reportName "+reportName);
    var filePath = '';
    if (customOrAdmin == 'admin')
        filePath = '/report/admin/'+reportType+'/'+reportType+"-"+reportId+'/'+reportType+"-"+reportId+'.xlsx';       
    else
        filePath =  '/report/'+transitionId+'/'+transitionId+"-"+reportId+'/'+transitionId+"-"+reportId+'.xlsx';
            
    //return res.sendFile(filePath);


    
    var today = displayDayDDMONYYYY();
    const filename = reportName+'-'+version+"-"+account+"-"+today+".xlsx";

    res.download(filePath, filename);    

}));  

//######################################### Generate alll media type report ####################################
app.post('/tnt/generateAllMediaCustomReport/:transitionId/:reportId/:customOrAdmin/:reportType/:reportMedium', accessHandler((req, res) => { 

    var transitionId = req.params.transitionId;
    var reportId = req.params.reportId;
    var customOrAdmin = req.params.customOrAdmin;
    var reportType = req.params.reportType;
    
    generateCustomPPTReport(transitionId,reportId,customOrAdmin,reportType  );
    generateCustomExcelReport(transitionId,reportId,customOrAdmin,reportType);

    //send response
    res.send({"filename" : outputFilePath });
 
})); 


//########################################## LOG TRACE ON - OFF #################################################

app.post('/tnt/logTrace/:id', accessHandler((req, res) => { 
    
    log_trace = req.body.log_trace;
    console.log("log_trace "+log_trace);
    res.send({"log_trace" : "OK" });

}));  


app.on('listening', function () {
    wpdlog("Server started");
});


test();
function test(){
     wpdlog("log_trace -"+log_trace);	
}


https.createServer({
    key: fs.readFileSync(config.keys.key),
    cert: fs.readFileSync(config.keys.cert),secureOptions: require('constants').SSL_OP_NO_TLSv1_1 | require('constants').SSL_OP_NO_TLSv1,}, app).listen(config.Index_mariadb_system.index_mariadb_Port);

wpdlog("Example app listening at "+config.Index_mariadb_system.index_mariadb_Port);


displayDayDDMONYYYY();
    
/*

//Start the server
var server = app.listen(config.Index_mariadb_system.index_mariadb_Port, function () {



  var host = server.address().address
  var port = server.address().port

  wpdlog("Example app listening at http://%s:%s", host, port)

})

*/