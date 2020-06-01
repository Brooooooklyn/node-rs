"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locateBinding = void 0;
const fs_1 = require("fs");
const os_1 = require("os");
const path_1 = require("path");
const SupportedPlatforms = new Set(['darwin', 'win32', 'linux']);
function locateBinding(dirname, filename = 'index') {
    const platformName = os_1.platform();
    if (!SupportedPlatforms.has(platformName)) {
        throw new TypeError(`Unsupported platform: ${platformName}, only support ${[...SupportedPlatforms.values()].join(', ')}`);
    }
    const bindingFilePath = path_1.join(dirname, `${filename}.${platformName}.node`);
    if (!fs_1.existsSync(bindingFilePath)) {
        throw new TypeError(`Could not find binding file on path ${bindingFilePath}`);
    }
    return bindingFilePath;
}
exports.locateBinding = locateBinding;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJCQUErQjtBQUMvQiwyQkFBNkI7QUFDN0IsK0JBQTJCO0FBRTNCLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxHQUFHLENBQWtCLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBO0FBRWpGLFNBQWdCLGFBQWEsQ0FBQyxPQUFlLEVBQUUsUUFBUSxHQUFHLE9BQU87SUFDL0QsTUFBTSxZQUFZLEdBQUcsYUFBUSxFQUFFLENBQUE7SUFDL0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRTtRQUN6QyxNQUFNLElBQUksU0FBUyxDQUNqQix5QkFBeUIsWUFBWSxrQkFBa0IsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQ3JHLENBQUE7S0FDRjtJQUVELE1BQU0sZUFBZSxHQUFHLFdBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxRQUFRLElBQUksWUFBWSxPQUFPLENBQUMsQ0FBQTtJQUV6RSxJQUFJLENBQUMsZUFBVSxDQUFDLGVBQWUsQ0FBQyxFQUFFO1FBQ2hDLE1BQU0sSUFBSSxTQUFTLENBQUMsdUNBQXVDLGVBQWUsRUFBRSxDQUFDLENBQUE7S0FDOUU7SUFFRCxPQUFPLGVBQWUsQ0FBQTtBQUN4QixDQUFDO0FBZkQsc0NBZUMifQ==