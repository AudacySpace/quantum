module.exports = function(app) {

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendFile(__base + '/index.html'); // load the single view file (angular will handle the page changes on the front-end)

		// res.sendFile('index.html', { root: __dirname + '' });

	});
};