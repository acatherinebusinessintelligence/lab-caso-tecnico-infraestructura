/**
 * Entry IIFE para H5P — se asigna H5P.InfrastructureCaseLab
 */
import { createInfrastructureCaseLab } from "./InfrastructureCaseLab.js";

(function (H5P) {
  if (!H5P) {
    // eslint-disable-next-line no-console
    console.error("H5P core no está disponible");
    return;
  }
  H5P.InfrastructureCaseLab = createInfrastructureCaseLab(H5P);
})(window.H5P);
