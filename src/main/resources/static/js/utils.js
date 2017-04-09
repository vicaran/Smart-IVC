/**
 * Created by Andrea on 08/04/2017.
 */
var SERVER_URL = "http://" + window.location.host + "/";
var GRAVITY = 9.8;
var MAX_HEIGHT = -10;


var createRing = function (binaryCoordinates) {
    return (atob(binaryCoordinates)).split(",");
};

var createList = function (binaryCoordinates) {
    var shape = [];
    var ringCoordinate = createRing(binaryCoordinates);
    ringCoordinate.forEach(function (data) {
        data = data.split(" ");
        shape.push(data[1]);
        shape.push(data[0])
    });
    return shape;
};

var RGBToHex = function (r, g, b) {
    var bin = r << 16 | g << 8 | b;
    return (function (h) {
        return new Array(7 - h.length).join("0") + h
    })(bin.toString(16).toUpperCase())
};

var computeColorComplement = function (first, second, third) {
    var hex;

    if (first !== undefined && second !== undefined && third !== undefined) {
        hex = RGBToHex(first * 255, second * 255, third * 255);
    } else if (first !== undefined && second === undefined && third === undefined) {
        hex = first;
    }
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }

    if (hex === "FFFFFF" || hex === "ffffff") {
        return "#ff0000";
    }

    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
};

var padZero = function (str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
};

var interpolate = function (value, maximum, start_point, end_point) {
    return start_point + (end_point - start_point) * value / maximum;
};

var interpolateColors = function (value, maximum, startRGB, endRGB) {
    var interpolatedColors = [];
    if (startRGB.length === 3 && endRGB.length === 3) {
        interpolatedColors[0] = interpolate(value, maximum, startRGB[0], endRGB[0]);
        interpolatedColors[1] = interpolate(value, maximum, startRGB[1], endRGB[1]);
        interpolatedColors[2] = interpolate(value, maximum, startRGB[2], endRGB[2]);
    }

    return interpolatedColors;
};


//
// var CAM_HEIGHT = 10;
// var TRAILING_DISTANCE = 30;
//
// var ACCEL = 50.0;
// var DECEL = 80.0;
// var MAX_REVERSE_SPEED = 40.0;
//
//
// function makeOrthonormalFrame(matrix, dir, up) {
//     var newRight = Cesium.Cartesian3.cross(dir, up, new Cesium.Cartesian3());
//     Cesium.Cartesian3.normalize(newRight, newRight);
//
//     var newDir = Cesium.Cartesian3.cross(up, newRight, new Cesium.Cartesian3());
//     Cesium.Cartesian3.normalize(newDir, newDir);
//
//     var newUp = Cesium.Cartesian3.cross(newRight, newDir, new Cesium.Cartesian3());
//
//     var rightCart4 = Cesium.Cartesian4.fromElements(newRight.x, newRight.y, newRight.z, 0.0);
//     var dirCart4 = Cesium.Cartesian4.fromElements(newDir.x, newDir.y, newDir.z, 0.0);
//     var upCart4 = Cesium.Cartesian4.fromElements(newUp.x, newUp.y, newUp.z, 0.0);
//
//     Cesium.Matrix4.setColumn(matrix, 0, rightCart4, matrix);
//     Cesium.Matrix4.setColumn(matrix, 1, dirCart4, matrix);
//     Cesium.Matrix4.setColumn(matrix, 2, upCart4, matrix);
// }
//
//
//
// Truck.prototype.tick = function() {
//     var now = (new Date()).getTime();
//     // dt is the delta-time since last tick, in seconds
//     var dt = (now - this.lastMillis) / 1000.0;
//     if (dt > 0.25) {
//         dt = 0.25;
//     }
//     this.lastMillis = now;
//
//     var c0 = 1;
//     var c1 = 0;
//
//     var gpos = Cesium.Matrix4.getTranslation(this.model.modelMatrix, new Cesium.Cartesian3());
//     var lla = this.ellipsoid.cartesianToCartographic(gpos);
//
//     var dir = Cesium.Cartesian3.fromCartesian4(Cesium.Matrix4.getColumn(this.model.modelMatrix, 1, new Cesium.Cartesian4()));
//     var up = Cesium.Cartesian3.fromCartesian4(Cesium.Matrix4.getColumn(this.model.modelMatrix, 2, new Cesium.Cartesian4()));
//
//     var absSpeed = Cesium.Cartesian3.magnitude(this.vel);
//
//     var groundAlt = Cesium.defaultValue(this.scene.globe.getHeight(lla), 0.0);
//
//     var airborne = (groundAlt + 0.30 < lla.height);
//
//
//     // Air drag.
//     //
//     // Fd = 1/2 * rho * v^2 * Cd * A.
//     // rho ~= 1.2 (typical conditions)
//     // Cd * A = 3 m^2 ("drag area")
//     //
//     // I'm simplifying to:
//     //
//     // accel due to drag = 1/Mass * Fd
//     // with Milktruck mass ~= 2000 kg
//     // so:
//     // accel = 0.6 / 2000 * 3 * v^2
//     // accel = 0.0009 * v^2
//     absSpeed = Cesium.Cartesian3.magnitude(this.vel);
//     if (absSpeed > 0.01) {
//         var veldir = Cesium.Cartesian3.normalize(this.vel, new Cesium.Cartesian3());
//         var DRAG_FACTOR = 0.00090;
//         var drag = absSpeed * absSpeed * DRAG_FACTOR;
//
//         // Some extra constant drag (rolling resistance etc) to make sure
//         // we eventually come to a stop.
//         var CONSTANT_DRAG = 2.0;
//         drag += CONSTANT_DRAG;
//
//         if (drag > absSpeed) {
//             drag = absSpeed;
//         }
//
//         Cesium.Cartesian3.subtract(this.vel, Cesium.Cartesian3.multiplyByScalar(veldir, drag * dt, new Cesium.Cartesian3()), this.vel);
//     }
//
//     // Gravity
//     var normal = this.ellipsoid.geodeticSurfaceNormal(gpos);
//     var gravity = Cesium.Cartesian3.multiplyByScalar(normal, -GRAVITY * dt, new Cesium.Cartesian3());
//     Cesium.Cartesian3.add(this.vel, gravity, this.vel);
//
//     // Move.
//     var deltaPos = Cesium.Cartesian3.multiplyByScalar(this.vel, dt, new Cesium.Cartesian3());
//
//     Cesium.Cartesian3.add(deltaPos, gpos, gpos);
//     this.ellipsoid.cartesianToCartographic(gpos, lla);
//
//     // Don't go underground.
//     groundAlt = this.scene.globe.getHeight(lla);
//     if (lla.height < groundAlt) {
//         lla.height = groundAlt;
//         this.ellipsoid.cartographicToCartesian(lla, gpos);
//     }
//
//     if (!airborne) {
//         // Cancel velocity into the ground.
//         //
//         // TODO: would be fun to add a springy suspension here so
//         // the truck bobs & bounces a little.
//         normal = estimateGroundNormal(this.scene.globe, gpos, this.ellipsoid);
//         var speedOutOfGround = Cesium.Cartesian3.dot(normal, this.vel);
//         if (speedOutOfGround < 0) {
//             Cesium.Cartesian3.add(this.vel, Cesium.Cartesian3.multiplyByScalar(normal, -speedOutOfGround, new Cesium.Cartesian3()), this.vel);
//         }
//
//         // Make our orientation follow the ground.
//         c0 = Math.exp(-dt / 0.25);
//         c1 = 1 - c0;
//         var scaledUp = Cesium.Cartesian3.multiplyByScalar(up, c0, new Cesium.Cartesian3());
//         var scaledNormal = Cesium.Cartesian3.multiplyByScalar(normal, c1, new Cesium.Cartesian3());
//         var blendedUp = Cesium.Cartesian3.add(scaledUp, scaledNormal, new Cesium.Cartesian3());
//         Cesium.Cartesian3.normalize(blendedUp, blendedUp);
//         makeOrthonormalFrame(this.model.modelMatrix, dir, blendedUp);
//
//         right = Cesium.Cartesian3.fromCartesian4(Cesium.Matrix4.getColumn(this.model.modelMatrix, 0, new Cesium.Cartesian4()));
//         dir = Cesium.Cartesian3.fromCartesian4(Cesium.Matrix4.getColumn(this.model.modelMatrix, 1, new Cesium.Cartesian4()));
//         up = Cesium.Cartesian3.fromCartesian4(Cesium.Matrix4.getColumn(this.model.modelMatrix, 2, new Cesium.Cartesian4()));
//     }
//
//     var rotation = new Cesium.Matrix3();
//     Cesium.Matrix3.setColumn(rotation, 0, right, rotation);
//     Cesium.Matrix3.setColumn(rotation, 1, dir, rotation);
//     Cesium.Matrix3.setColumn(rotation, 2, up, rotation);
//
//     Cesium.Matrix4.fromRotationTranslation(rotation, gpos, this.model.modelMatrix);
//
//     this.tickPopups(dt);
//
//     this.cameraFollow(dt);
//
//     this.shadow.updatePositions(gpos, this.model.modelMatrix, this.scene, this.scene.globe, this.ellipsoid);
// };
//
// // TODO: would be nice to have globe.getGroundNormal() in the API.
// function estimateGroundNormal(globe, pos, ellipsoid) {
//     // Take four height samples around the given position, and use it to
//     // estimate the ground normal at that position.
//     //  (North)
//     //     0
//     //     *
//     //  2* + *3
//     //     *
//     //     1
//     var frame = Cesium.Transforms.eastNorthUpToFixedFrame(pos, ellipsoid);
//     var east = Cesium.Cartesian3.fromCartesian4(Cesium.Matrix4.getColumn(frame, 0, new Cesium.Cartesian4()));
//     var north = Cesium.Cartesian3.fromCartesian4(Cesium.Matrix4.getColumn(frame, 1, new Cesium.Cartesian4()));
//
//     var pos0 = Cesium.Cartesian3.add(pos, east, new Cesium.Cartesian3());
//     var pos1 = Cesium.Cartesian3.subtract(pos, east, new Cesium.Cartesian3());
//     var pos2 = Cesium.Cartesian3.add(pos, north, new Cesium.Cartesian3());
//     var pos3 = Cesium.Cartesian3.subtract(pos, north, new Cesium.Cartesian3());
//
//     function getAlt(p) {
//         var lla = globe.ellipsoid.cartesianToCartographic(p, new Cesium.Cartographic());
//         var height = globe.getHeight(lla);
//         return Cesium.defaultValue(height, 0.0);
//     }
//
//     var dx = getAlt(pos1) - getAlt(pos0);
//     var dy = getAlt(pos3) - getAlt(pos2);
//     var normal = new Cesium.Cartesian3(dx, dy, 2);
//     Cesium.Cartesian3.normalize(normal, normal);
//
//     Cesium.Matrix4.multiplyByPointAsVector(frame, normal, normal);
//     return normal;
// }
//
//
//
//
// var MIN_ZOOM_DISTANCE = 3.0;
//
// function adjustHeightForTerrain(truck) {
//     var scene = truck.scene;
//     var mode = scene.mode;
//     var globe = scene.globe;
//
//     if (!Cesium.defined(globe) || mode === Cesium.SceneMode.SCENE2D || mode === Cesium.SceneMode.MORPHING) {
//         return;
//     }
//
//     var camera = scene.camera;
//     var ellipsoid = globe.ellipsoid;
//     var projection = scene.mapProjection;
//
//     var transform;
//     var mag;
//     if (!Cesium.Matrix4.equals(camera.transform, Cesium.Matrix4.IDENTITY)) {
//         transform = Cesium.Matrix4.clone(camera.transform);
//         mag = Cesium.Cartesian3.magnitude(camera.position);
//         camera._setTransform(Cesium.Matrix4.IDENTITY);
//     }
//
//     var cartographic = new Cesium.Cartographic();
//     if (mode === Cesium.SceneMode.SCENE3D) {
//         ellipsoid.cartesianToCartographic(camera.position, cartographic);
//     } else {
//         projection.unproject(camera.position, cartographic);
//     }
//
//     var height = globe.getHeight(cartographic);
//     if (Cesium.defined(height)) {
//         height += MIN_ZOOM_DISTANCE;
//         if (cartographic.height < height) {
//             cartographic.height = height;
//             if (mode === Cesium.SceneMode.SCENE3D) {
//                 ellipsoid.cartographicToCartesian(cartographic, camera.position);
//             } else {
//                 projection.project(cartographic, camera.position);
//             }
//         }
//     }
//
//     if (Cesium.defined(transform)) {
//         camera._setTransform(transform);
//         Cesium.Cartesian3.normalize(camera.position, camera.position);
//         Cesium.Cartesian3.negate(camera.position, camera.direction);
//         Cesium.Cartesian3.multiplyByScalar(camera.position, mag, camera.position);
//         Cesium.Cartesian3.normalize(camera.direction, camera.direction);
//         Cesium.Cartesian3.cross(camera.direction, camera.up, camera.right);
//         Cesium.Cartesian3.cross(camera.right, camera.direction, camera.up);
//     }
// }