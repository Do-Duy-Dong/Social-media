"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search = (query) => {
    const reg = new RegExp(query, "i");
    return reg;
};
exports.default = search;
