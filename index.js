const Hapi = require("hapi");
const Path = require("path");
const ejs = require("ejs");
const inert = require("inert");
const vision = require("vision");
const validUrl = require("valid-url");
const shortid = require("shortid");
const URL = require("./models/url");
const db = require("./database").db;

const server = Hapi.server({
	port: 8080,
	host: "localhost",
	routes: {
		files: {
			relativeTo: Path.join(__dirname, "public"),
		},
	},
});

server.route({
	method: "GET",
	path: "/",
	handler: (request, h) => h.view("index"),
});

server.route({
	method: "POST",
	path: "/shorten",
	handler: async (request, h) => {
		const originalURL = request.payload.originalURL;
		let result;
		if (validUrl.isUri(originalURL)) {
			const shortUrl = await URL.findOne({ originalURL });

			if (shortUrl) {
				result = h.response(shortUrl.shortURL);
			} else {
				const urlCode = shortid.generate();

				const shortURL = `${server.info.uri}/${urlCode}`;

				const url = new URL({
					originalURL,
					shortURL,
					urlCode,
					updatedAt: Date.now(),
				});

				await url.save();
				result = h.response(url.shortURL);
			}
		} else {
			result = h.response({ error: true, message: "Invalid url" });
		}
		return h.view("result", { result, originalURL });
	},
});

server.route({
	method: "GET",
	path: "/{urlCode}",
	handler: async (request, h) => {
		const urlCode = request.params.urlCode;

		const query = URL.where({ urlCode });
		const url = await query.findOne((err, rs) => {
			if (err) return err;
			return rs;
		});

		return h.redirect(url.originalURL);
	},
});

const init = async () => {
	await server.register([
		inert,
		vision,
	]);

	server.views({
		engines: {
			html: ejs,
		},
		relativeTo: __dirname,
		path: "views",
	});

	server.route({
		method: "GET",
		path: "/{param*}",
		handler: {
			directory: {
				path: Path.join(__dirname, "public"),
				listing: false,
				index: false,
			},
		},
	});

	server.route({
		method: "*",
		path: "/{any*}",
		handler: (request, h) => h.response("The page was not found").code(404),
	});

	await server.start();
	console.log(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
	console.log(err);
	process.exit(1);
});

init();
