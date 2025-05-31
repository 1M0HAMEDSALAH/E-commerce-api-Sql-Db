const schemas = {
    Product: {
        type: "object",
        properties: {
            categoryId: { type: "integer" },
            createdAt: { type: "string", format: "date-time" },
            description: { type: "string" },
            id: { type: "integer" },
            images: {
                type: "array",
                items: {
                    $ref: "#/components/schemas/ProductImage",
                },
            },
            name: { type: "string" },
            price: { type: "number" },
            stock: { type: "integer" },
            updatedAt: { type: "string", format: "date-time" },
        },
    },
    ProductImage: {
        type: "object",
        properties: {
            id: { type: "integer" },
            imageUrl: { type: "string" },
            productId: { type: "integer" },
        },
    },
};

const sortedSchemas = Object.keys(schemas)
    .sort()
    .reduce((acc, key) => {
        acc[key] = schemas[key];
        return acc;
    }, {});

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "E-Commerce API",
            version: "1.0.0",
            description:
                "📦 Professional API documentation for the E-Commerce application using Express & Sequelize.",
            contact: {
                name: "Mohamed Salah",
                email: "mohamed@example.com",
            },
        },
        servers: [
            {
                url: "http://localhost:" + (process.env.PORT || 3000),
                description: "Local Development Server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: sortedSchemas,
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./routers/*.js"],
};

const swaggerJsDoc = require("swagger-jsdoc");
const specs = swaggerJsDoc(options);
module.exports = specs;
