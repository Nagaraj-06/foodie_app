const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { port, host } = require("./env");

const convertJoiToSwagger = require("../utils/swaggerConverter");

const {
    signInSchema,
    signInResponseSchema,
    sendOtpSchema,
    verifyOtpSchema,
    googleLoginSchema,
    registerRestaurantSchema,
} = require("../routes/public/auth/schema");

const {
    updateRestaurantSchema,
    addMenuItemSchema,
} = require("../routes/private/restaurant/schema");

const {
    updateUserProfileSchema,
} = require("../routes/private/users/schema");

// Convert schemas
const signInSwagger = convertJoiToSwagger(signInSchema);
const signInResponseSwagger = convertJoiToSwagger(signInResponseSchema);
const sendOtpSwagger = convertJoiToSwagger(sendOtpSchema);
const verifyOtpSwagger = convertJoiToSwagger(verifyOtpSchema);
const googleLoginSwagger = convertJoiToSwagger(googleLoginSchema);
const updateRestaurantSwagger = convertJoiToSwagger(updateRestaurantSchema);
const addMenuItemSwagger = convertJoiToSwagger(addMenuItemSchema);
const updateProfileSwagger = convertJoiToSwagger(updateUserProfileSchema);
const registerRestaurantSwagger = convertJoiToSwagger(registerRestaurantSchema);

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Food Delivery - Auth Service API",
            version: "1.0.0",
            description: "Auto-generated Swagger docs for Auth Service",
        },
        components: {
            schemas: {
                SignInRequest: signInSwagger,
                SignInResponse: signInResponseSwagger,
                SendOtpRequest: sendOtpSwagger,
                VerifyOtpRequest: verifyOtpSwagger,
                GoogleLoginRequest: googleLoginSwagger,
                UpdateRestaurant: updateRestaurantSwagger,
                AddMenuItem: addMenuItemSwagger,
                UpdateProfile: updateProfileSwagger,
                RegisterRestaurant: registerRestaurantSwagger,
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
    console.log(`📘 Swagger Docs available at http://${host || 'localhost'}:${port}/api-docs`);
}

module.exports = swaggerDocs;
