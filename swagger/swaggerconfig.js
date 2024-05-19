const swaggerDefinition = {
    info: {
        title: 'Node APIs For DKM Blue'
    },
    produces: [
        "application/json",
        "application/xml"
    ],
    schemes: ['http', 'https'],
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            scheme: 'bearer',
            in: 'header'
        },
    },
};

module.exports = swaggerDefinition;