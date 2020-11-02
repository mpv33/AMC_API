"# AMC_API" 
# About:
AMC API :  adding detials of AMC via API and finding total AMC cost using nodejs and mysql

# prerequest-
npm install node 


# API ROOT : POSTMAN
## http://localhost:8000/show: GET- its showing all amc detials table which is added in mysql data bases.
## http://localhost:8000/Add:  POST-here you can add your AMC  data in mysql via postman given below format -
 
 
 " {
	"amcName": "abcd",
 	"cityType": "T1",
 	"service": {
 		"name": "abcd_ser",
		"quantity": 10,
		"unit": 2,
		"actualPrice": 10000,
    "discount": 1000,
		"amcPrice": 9000
	},
	"part": {
		"name": "abcd_ser",
    "quantity": 10,
 		"unit": 2,
 		"actualPrice": 10000,
 		"discount": 1000,
		"amcPrice": 9000
 	}
 }
"
## http://localhost:8000/Toatal-AMC-Cost: GET- you can find here total amc -part and service name cost .



