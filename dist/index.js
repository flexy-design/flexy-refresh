"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const chalk_1 = __importDefault(require("chalk"));
const cache_1 = require("./utils/cache");
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
void (() => __awaiter(void 0, void 0, void 0, function* () {
    const flexyConfigPath = path_1.default.resolve(process.cwd(), 'flexy.config.json');
    const flexySecretPath = path_1.default.resolve(process.cwd(), 'flexy.secret.json');
    if (!(0, fs_1.existsSync)(flexyConfigPath)) {
        console.log(chalk_1.default.red(`Flexy config file not found at ${flexyConfigPath}`));
        return;
    }
    if (!(0, fs_1.existsSync)(flexySecretPath)) {
        console.log(chalk_1.default.red(`Flexy secret file not found at ${flexySecretPath}`));
        return;
    }
    const flexyConfig = yield Promise.resolve().then(() => __importStar(require(flexyConfigPath)));
    console.log(chalk_1.default.blueBright(`    ________    _______  ____  __
   / ____/ /   / ____/ |/ /\\ \/  \/
  / /_  / /   / __/  |   /  \\  /
 / __/ / /___/ /___ /   |   / /
/_/   /_____/_____//_/|_|  /_/`));
    const moduleJsonPath = path_1.default.resolve(__dirname, '../package.json');
    const packageJson = JSON.parse(String((0, fs_1.readFileSync)(moduleJsonPath)));
    console.log(chalk_1.default.blueBright(`\nWelcome to Flexy CLI! (${packageJson.version})`));
    for (const fileIdAlias of Object.keys(flexyConfig.figmaUrls)) {
        console.log('');
        console.log(chalk_1.default.blueBright(`[Flexy] [${fileIdAlias}] Cache Refresh in progress...`));
        const fileId = flexyConfig.figmaUrls[fileIdAlias].replace(/^https:\/\/www\.figma\.com\/file\/(.*)\/(.*)$/, '$1');
        yield (0, cache_1.purgeCache)(fileId);
        console.log(chalk_1.default.blueBright(`[Flexy] [${fileIdAlias}] Local Cache Invalidation finished.`));
        yield axios_1.default.post('https://api.flexy.design/v1/invalidate', {
            fileId
        });
        console.log(chalk_1.default.blueBright(`[Flexy] [${fileIdAlias}] API Server Cache Invalidation finished.`));
    }
}))();
