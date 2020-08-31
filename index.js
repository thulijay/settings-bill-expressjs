const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const app = express();

const SettingsBill = require('./settings-bill');
const settingsBill = SettingsBill();

const moment = require('moment')
moment().format()

// app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');

const handlebarSetup = exphbs({
    viewPath:  './views/main',
    layoutsDir : './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json());

app.get('/', function (req, res){
	res.render('index',{
		settings: settingsBill.getSettings(),
		totals: settingsBill.totals()
	});
});

app.post('/settings', function (req, res){
	settingsBill.setSettings({
		callCost: req.body.callCost,
		smsCost: req.body.smsCost,
		warningLevel: req.body.warningLevel,
		criticalLevel: req.body.criticalLevel
	});

	res.redirect('/');
});

app.post('/action', function (req, res){

	settingsBill.recordAction(req.body.actionType)

	res.redirect('/');
});

// app.get('/actions', function (req, res){
// 	res.render('actions',{
// 		actions: settingsBill.actions()
// 	});
// });
app.get("/actions", function(req, res){
    
    // your code here that's reading data or what ever...
	//settingsBill.recordAction(req.body.actionType)

    // what ever your Factory function is called.
    const listOfActions = settingsBill.actions();
    
    for (let key of listOfActions) {
        key.ago = moment(key.timestamp).fromNow();
    }
    
    res.render("actions", {
        actions : listOfActions
    });
});

app.get('/actions/:actionType', function (req, res){
	const actionType = req.params.actionType;
const listOfActions =	settingsBill.actionsFor(actionType)
for( let action of listOfActions){
	action.ago = moment(action.timestamp).fromNow()
}

	res.render('actions', {
		actions: listOfActions
	});
});



const PORT = process.env.PORT || 3014;
app.listen(PORT, function (){
	console.log('App started at:', PORT);
});