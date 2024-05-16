const ResearchDAO = require("../data/research-dao").ResearchDAO;
const needle = require("needle");
const {
    environmentalScripts
} = require("../../config/config");

function ResearchHandler(db) {
    "use strict";

    const researchDAO = new ResearchDAO(db);

    this.displayResearch = (req, res) => {

        if (req.query.symbol) {
            const url = require('url');
            const { URL } = url;

            const parsedUrl = new URL(req.query.url);
            if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
                return res.status(400).send('Invalid URL protocol');
            }

            const stockUrl = `${parsedUrl.toString()}${req.query.symbol}`;
            return needle.get(stockUrl, (error, newResponse, body) => {
                if (!error && newResponse.statusCode === 200) {
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                }
                res.write('<h1>The following is the stock information you requested.</h1>\n\n');
                res.write('\n\n');
                if (body) {
                    res.write(body);
                }
                return res.end();
            });
        }

        return res.render("research", {
            environmentalScripts
        });
    };

}

module.exports = ResearchHandler;
