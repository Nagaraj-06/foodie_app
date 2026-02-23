const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { PORT } = require("./env");

const convertJoiToSwagger = require("../utils/swaggerConverter");
const {
    addToCartSchema,
    placeOrderSchema,
    removeFromCartSchema,
    updateCartSchema,
} = require("../routes/schema");

// Convert schemas
const addToCartSwagger = convertJoiToSwagger(addToCartSchema);
const placeOrderSwagger = convertJoiToSwagger(placeOrderSchema);
const removeFromCartSwagger = convertJoiToSwagger(removeFromCartSchema);
const updateCartSwagger = convertJoiToSwagger(updateCartSchema);

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Food Delivery - Order Service API",
            version: "1.0.0",
            description: "Auto-generated Swagger docs for Order Service",
        },
        components: {
            schemas: {
                AddToCart: addToCartSwagger,
                PlaceOrder: placeOrderSwagger,
                RemoveFromCart: removeFromCartSwagger,
                UpdateCart: updateCartSwagger,
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
    apis: ["./src/routes/**/*.js"], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`📘 Swagger Docs available at http://localhost:${PORT}/api-docs`);
}

module.exports = swaggerDocs;
