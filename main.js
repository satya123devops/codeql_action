"use strict";
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
        while (_) try {
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
var core = require("@actions/core");
var getInputs_1 = require("./utils/getInputs");
var axios_1 = require("axios");
// import { repoPRFetch } from './utils/repoPRFetch'
var handleError = function (err) {
    core.error(err);
    core.setFailed("Unhandled error: ".concat(err));
};
process.on('unhandledRejection', handleError);
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var combinePullsParams, githubToken, data, openAlerts, dismissedAlerts, falsePositiveAlerts, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, getInputs_1["default"])()];
            case 1:
                combinePullsParams = _a.sent();
                githubToken = combinePullsParams.githubToken;
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, axios_1["default"].get("".concat(process.env.GITHUB_API_URL, "/repos/").concat(process.env.GITHUB_REPOSITORY, "/code-scanning/alerts?ref=main"), {
                        headers: { Authorization: "Bearer ".concat(githubToken), Accept: 'application/json' }
                    })];
            case 3:
                data = (_a.sent()).data;
                // const { data } = (await axios.get(`https://api.github.com/repos/satya123devops/Code-Pipeline-Demo-After/code-scanning/alerts?ref=main`, {
                //   headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/json' },
                // }));
                //console.log(data)
                if (data.length > 0) {
                    openAlerts = data.filter(function (data) {
                        return data.state == 'open';
                    });
                    //console.log(openAlerts)
                    if (openAlerts.length > 0) {
                        console.log("There is/are " + openAlerts.length + " Open Alerts");
                        openAlerts.forEach(function (data) {
                            console.log("Open Alert name is " + data.rule.name + ","
                                + "Open Alert description is " + data.rule.description + ","
                                + "Open Alert severity is " + data.rule.severity + ","
                                + "Open Alert severity level is " + data.rule.security_severity_level);
                        });
                        //FAIL the process here
                        console.log("FAIL");
                    }
                    else {
                        dismissedAlerts = data.filter(function (data) {
                            return data.state == 'dismissed';
                        });
                        console.log("There is/are " + dismissedAlerts.length + " Dismissed Alerts");
                        if (dismissedAlerts.length > 0) {
                            falsePositiveAlerts = dismissedAlerts.filter(function (data) {
                                return data.dismissed_reason == 'false positive';
                            });
                            console.log("There is/are " + falsePositiveAlerts.length + " False Positive Alerts");
                            if (falsePositiveAlerts.length > 0) {
                                if (dismissedAlerts.length === falsePositiveAlerts.length) {
                                    //PASS the process here
                                    console.log("PASS");
                                }
                                else {
                                    //FAIL the process here
                                    console.log("FAIL");
                                }
                            }
                            else {
                                //PASS the process here
                                console.log("PASS");
                            }
                        }
                        else {
                            //PASS the process here
                            console.log("PASS");
                        }
                    }
                }
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                core.setFailed("combine-dependabot-branch: ".concat(err_1.message));
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
run()["catch"](handleError);
