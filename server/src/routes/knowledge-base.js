"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var express_1 = require("express");
var multer_1 = require("multer");
var path_1 = require("path");
var fs_1 = require("fs");
var database_1 = require("../db/database");
var router = express_1.default.Router();
// Configure multer for file uploads
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        var uploadDir = process.env.UPLOAD_DIR || './uploads';
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
var upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB default
    },
    fileFilter: function (req, file, cb) {
        var allowedTypes = ['.pdf', '.docx', '.txt', '.md'];
        var ext = path_1.default.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type. Only PDF, DOCX, TXT, and MD files are allowed.'));
        }
    }
});
// Get knowledge base documents
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenantId, documents, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                tenantId = req.user.tenantId;
                return [4 /*yield*/, database_1.database.query('SELECT id, name, type, source, status, size, created_at, updated_at FROM knowledge_base WHERE tenant_id = ? ORDER BY created_at DESC', [tenantId])];
            case 1:
                documents = _a.sent();
                res.json({ documents: documents });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Get knowledge base error:', error_1);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Upload document
router.post('/upload', upload.single('document'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenantId, _a, originalname, filename, size, mimetype, fileType, result, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                tenantId = req.user.tenantId;
                if (!req.file) {
                    return [2 /*return*/, res.status(400).json({ error: 'No file uploaded' })];
                }
                _a = req.file, originalname = _a.originalname, filename = _a.filename, size = _a.size, mimetype = _a.mimetype;
                fileType = path_1.default.extname(originalname).toLowerCase().substring(1);
                return [4 /*yield*/, database_1.database.run('INSERT INTO knowledge_base (tenant_id, name, type, source, status, size, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)', [
                        tenantId,
                        originalname,
                        fileType,
                        filename,
                        'processing',
                        size,
                        JSON.stringify({ mimetype: mimetype, uploadedAt: new Date().toISOString() })
                    ])];
            case 1:
                result = _b.sent();
                // Log analytics event
                return [4 /*yield*/, database_1.database.run('INSERT INTO analytics_events (tenant_id, event_type, event_data) VALUES (?, ?, ?)', [tenantId, 'document_uploaded', JSON.stringify({
                            documentId: result.lastID,
                            type: fileType,
                            size: size
                        })])];
            case 2:
                // Log analytics event
                _b.sent();
                res.status(201).json({
                    id: result.lastID,
                    name: originalname,
                    type: fileType,
                    status: 'processing',
                    message: 'Document uploaded successfully'
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.error('Upload document error:', error_2);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Add website URL
router.post('/url', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenantId, _a, url, name_1, displayName, result, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                tenantId = req.user.tenantId;
                _a = req.body, url = _a.url, name_1 = _a.name;
                if (!url) {
                    return [2 /*return*/, res.status(400).json({ error: 'URL is required' })];
                }
                // Basic URL validation
                try {
                    new URL(url);
                }
                catch (_c) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid URL format' })];
                }
                displayName = name_1 || new URL(url).hostname;
                return [4 /*yield*/, database_1.database.run('INSERT INTO knowledge_base (tenant_id, name, type, source, status, metadata) VALUES (?, ?, ?, ?, ?, ?)', [
                        tenantId,
                        displayName,
                        'website',
                        url,
                        'processing',
                        JSON.stringify({ addedAt: new Date().toISOString() })
                    ])];
            case 1:
                result = _b.sent();
                // Log analytics event
                return [4 /*yield*/, database_1.database.run('INSERT INTO analytics_events (tenant_id, event_type, event_data) VALUES (?, ?, ?)', [tenantId, 'website_added', JSON.stringify({
                            documentId: result.lastID,
                            url: url
                        })])];
            case 2:
                // Log analytics event
                _b.sent();
                res.status(201).json({
                    id: result.lastID,
                    name: displayName,
                    type: 'website',
                    source: url,
                    status: 'processing',
                    message: 'Website added successfully'
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                console.error('Add URL error:', error_3);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Delete document
router.delete('/:documentId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenantId, documentId, document_1, filePath, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                tenantId = req.user.tenantId;
                documentId = req.params.documentId;
                return [4 /*yield*/, database_1.database.get('SELECT * FROM knowledge_base WHERE id = ? AND tenant_id = ?', [documentId, tenantId])];
            case 1:
                document_1 = _a.sent();
                if (!document_1) {
                    return [2 /*return*/, res.status(404).json({ error: 'Document not found' })];
                }
                // Delete file if it's a uploaded document
                if (document_1.type !== 'website') {
                    filePath = path_1.default.join(process.env.UPLOAD_DIR || './uploads', document_1.source);
                    if (fs_1.default.existsSync(filePath)) {
                        fs_1.default.unlinkSync(filePath);
                    }
                }
                // Delete from database
                return [4 /*yield*/, database_1.database.run('DELETE FROM knowledge_base WHERE id = ? AND tenant_id = ?', [documentId, tenantId])];
            case 2:
                // Delete from database
                _a.sent();
                // Log analytics event
                return [4 /*yield*/, database_1.database.run('INSERT INTO analytics_events (tenant_id, event_type, event_data) VALUES (?, ?, ?)', [tenantId, 'document_deleted', JSON.stringify({
                            documentId: documentId,
                            name: document_1.name,
                            type: document_1.type
                        })])];
            case 3:
                // Log analytics event
                _a.sent();
                res.json({ message: 'Document deleted successfully' });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                console.error('Delete document error:', error_4);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Update document status (for processing updates)
router.put('/:documentId/status', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenantId, documentId, status_1, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                tenantId = req.user.tenantId;
                documentId = req.params.documentId;
                status_1 = req.body.status;
                if (!['processing', 'active', 'error'].includes(status_1)) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid status' })];
                }
                return [4 /*yield*/, database_1.database.run('UPDATE knowledge_base SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?', [status_1, documentId, tenantId])];
            case 1:
                _a.sent();
                res.json({ message: 'Document status updated successfully' });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Update document status error:', error_5);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get document by ID
router.get('/:documentId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tenantId, documentId, document_2, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                tenantId = req.user.tenantId;
                documentId = req.params.documentId;
                return [4 /*yield*/, database_1.database.get('SELECT * FROM knowledge_base WHERE id = ? AND tenant_id = ?', [documentId, tenantId])];
            case 1:
                document_2 = _a.sent();
                if (!document_2) {
                    return [2 /*return*/, res.status(404).json({ error: 'Document not found' })];
                }
                res.json(__assign(__assign({}, document_2), { metadata: JSON.parse(document_2.metadata || '{}') }));
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Get document error:', error_6);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
