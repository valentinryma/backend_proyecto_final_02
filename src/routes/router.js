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
                    console.log('Authenticated by ROL')
                    return next();
                }
            }

            // Verificar desde Header Authorization
            const authHeader = req.headers.authorization

            if (!authHeader) {
                return res.status(401).send({ status: 'error', message: 'Unauthorized!' });
            }

            // Verificar si el token es valido
            const [, token,] = authHeader.split(' ');
            jwt.verify(token, JWT_SECRET, (err, payload) => {
                if (err) {
                    return res.status(403).send({ status: 'error', message: 'Invalid token' })
                }

                // Verificar si tienen los permisos correspondientes
                const userRole = payload.role;
                if (!policies.includes(userRole)) {
                    return res.status(403).send({ status: 'error', message: 'Invalid permissions' })
                }

                req.user = payload;

                console.log('Authenticated by JWT')
                return next();
            })
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
        res.sendSuccess = payload => res.send({ status: 'success', payload });
        res.sendError = error => res.status(500).send({ status: 'error', error });
        next();
    }
}

module.exports = BaseRouter;