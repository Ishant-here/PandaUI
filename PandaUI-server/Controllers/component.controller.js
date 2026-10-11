const Component = require("../Models/component.model.js");
const User = require("../Models/user.model.js");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// --- Save Component ---
const saveComponent = async (req, res) => {
    try {
        const { name, code, props } = req.body;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "admin") {
            const existing = await Component.findOne({ name, visibility: "public" });
            if (existing) {
                return res.status(400).json({
                    message: "Admin cannot create duplicate public component name",
                });
            }
        }

        if (user.role !== "admin") {
            const existing = await Component.findOne({
                name,
                owner: req.userId,
            });

            if (existing) {
                return res.status(400).json({
                    message: "You already have a component with this name",
                });
            }
        }

        const component = await Component.create({
            name,
            code,
            props,
            owner: req.userId,
        });

        return res.status(200).json(component);

    } catch (error) {
        console.error("Save component error:", error);
        return res.status(500).json({ message: `Failed to save component: ${error.message}` });
    }
};

// --- Publish Component ---
const publishComponent = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user || user.role !== "admin") {
            return res.status(403).json({
                message: "Only admin can publish"
            });
        }

        const { componentId } = req.body;

        const component = await Component.findById(componentId);

        if (!component) {
            return res.status(404).json({
                message: "Component not found"
            });
        }

        if (component.owner.toString() !== req.userId.toString()) {
            return res.status(403).json({
                message: "You can only publish your own components"
            });
        }

        const libPath = path.join(process.cwd(), "../pandaUI-lib");

        const componentDir = path.join(
            libPath,
            "src/components",
            component.name
        );

        const componentFile = path.join(
            componentDir,
            `${component.name}.jsx`
        );

        const indexFile = path.join(libPath, "src/index.js");

        // Create component folder
        if (!fs.existsSync(componentDir)) {
            fs.mkdirSync(componentDir, { recursive: true });
        }

        // Write component code
        fs.writeFileSync(componentFile, component.code);

        // Read index file
        let indexContent = fs.readFileSync(indexFile, "utf8");

        const exportLine = `export { ${component.name} } from "./components/${component.name}/${component.name}.jsx";`;

        // Prevent duplicate export
        if (!indexContent.includes(exportLine)) {
            fs.appendFileSync(indexFile, `\n${exportLine}\n`);
        }

        // ----------------------------
        // CLEAN OLD BUILD
        // ----------------------------
        console.log("Cleaning old build...");

        const distPath = path.join(libPath, "dist");

        if (fs.existsSync(distPath)) {
            fs.rmSync(distPath, { recursive: true, force: true });
        }

        // ----------------------------
        // BUILD LIBRARY
        // ----------------------------
        console.log("Building library...");

        execSync("npm run build", {
            cwd: libPath,
            stdio: "inherit"
        });

        // ----------------------------
        // UPDATE VERSION
        // ----------------------------
        console.log("Updating version...");

        execSync("npm version patch --no-git-tag-version", {
            cwd: libPath,
            stdio: "inherit"
        });

        // ----------------------------
        // PUBLISH TO NPM
        // ----------------------------
        console.log("Publishing to npm...");

        execSync("npm publish --access public", {
            cwd: libPath,
            stdio: "inherit"
        });

        component.visibility = "public";
        component.npmPackage = `pandaui-lib@${require(path.join(libPath, "package.json")).version}`;
        await component.save();

        return res.status(200).json({
            message: "Component published successfully",
            component
        });

    } catch (error) {
        console.error("Publish component error:", error);
        return res.status(500).json({ message: `Failed to publish component: ${error.message}` });
    }
};

// --- Get All Components ---
const allComponents = async (req, res) => {
    try {
        const components = await Component
            .find()
            .populate("owner", "name email")
            .sort({ createdAt: -1 });

        if (!components || components.length === 0) {
            return res.status(200).json({
                message: "No components found",
                components: [],
            });
        }

        return res.status(200).json({
            message: "Components fetched successfully",
            components,
        });

    } catch (error) {
        console.error("Get all components error:", error);
        return res.status(500).json({ message: `Failed to fetch components: ${error.message}` });
    }
};

module.exports = {
    saveComponent,
    publishComponent,
    allComponents,
};