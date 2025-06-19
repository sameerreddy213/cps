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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
// AI Integration and Quiz Analysis
// Developed by Srishti Koni
var readline_1 = require("readline");
var node_fetch_1 = require("node-fetch");
var rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
function ask(question) {
    return new Promise(function (resolve) { return rl.question(question, resolve); });
}
function fetchQuiz(topic) {
    return __awaiter(this, void 0, void 0, function () {
        var prompt, res, data, match;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prompt = "\nGenerate 5 MCQs on the topic \"".concat(topic, "\".Make sure the options are correct and that only one option is correct answer and also make sure you have the right and precise answer\nFormat:\n[\n  {\n    \"question\": \"...\",\n    \"options\": [\"A\", \"B\", \"C\", \"D\"],\n    \"correctAnswer\": 1,\n    \"explanation\": \"...\",\n    \"concept\": \"...\"\n  }\n]\nReturn only valid JSON.\n");
                    return [4 /*yield*/, (0, node_fetch_1.default)('http://localhost:11434/api/generate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                model: 'mistral',
                                prompt: prompt,
                                stream: false
                            })
                        })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    match = data.response.match(/\[\s*{[\s\S]*}\s*\]/);
                    if (!match)
                        throw new Error('Could not parse JSON response');
                    return [2 /*return*/, JSON.parse(match[0])];
            }
        });
    });
}
function runQuiz() {
    return __awaiter(this, void 0, void 0, function () {
        var topic, quiz, score, i, q, ans, userChoice, isCorrect, percent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ask('📝 Enter the topic you want a quiz on: ')];
                case 1:
                    topic = _a.sent();
                    console.log("\n\uD83C\uDFAF Generating quiz for \"".concat(topic, "\"...\n"));
                    return [4 /*yield*/, fetchQuiz(topic)];
                case 2:
                    quiz = _a.sent();
                    score = 0;
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < quiz.length)) return [3 /*break*/, 6];
                    q = quiz[i];
                    console.log("Q".concat(i + 1, ": ").concat(q.question));
                    q.options.forEach(function (opt, idx) { return console.log("   ".concat(idx + 1, ". ").concat(opt)); });
                    return [4 /*yield*/, ask('👉 Your answer (1-4): ')];
                case 4:
                    ans = _a.sent();
                    userChoice = parseInt(ans) - 1;
                    isCorrect = userChoice === q.correctAnswer;
                    if (isCorrect) {
                        console.log('✅ Correct!\n');
                        score++;
                    }
                    else {
                        if (!isCorrect) {
                            console.log("\u274C Incorrect. \u2705 Correct Answer: ".concat(q.options[q.correctAnswer], "\n"));
                        }
                    }
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 3];
                case 6:
                    percent = (score / quiz.length) * 100;
                    console.log("\uD83D\uDCCA Your Score: ".concat(score, "/").concat(quiz.length, " (").concat(percent.toFixed(0), "%)"));
                    if (percent >= 70) {
                        console.log('🎉 You’re ready to move to the next topic!');
                    }
                    else {
                        console.log('🧠 Please revise this topic before proceeding.');
                    }
                    rl.close();
                    return [2 /*return*/];
            }
        });
    });
}
runQuiz();
