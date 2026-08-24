import { mountLab } from "./app.js";

const app = document.getElementById("app");
if (app) {
  mountLab(app, { preferH5P: false });
}
