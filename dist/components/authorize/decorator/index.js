"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDecoratorData = exports.MetadataDecoratorKeys = void 0;
exports.permission = permission;
const metadata_1 = require("@loopback/metadata");
class MetadataDecoratorKeys {
}
exports.MetadataDecoratorKeys = MetadataDecoratorKeys;
MetadataDecoratorKeys.PERMISSION = 'metadata-key-for-permission-decorator';
function permission(spec) {
    return metadata_1.MethodDecoratorFactory.createDecorator(MetadataDecoratorKeys.PERMISSION, spec);
}
const getDecoratorData = (controllerPrototype, keyTargetDecorator) => {
    return metadata_1.MetadataInspector.getAllPropertyMetadata(keyTargetDecorator, controllerPrototype);
};
exports.getDecoratorData = getDecoratorData;
//# sourceMappingURL=index.js.map