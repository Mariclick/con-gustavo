export default {
  swaggerDefinition: {
    openapi: "3.1.0",
    info: {
      title: "Mothership IntechMom",
      version: "1.0.0",
      description: "",
      license: {
        name: "Apache 2.0",
        url: "https://www.apache.org/licenses/LICENSE-2.0.html",
      },
    },
    basePath: "/api",
  },
  tags: [
    {
      name: "Example",
      description: "API for users",
    },
  ],
  apis: ["src/app.js", "src/routes/index.js"],
};
