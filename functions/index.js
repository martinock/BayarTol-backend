'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dateTime = require('node-datetime');
admin.initializeApp(functions.config().firebase);

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
							res.status(200).send(JSON.stringify(body));

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
							res.status(200).send(JSON.stringify(body));
						}
						else {

						}
					})
					.catch(function(error) {
						res.status(500).send({ error: error.message });
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
			admin.database().ref("/users").child(req.query.uid).on("value", function(snapshot) {
				res.type('application/json');
				res.status(200).send(snapshot.val());
			}, function (errorObject) {
				res.status(errorObject.code).send({ error: 'Read data failed' });
			});
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

			admin.database().ref("/tolls").child(req.query.tid).on("value", function(snapshot) {
				tollData = snapshot.val();

				var data = {
					uid: req.query.uid,
					tid: req.query.tid,
					toll_name: tollData.name,
					cost: tollData.cost,
					datetime: formattedDatetime
				}

				admin.database().ref("/transactions").child(req.query.uid).push().set(data)

				res.type('application/json');
				res.status(200).send({status: 'OK'});

			}, function (errorObject) {
				res.status(errorObject.code).send({ error: 'Read data failed' });
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
			    		 	datetime: childData.datetime
			    		 };
			    		data.push(arrayData);
			    	}
			  });
			})
			.then(function(){
				res.type('application/json');
				res.status(200).send(JSON.stringify(data));
			})
			.catch(function(error) {
				res.status(errorObject.code).send({ error: errorObject.message });
			});



      		break;
	    default:
			res.status(400).send({ error: 'Undefined Request Method' });
		break;
  	}
});

exports.login = functions.https.onRequest((req, res) => {
	switch (req.method) {
		case 'POST':
			admin.database()
			.ref("/users")
			.orderByChild("email")
			.equalTo(req.body.email)
			.on("child_added", function(snapshot) {
				res.type('application/json');
				res.status(200).send({ uid: snapshot.key });
			}, function (errorObject) {
				res.status(errorObject.code).send({ error: 'Read data failed' });
			});
			break;
		default:
			res.status(400).send({ error: 'Undefined Request Method' });
	}
});
