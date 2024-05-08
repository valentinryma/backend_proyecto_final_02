const { compareSync } = require('bcrypt');
const { Router } = require('express');
const jwt = require('jsonwebtoken')
// Users Role - Example
const { PUBLIC, USER, ADMIN } = require(`${__dirname}/policies.constants.js`);
const { JWT_SECRET } = require(`${__dirname}/../utils/jwt.js`);

class BaseRouter {
    constructor() {
        this.router = Router();
        this.init();
    }

    init() { }
    getRouter() { return this.router }

    // GET / POST / PUT / DELETE
    get(path, policies, ...callbacks) {
        this.router.get(path, this.handlePolicies(policies), this.genCustomResponses, this.customizeCallback(callbacks));
    }
    post(path, policies, ...callbacks) {
        this.router.post(path, this.handlePolicies(policies), this.genCustomResponses, this.customizeCallback(callbacks));
    }
    put(path, policies, ...callbacks) {
        this.router.put(path, this.handlePolicies(policies), this.genCustomResponses, this.customizeCallback(callbacks));
    }
    delete(path, policies, ...callbacks) {
        this.router.delete(path, this.handlePolicies(policies), this.genCustomResponses, this.customizeCallback(callbacks));
    }

    // Handle Policies - Roles
    handlePolicies(policies) {
        return (req, res, next) => {
            // Public
            if (policies.includes(PUBLIC)) return next();

            // Verificar si esta autenticado desde ROL.
            const authRole = req.user?.role
            if (authRole) {
                if (policies.includes(req.user.role)) {
                    return next();
                }
            }
        }
    }

    // Middlewares Dinamicos
    customizeCallback(callbacks) {
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.apply(this, params);
            } catch (error) {
                console.log(error);
                const [, res,] = params;
                return res.status(500).send(error);
            }
        })
    }

    // Respuestas estandar (res.*response*)
    genCustomResponses = (_, res, next) => {
        res.sendSuccess = payload => res.json({ status: 'success', payload });
        res.sendError = (code, error) => res.status(code).json({ status: 'error', error });
        next();
    }
}

module.exports = BaseRouter;