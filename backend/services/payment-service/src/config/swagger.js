const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { PORT, HOST } = require("./env");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Food Delivery - Payment Service API",
            version: "1.0.0",
            description: "Auto-generated Swagger docs for Payment Service",
        },
        components: {
            schemas: {
                // We'll add converted Joi schemas here
            },
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`📘 Swagger Docs available at http://${HOST}:${PORT}/api-docs`);
}

module.exports = swaggerDocs;
