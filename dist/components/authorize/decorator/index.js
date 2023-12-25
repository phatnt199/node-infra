"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDecoratorData = exports.permission = exports.MetadataDecoratorKeys = void 0;
const metadata_1 = require("@loopback/metadata");
class MetadataDecoratorKeys {
}
exports.MetadataDecoratorKeys = MetadataDecoratorKeys;
MetadataDecoratorKeys.PERMISSION = 'metadata-key-for-permission-decorator';
// Read more: https://loopback.io/doc/en/lb4/Creating-decorators.html#inspect-metadata-of-a-property
function permission(spec) {
    return metadata_1.MethodDecoratorFactory.createDecorator(MetadataDecoratorKeys.PERMISSION, spec);
}
exports.permission = permission;
// Read more: https://loopback.io/doc/en/lb4/Creating-decorators.html#to-create-a-decorator-that-can-be-used-multiple-times-on-a-single-method
const getDecoratorData = (controllerPrototype, keyTargetDecorator) => {
    return metadata_1.MetadataInspector.getAllPropertyMetadata(keyTargetDecorator, controllerPrototype);
};
exports.getDecoratorData = getDecoratorData;
//# sourceMappingURL=index.js.map