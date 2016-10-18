// express is the web application framework
var express = require('express');
var app = express();
// The path module provides utilities for working with file and directory paths
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

// The app object is instantiated on creation of the Express server
app.use(express.static(path.join(__dirname, 'public')));
console.log('app.stack')

app.get('/orig', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/db.html'));
});

// callback function whose parameters are request and response objects.
// req - represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers (https://www.tutorialspoint.com/nodejs/nodejs_request_object.htm)
// res - the HTTP response that an Express app sends (https://www.tutorialspoint.com/nodejs/nodejs_response_object.htm)
app.post('/db', function(req, res) {
    // console.log('In route');
    // var sql = require('mssql');
    // //mssql://username:password@localhost/database"
    // sql.connect("mssql://ARU_Admin:ARSAdmin13@ROST3102.test.allstate.com/DUD_ARS_POC").then(function() {
    //     console.log('We are here');
    //     new sql.Request().query('select * from dbo.table').then(function(recordset) {
    //
    //         console.dir(recordset);
    //         res.end('success');
    //     }).catch(function(err) {
    //         console.log('Opps')
    //             // ... query error checks
    //     });
    // });
    var sql = require('mssql');

    // var config = {
    //     user: 'ARU_Admin',
    //     password: 'ARSAdmin13',
    //     server: 'ROST3102.test.allstate.com', // You can use 'localhost\\instance' to connect to named instance
    //     database: 'DUD_ARS_POC',
    //
    //     options: {
    //         encrypt: false // Use this if you're on Windows Azure
    //     }
    // }


    // Integrated Security = false
    sql.connect("Data Source=ROST3102.test.allstate.com;User Id=ARU_Admin;Password=ARSAdmin13;Initial Catalog=DUD_ARS_POC;Persist Security Info=True")
        .then(function() {
            //console.log('Here');
            // sql.connect(config).then(function() {
            // Query

            new sql.Request()
                //     // .input('input_parameter', sql.Int, value);
                .query('select * from TestTable').then(function(recordset) {
                    console.log('Select * from TestTable');
                    console.dir(recordset);
                    y();
                }).catch(function(err) {
                    console.log('Error found1', err);
                    // ... error checks
                });

        }).catch(function(err) {
            // ... error checks
            console.log('Error found2', err);

        });
});

var y = function insertIt() {
    var sql = require('mssql');
    sql.connect("Data Source=ROST3102.test.allstate.com;User Id=ARU_Admin;Password=ARSAdmin13;Initial Catalog=DUD_ARS_POC;Persist Security Info=True")
        .then(function() {
            console.log('Transaction')
            var transaction = new sql.Transaction();
            transaction.begin(function(err) {
                // ... error checks
                if (err) {
                    console.log('Err is', err)
                }

                var request = new sql.Request(transaction);
                var bytes = Array(6); // array of bytes to be send
                bytes[0] = 0x4;
                bytes[1] = 0x0;
                bytes[2] = 0xFF;
                bytes[3] = 0x01;
                bytes[4] = 0x20;
                bytes[5] = 0x0;
                //const buf4 = Buffer.from([1, 2, 3]);

                request.query('insert into TestTable (Id, FileBlob) VALUES (4, 0x24060)', function(err, recordset) {
                    // request.query("insert into dbo.TestTable (Name) VALUES ('NewUser')",  function(err, recordset) {
                    // ... error checks
                    if (err) {
                        console.log('Error inserting', err);
                    }
                    console.log('Before commit')

                    transaction.commit(function(err, recordset) {
                        // ... error checks

                        console.log("Transaction committed.");
                    });
                });
            });
        })
}

app.post('/upload', function(req, res) {

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/uploads');
    console.log(form.uploadDir);

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);

});

var server = app.listen(3000, function() {
    console.log('Server listening on port 3000');
});
