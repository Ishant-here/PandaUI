const express = require("express");
const {
    saveComponent,
    publishComponent,
    allComponents,
} = require("../Controllers/component.controller");

const { generateComponent } = require("../Controllers/aiComponent.controller");

const isAuth = require("../MiddleWare/isAuth.middleware");

const componentRouter = express.Router();

// Route to generate a new component using AI
// POST /api/component/generate
componentRouter.post("/generate", isAuth, generateComponent);

// Route to save a generated component to the database
// POST /api/component/save
componentRouter.post("/save", isAuth, saveComponent);

// Route to publish a saved component to NPM (Admin only)
// POST /api/component/publish
componentRouter.post("/publish", isAuth, publishComponent);

// Route to get all components
// GET /api/component/all-components
componentRouter.get("/all-components", isAuth, allComponents);

module.exports = componentRouter;