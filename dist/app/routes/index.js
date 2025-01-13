"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_routes_1 = require("../module/Auth/Auth.routes");
const Campaign_routes_1 = require("../module/Campaign/Campaign.routes");
const File_routes_1 = require("../module/File/File.routes");
const Records_routes_1 = require("../module/Records/Records.routes");
const User_routes_1 = require("../module/User/User.routes");
const router = (0, express_1.Router)();
const routes = [
    {
        path: "/auth",
        route: Auth_routes_1.AuthRoutes,
    },
    {
        path: "/user",
        route: User_routes_1.UserRoutes,
    },
    {
        path: "/record",
        route: Records_routes_1.RecordsRoutes,
    },
    {
        path: "/campaign",
        route: Campaign_routes_1.CampaignRoutes,
    },
    {
        path: "/file",
        route: File_routes_1.FileRoutes,
    },
];
routes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
