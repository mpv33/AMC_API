
const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());


var mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'mpv',
  password: 'Balba@1234',
  database: 'ACM_DB',
  multipleStatements: true
});

mysqlConnection.connect((err) => {
  if (!err)
      console.log('DB connection succeded.');
  else
      console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


const CreateSchema = () => {
  const sql1 = `
    CREATE TABLE IF NOT EXISTS AMC_SERVICE (
      serviceId INT NOT NULL AUTO_INCREMENT,
      service_name VARCHAR(100) NOT NULL,
      service_quantity INT NOT NULL,
      service_unit INT NOT NULL,
      service_actual_price INT NOT NULL,
      service_discount INT NOT NULL,
      service_amc_price INT NOT NULL,
      PRIMARY KEY ( serviceId )
  );`
  const sql2 = `
    CREATE TABLE IF NOT EXISTS AMC_PART (
      partId INT NOT NULL AUTO_INCREMENT,
      part_name VARCHAR(100) NOT NULL,
      part_quantity INT NOT NULL,
      part_unit INT NOT NULL,
      part_actual_price INT NOT NULL,
      part_discount INT NOT NULL,
      part_amc_price INT NOT NULL,
      PRIMARY KEY ( partId )
    );
  `
  const sql3 = `
    CREATE TABLE IF NOT EXISTS AMC_DETAIL (
    amcId INT NOT NULL AUTO_INCREMENT,
    detail_name VARCHAR(100) NOT NULL,
    detail_city_type VARCHAR(100) NOT NULL,
    serviceId INT,
    partId INT,
      FOREIGN KEY (serviceId) REFERENCES AMC_SERVICE(serviceId),
      FOREIGN KEY (partId) REFERENCES AMC_PART(partId),
      PRIMARY KEY ( amcId )
    );
  `
  mysqlConnection.query(
    sql1,
    (err, rows, fields) => {
      if(!err) {
        mysqlConnection.query(
          sql2,
          (err, rows, fields) => {
            if(!err) {
              mysqlConnection.query(
                sql3,
                (err, rows, fields) => {
                  if(!err) {
                    console.log('Schema created successfully')
                  }
                  else
                    console.log(err)
                })
            }
            else
              console.log(err)
          })
      }
      else
        console.log(err)
    })
} 

app.listen(3000, () => {
  console.log('Express server is runnig at port no : 3000')
  CreateSchema()
});


//Get all AMC detial
app.get('/show', (req, res) => {
  let getAllquery = `
  SELECT * FROM ACM_DB.AMC_DETAIL AS DETAIL 
	INNER JOIN 
		ACM_DB.AMC_PART AS PART ON DETAIL.partId  = PART.partId 
	INNER JOIN 
		ACM_DB.AMC_SERVICE AS SERVICE ON DETAIL.serviceId  = SERVICE.serviceId;
  `
  mysqlConnection.query(getAllquery, (err, rows) => {
      if (!err){

        res.send(rows);
        console.log(rows);

      }
      else{

        console.log(err);
        res.send(err)

      }
      
  })
});

app.get('/Total-AMC-Cost', (req, res) => {
  let getAllquery = `
  SELECT * FROM ACM_DB.AMC_DETAIL AS DETAIL 
	INNER JOIN 
		ACM_DB.AMC_PART AS PART ON DETAIL.partId  = PART.partId 
	INNER JOIN 
		ACM_DB.AMC_SERVICE AS SERVICE ON DETAIL.serviceId  = SERVICE.serviceId;
  `
  mysqlConnection.query(getAllquery, (err, rows) => {
      if (!err){
        let sum = 0
        rows.forEach(e => {
          sum += e.part_amc_price + e.service_amc_price
        })
        res.send({
          Total_AMC_Price : sum
        });
        console.log('Total AMC Price : ',sum)

      }
      else{

        console.log(err);
        res.send(err)

      }
      
  })
});


// {
// 	"amcName": "abcd",
// 	"cityType": "T1",
// 	"service": {
// 		"name": "abcd_ser",
// 		"quantity": 10,
// 		"unit": 2,
// 		"actualPrice": 10000,
// 		"discount": 1000,
// 		"amcPrice": 9000
// 	},
// 	"part": {
// 		"name": "abcd_ser",
// 		"quantity": 10,
// 		"unit": 2,
// 		"actualPrice": 10000,
// 		"discount": 1000,
// 		"amcPrice": 9000
// 	}
// }



app.post('/Add', (req, res) => {
  let amc = req.body;
  let service = amc.service
  let part = amc.part
  let serviceID = null
  let partID = null
  let sql_service = "INSERT INTO ACM_DB.AMC_SERVICE (service_name, service_quantity, service_unit, service_actual_price, service_discount, service_amc_price)VALUES(?, ?, ?, ?, ?, ?);"
  let sql_part = "INSERT INTO ACM_DB.AMC_PART (part_name, part_quantity, part_unit, part_actual_price, part_discount, part_amc_price) VALUES(?, ?, ?, ?, ?, ?);"
  let sql_amc = "INSERT INTO ACM_DB.AMC_DETAIL (detail_name, detail_city_type, serviceId, partId) VALUES(?, ?, ?, ?);"
   //console.log(amc)
  mysqlConnection.query(
    sql_service,
    [service.name, service.quantity, service.unit, service.actualPrice, service.discount, service.amcPrice ],
    (err, rows) => {

      if (!err) {
        serviceID = rows.insertId
        mysqlConnection.query(
          sql_part,
          [part.name, part.quantity, part.unit, part.actualPrice, part.discount, part.amcPrice ],
          (err, rows) => {
            if (!err) {
              partID = rows.insertId
              mysqlConnection.query(
                sql_amc,
                [amc.amcName, amc.cityType, serviceID, partID],
                (err, rows) => {
                  if (!err) {
                    res.send("all data updated successfully: ")
                    console.log(rows)
                  }
                  else
                    res.send(err)
                    console.log(err)
                })
            }
            else
              res.send(err)
              console.log(err)
        })

        }
      else
        res.send(err)
        console.log(err)
    })
 
});




