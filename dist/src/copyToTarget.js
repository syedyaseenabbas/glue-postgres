"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.copyToTarget = void 0;
var fs = __importStar(require("fs"));
var path = require("path");
var fileExists = function (filePath) {
    return fs.existsSync(filePath) ? true : false;
};
var createFolder = function (_folder) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, fs.mkdirSync(_folder, { recursive: true })];
            case 1:
                _a.sent();
                return [2, Promise.resolve(true)];
        }
    });
}); };
var copyFile = function (source, target) { return __awaiter(void 0, void 0, void 0, function () {
    var targetFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                targetFile = target;
                if (fileExists(target)) {
                    if (fs.lstatSync(target).isDirectory()) {
                        targetFile = path.join(target, path.basename(source));
                    }
                }
                return [4, fs.writeFileSync(targetFile, fs.readFileSync(source))];
            case 1:
                _a.sent();
                return [2];
        }
    });
}); };
var copyFolder = function (source, target, depth) {
    if (depth === void 0) { depth = 0; }
    return __awaiter(void 0, void 0, void 0, function () {
        var files, targetFolder_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!source.includes(".git")) return [3, 4];
                    files = [];
                    targetFolder_1 = path.join(target, path.basename(depth ? source : "."));
                    return [4, fileExists(targetFolder_1)];
                case 1:
                    if (!!(_a.sent())) return [3, 3];
                    return [4, createFolder(targetFolder_1)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    if (fs.lstatSync(source).isDirectory() ||
                        fs.lstatSync(source).isSymbolicLink()) {
                        files = fs.readdirSync(source);
                        files.forEach(function (file) { return __awaiter(void 0, void 0, void 0, function () {
                            var curSource;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        curSource = path.join(source, file);
                                        if (!fs.lstatSync(curSource).isDirectory()) return [3, 2];
                                        return [4, copyFolder(curSource, targetFolder_1, depth++)];
                                    case 1:
                                        _a.sent();
                                        return [3, 4];
                                    case 2: return [4, copyFile(curSource, targetFolder_1)];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4: return [2];
                                }
                            });
                        }); });
                    }
                    _a.label = 4;
                case 4: return [2];
            }
        });
    });
};
function copyToTarget(sourceFolder, targetFolder) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, copyFolder(sourceFolder, targetFolder)];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    });
}
exports.copyToTarget = copyToTarget;
//# sourceMappingURL=copyToTarget.js.map