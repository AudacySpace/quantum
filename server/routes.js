module.exports = function(app) {

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendFile(__base + '/index.html');
	});
};