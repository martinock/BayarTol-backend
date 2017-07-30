'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dateTime = require('node-datetime');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "upiki-77460",
    clientEmail: "firebase-adminsdk-lare7@upiki-77460.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCmmtLYAh/rh3xO\nRCbk9xEn0ja9BE6U0nxp8oA60jXMJnV9sGif3I3L65cgTVtheyHvxHT0xqnktI53\nO3hPbGHUhc8Qi8Ipw07pX+xQpw/KTWFnT4ecIB3AhzpejVyWnEDFLGZMDtD1p/nd\n0XSxCjj7zk+pxuAeBUd4B5E5Yo0CjDZ9caS9rhmAlRVtCGRO0PENy+zvpctXFn9L\nZ42fedXxxQA+nLM8tDC2U9UXEQOI8aa71wnz5gYKWkQGUz3VBbr+dDS8sToe3QNr\nTDDF0h8AGpo63GOqXKzM3omr5pEcftxqz0PMXd6oV11UwX7xYP0zC1jLM1S3mnBq\ni3Bsyci1AgMBAAECggEAGhqjE5ZNow1A9FBoWbK+fONKkVYl69qJBN6qqcy7Aig6\ne32S/w1DKGLa9IQ6X6031YYOHzYrc3q44cSvJp6gO3jVx01mmD2SVS2i7MYoSrXS\nH6pN4LAFiV+GzT7P9Yc4/MvmoV8m7X6qv08svfqQkB+0yrCu9/UyzAM/hWLEHlRR\nogCHLYyTrmAOnMvMFqd/J0jYdD8A59o1IEvJsYtFQs5Q10w3i3m1PaVEt0dv2uJS\nPrOImirhGHlWAi+JBL5V13OK4Kxp9TkCbXKbSs98Cr9r078bkbpS+GubUEknzrLR\np5uDJ44cU/1VfNWkCDQ5+O5fJHyBnJsu3sUVuB8b0QKBgQDoLMoekqQ/4tWDAneo\n+xLXGTCVxsAEV+Xyl4oKNaAPaRE/akJLW0O4t7r/BXgsSobhgXhugq+uLd4ReIgB\n43b/N9hOnV14wr4J2jduO4V2iyWaksg8+wSFiHmOXqI1um9HaNcI8MZSaLNNRMFr\nSXt2LIWaAdQfFwWLeNIvGVUzWQKBgQC3s4NCDkZQQx6exeaiD6erK1eMVZ/H5d6q\nYeVEWw4lqtSLuXbLD/DrFyDmArwNTD/JbaHmWo0CB2FF2YHO89RzKIOu3ulitRYy\nD4DdlF1Qu5LrdWV6t7lEAY22YkJlyGKqv7/xSS4rR0pgHEmzQMbyFgh99UVhAPS9\nmtqjNf3gvQKBgQCkzBXzOXcoeaO/yCKTaRNoZlLcHSTycEmhtfqfYIzqI1PAxXWk\n83TQSmmK1qEEHyo6KqIHHvAAHEKB+CHh5UjzwvngY0aTjvdBGwk5TzpeeEoKu6Ex\n16LP/Zz6dyWAKYMPFtV7XRwIJpUOhX0c4B2oNdXnCOE96CNhajMWh064kQKBgCMd\nvcmy0N4m9oODcUMpmvOtpV6+P30HBDmt3RXkEiBBN8A+A+dtdLB8C13sx+YC3W6z\n9m8CgFIS9xVTLu1Qzxv0crfLBPJJi6SmMgwpgG0ebkd0eaGr3U6SvXRP9EFgvPvH\nC/oj8x9y0VTuE2igyWcdryHk8Q5KEH7uSz1H5PBBAoGAYtHi2bQNRYzrDhcEW/Mx\nD7AaUuHZVnDrbBlvN7gI3tsQqs9C7pBn/aoHXd6g8nUgJ6dMB++P99McoZI5J0yh\ngvFoZWLrvVh5V4YLUvwEEiixdMF3rjQBAtlJsqV9vJlFwM1NHSZBa4gGAk49R8SA\nRbs3Hs1HoPCpWJ+CfYRBAjU=\n-----END PRIVATE KEY-----\n"
  }),
  databaseURL: "https://upiki-77460.firebaseio.com/"
});


exports.register = functions.https.onRequest((req, res) => {
	switch (req.method) {
	    case 'POST':
	   		switch (req.get('content-type')) {
	   			case 'application/json':
					admin.auth().createUser({
						email: req.body.email,
						emailVerified: false,
						password: req.body.password,
						displayName: req.body.name,
						disabled: false
					})
					.then(function(userRecord) {
						if (req.body.role == 'user') {
							var data = {
								name: req.body.name,
								phone_number: req.body.phone_number,
								address: req.body.address,
								money: 0,
								email: req.body.email
							};

							admin.database().ref("/users").child(userRecord.uid).set(data);

							var body = {
								uid: userRecord.uid
							};

							//Set New User Data
							res.type('application/json');
							res.status(200).send({data: body});

						}
						else if (req.body.role == 'toll') {
							var data = {
								name: req.body.name,
								cost: req.body.cost
							};

							admin.database().ref("/tolls").child(userRecord.uid).set(data);

							var body = {
								uid: userRecord.uid
							};

							//Set New User Data
							res.type('application/json');
							res.status(200).send({data: body});
						}
						else {

						}
					})
					.catch(function(error) {
						res.status(404).send({ error: error.message });
					});
					break;
				default:
					res.status(400).send({ error: 'Wrong Application Type' });
			}
	      break;
	    default:
			res.status(400).send({ error: 'Undefined Request Method' });
			break;
  	}
});

exports.profile = functions.https.onRequest((req, res) => {
	switch (req.method) {
	    case 'GET':
		    if (req.query.role == 'user') {
		    	admin.database().ref("/users").child(req.query.uid).on("value", function(snapshot) {
					res.type('application/json');
					res.status(200).send({data: snapshot.val()});
				}, function (errorObject) {
					res.status(errorObject.code).send({ error: 'Read data failed' });
				});
		    }
		    else {
		    	admin.database().ref("/tolls").child(req.query.uid).on("value", function(snapshot) {
					res.type('application/json');
					res.status(200).send({data: snapshot.val()});
				}, function (errorObject) {
					res.status(errorObject.code).send({ error: 'Read data failed' });
				});
		    }
			
	      	break;
	    default:
			res.status(400).send({ error: 'Undefined Request Method' });
			break;
  	}
});

exports.transaction = functions.https.onRequest((req, res) => {
	switch (req.method) {
	    case 'GET':
			var dt = dateTime.create();
			var formattedDatetime = dt.format('Y-m-d H:M:S');
			var tollData;
			var money;
			var name;

			console.log(req.query.uid);
			admin.database().ref("/users").child(req.query.uid).once("value", function(snapshot) {
				console.log(snapshot.val());
				money = snapshot.val().money;
				name = snapshot.val().name;
			});

			admin.database().ref("/tolls").child(req.query.tid).on("value", function(snapshot) {
				tollData = snapshot.val();

				if (tollData.cost > money) {
					res.type('application/json');
					res.status(200).send({data: {status: 'error', msg: 'money not enough'}});
				}
				else {
					var data = {
						uid: req.query.uid,
						tid: req.query.tid,
						name: name,
						toll_name: tollData.name,
						cost: tollData.cost,
						datetime: formattedDatetime,
						is_business: req.query.is_business
					}

					admin.database().ref("/transactions").child(req.query.uid).push().set(data)

					res.type('application/json');
					res.status(200).send({data : {status: 'OK'}});
				}
			}, function (errorObject) {
				res.status(errorObject.code).send({ error: 'Read data failed' });
			});
	    break;
	    case 'POST':
	    	var member_data = []
	    	var return_data = []

			admin.database().ref("/organizations").child(req.body.uid).once('value', function(snapshot) {
	    		for(var memberKey in snapshot.val().member){
	    			member_data.push(memberKey);
	    		}
	    	})
	    	.then(function(){
	    		//var startDate = new Date(req.body.start_date).getTime();
				//var endDate = new Date(req.body.end_date).getTime();

	    		admin.database().ref("/transactions").once('value', function(snapshot) {
	    			for (var i = 0; i < member_data.length; i++) {
	    				if(snapshot.val().hasOwnProperty(member_data[i])) {
					        for(var memberKey in snapshot.val()[member_data[i]]) {
		    					var data = snapshot.val()[member_data[i]][memberKey];

		    					//if (req.query.start_date == '' || req.query.end_date == '') {
		    						if (data.is_business) {
			    						var arrayData = {
							    		 	toll_name: data.toll_name, 
							    		 	cost: data.cost, 
							    		 	name: data.name,
							    		 	datetime: data.datetime
							    		};
							    		return_data.push(arrayData);
			    					}
		    					//}
		    					//else {
		    						var transDate = new Date(childData.datetime).getTime();

				    				//if (data.datetime >= startDate && data.datetime <= endDate) {
				    					if (data.is_business) {
				    						var arrayData = {
								    		 	toll_name: data.toll_name, 
								    		 	cost: data.cost, 
								    		 	name: data.name,
								    		 	datetime: data.datetime
								    		};
								    		return_data.push(arrayData);
				    					}
				    				//}
		    					//}
		    					console.log(data.is_business)
			    			} 
					    }
	    			}
	    			res.type('application/json');
					res.status(200).send({data: return_data});
				});
	    	})
	    	.catch(function(errorObject){
				res.status(errorObject.code).send({data: { error: errorObject.message }});
			});
	    break;
	    default:
			res.status(400).send({ error: 'Undefined Request Method' });
		break;
  	}
});

exports.history = functions.https.onRequest((req, res) => {
	switch (req.method) {
	    case 'GET':
		    if (req.query.start_date == '' || req.query.end_date == '') {
	    		var data = [];

				var query = admin.database().ref("/transactions").child(req.query.uid);
				query.once("value")
				.then(function(snapshot) {
				    snapshot.forEach(function(childSnapshot) {
				    	var childData = childSnapshot.val();

			    		 var arrayData = {
			    		 	toll_name: childData.toll_name, 
			    		 	cost: childData.cost, 
			    		 	datetime: childData.datetime,
			    		 	is_business: childData.is_business
			    		 };
			    		data.push(arrayData);
				  });
				})
				.then(function(){
					res.type('application/json');
					res.status(200).send({data: data});
				})
				.catch(function(errorObject) {
					res.status(errorObject.code).send({ error: errorObject.message });
				});
	    	}
	    	else {
		    	var startDate = new Date(req.query.start_date).getTime();
				var endDate = new Date(req.query.end_date).getTime();
				var data = [];

				var query = admin.database().ref("/transactions").child(req.query.uid);
				query.once("value")
				.then(function(snapshot) {
				    snapshot.forEach(function(childSnapshot) {
				    	var childData = childSnapshot.val();
				    	var transDate = new Date(childData.datetime).getTime();

				    	if (transDate >= startDate && transDate <= endDate) {
				    		 var arrayData = {
				    		 	toll_name: childData.toll_name,
				    		 	cost: childData.cost,
				    		 	datetime: childData.datetime,
				    		 	is_business: childData.is_business
				    		 };
				    		data.push(arrayData);
				    	}
				  });
				})
				.then(function(){
					res.type('application/json');
					res.status(200).send({data: data});
				})
				.catch(function(errorObject) {
					res.status(errorObject.code).send({ error: errorObject.message });
				});
			}

      		break;
	    default:
			res.status(400).send({ error: 'Undefined Request Method' });
		break;
  	}
});

exports.login = functions.https.onRequest((req, res) => {
	switch (req.method) {
		case 'POST':
			admin.auth().getUserByEmail(req.body.email)
			 	.then(function(userRecord) {
			 		res.type('application/json');
					res.status(200).send({data: {uid: userRecord.uid}});
			})
			.catch(function(error) {
				console.log(error)
				res.status(404).send({data: {status: "error", error: "user-not-exists" }});
			})
			break;
		default:
			res.status(400).send({ error: 'Undefined Request Method' });
	}
});

exports.organization = functions.https.onRequest((req, res) => {
	switch (req.method) {	
		case 'POST':
			var isOrganizationExists = false;
			admin.database().ref("/organizations").once('value', function(snapshot) {
				if (snapshot.hasChild(req.body.uid)) {
					isOrganizationExists = true
				}
			})
			.then(function() {
				if (isOrganizationExists) {
					var data = {
						status: 'error',
						msg: 'organization already exists'
					};

					res.type('application/json');
					res.status(200).send({data: data});
				}
				else {
					var dt = dateTime.create();
					var formattedDatetime = dt.format('Y-m-d H:M:S');

					var data = {
						name: req.body.name,
						date: formattedDatetime
					};

					admin.database().ref("/organizations").child(req.body.uid).set(data);

					res.type('application/json');

					var returnData = {
						status: 'ok',
						name: req.body.name
					}
					res.status(200).send({data: returnData});
				}
			})
			.catch(function(errorObject){
				console.log(errorObject)
				res.status(errorObject.code).send({ error: errorObject.message });
			});	
		break;
	    case 'GET' :
	    	var member_data = [];
	    	var returnData;

     		admin.database().ref("/organizations").child(req.query.uid).once('value', function(snapshot) {
				res.type('application/json');

				if (snapshot.val() == null || snapshot == 'undefined') {
					res.status(200).send({data: {error: "no-organization"}});
				}
				else {
					for(var memberKey in snapshot.val().member){
						var arrayData = {
			    		 	join_date: snapshot.val().member[memberKey].join_date,
			    		 	name: snapshot.val().member[memberKey].name,
			    		 	email: snapshot.val().member[memberKey].email
			    		};
				    	member_data.push(arrayData);
					}

					returnData = {
						name: snapshot.val().name,
						date: snapshot.val().date,
						member: member_data
					};

					res.status(200).send({data: returnData});
				}
			})
			.then(function(errorObject){
				res.status(errorObject.code).send({data: { error: errorObject.message }});
			});	
	    break;
		default:
			res.status(400).send({ error: 'Undefined Request Method' });
		break;
	}
});

exports.addMember = functions.https.onRequest((req, res) => {
	switch (req.method) {	
		case 'POST':
			var uid;
			var name;

			admin.auth().getUserByEmail(req.body.email)
			 	.then(function(userRecord) {
			 		uid = userRecord.uid;
			})
			.catch(function(error) {
				console.log(error)
				res.status(404).send({data: {status: "error", error: "user-not-exists" }});
			})
			.then (function() {
				var dt = dateTime.create();
				var formattedDatetime = dt.format('Y-m-d H:M:S');
				var data;

				admin.database().ref("/users").child(uid).once('value', function(snapshot) {
					name = snapshot.val().name;
				})
				.then(function() {
					data = {
						name: name,
						email: req.body.email,
						join_date: formattedDatetime
					};

					admin.database().ref("/organizations").child(req.body.uid).child("member").child(uid)
						.set(data);
				})
				.then (function() {
					var return_data = [];

					admin.database().ref("/organizations").child(req.body.uid).child("member").once('value', function(snapshot) {
						snapshot.forEach(function(childSnapshot) {
					    	var childData = childSnapshot.val();

				    		var arrayData = {
				    		 	join_date: childData.join_date,
				    		 	name: childData.name,
				    		 	email: childData.email
				    		};
					    	
					    	return_data.push(arrayData);
					 	});

						res.type('application/json');
						res.status(200).send({data: return_data});
					})
				})				
			});
		break;
		default:
			res.status(400).send({ error: 'Undefined Request Method' });
		break;
	}
});

exports.edit = functions.https.onRequest((req, res) => {
	switch (req.method) {
		case 'POST':
			admin.database()
			.ref("/users/" + req.body.uid)
			.set({
				name: req.body.name,
				phone_number:req.body.phone_number,
				address: req.body.address
			}).then(function() {
				res.status(200).send({message: 'Profile updated'});
			});
			break;
		default:
			res.status(400).send({ error: 'Undefined Request Method'});
		}
});
