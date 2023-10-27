// node_modules/superjson/dist/esm/double-indexed-kv.js
var DoubleIndexedKV = function() {
  function DoubleIndexedKV2() {
    this.keyToValue = new Map;
    this.valueToKey = new Map;
  }
  DoubleIndexedKV2.prototype.set = function(key, value) {
    this.keyToValue.set(key, value);
    this.valueToKey.set(value, key);
  };
  DoubleIndexedKV2.prototype.getByKey = function(key) {
    return this.keyToValue.get(key);
  };
  DoubleIndexedKV2.prototype.getByValue = function(value) {
    return this.valueToKey.get(value);
  };
  DoubleIndexedKV2.prototype.clear = function() {
    this.keyToValue.clear();
    this.valueToKey.clear();
  };
  return DoubleIndexedKV2;
}();

// node_modules/superjson/dist/esm/registry.js
var Registry = function() {
  function Registry2(generateIdentifier) {
    this.generateIdentifier = generateIdentifier;
    this.kv = new DoubleIndexedKV;
  }
  Registry2.prototype.register = function(value, identifier) {
    if (this.kv.getByValue(value)) {
      return;
    }
    if (!identifier) {
      identifier = this.generateIdentifier(value);
    }
    this.kv.set(identifier, value);
  };
  Registry2.prototype.clear = function() {
    this.kv.clear();
  };
  Registry2.prototype.getIdentifier = function(value) {
    return this.kv.getByValue(value);
  };
  Registry2.prototype.getValue = function(identifier) {
    return this.kv.getByKey(identifier);
  };
  return Registry2;
}();

// node_modules/superjson/dist/esm/class-registry.js
var __extends = function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p))
          d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __);
  };
}();
var ClassRegistry = function(_super) {
  __extends(ClassRegistry2, _super);
  function ClassRegistry2() {
    var _this = _super.call(this, function(c) {
      return c.name;
    }) || this;
    _this.classToAllowedProps = new Map;
    return _this;
  }
  ClassRegistry2.prototype.register = function(value, options) {
    if (typeof options === "object") {
      if (options.allowProps) {
        this.classToAllowedProps.set(value, options.allowProps);
      }
      _super.prototype.register.call(this, value, options.identifier);
    } else {
      _super.prototype.register.call(this, value, options);
    }
  };
  ClassRegistry2.prototype.getAllowedProps = function(value) {
    return this.classToAllowedProps.get(value);
  };
  return ClassRegistry2;
}(Registry);

// node_modules/superjson/dist/esm/util.js
var valuesOfObj = function(record) {
  if ("values" in Object) {
    return Object.values(record);
  }
  var values = [];
  for (var key in record) {
    if (record.hasOwnProperty(key)) {
      values.push(record[key]);
    }
  }
  return values;
};
function find(record, predicate) {
  var values = valuesOfObj(record);
  if ("find" in values) {
    return values.find(predicate);
  }
  var valuesNotNever = values;
  for (var i = 0;i < valuesNotNever.length; i++) {
    var value = valuesNotNever[i];
    if (predicate(value)) {
      return value;
    }
  }
  return;
}
function forEach(record, run) {
  Object.entries(record).forEach(function(_a) {
    var _b = __read(_a, 2), key = _b[0], value = _b[1];
    return run(value, key);
  });
}
function includes(arr, value) {
  return arr.indexOf(value) !== -1;
}
function findArr(record, predicate) {
  for (var i = 0;i < record.length; i++) {
    var value = record[i];
    if (predicate(value)) {
      return value;
    }
  }
  return;
}
var __read = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m)
    return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === undefined || n-- > 0) && !(r = i.next()).done)
      ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"]))
        m.call(i);
    } finally {
      if (e)
        throw e.error;
    }
  }
  return ar;
};

// node_modules/superjson/dist/esm/custom-transformer-registry.js
var CustomTransformerRegistry = function() {
  function CustomTransformerRegistry2() {
    this.transfomers = {};
  }
  CustomTransformerRegistry2.prototype.register = function(transformer) {
    this.transfomers[transformer.name] = transformer;
  };
  CustomTransformerRegistry2.prototype.findApplicable = function(v) {
    return find(this.transfomers, function(transformer) {
      return transformer.isApplicable(v);
    });
  };
  CustomTransformerRegistry2.prototype.findByName = function(name) {
    return this.transfomers[name];
  };
  return CustomTransformerRegistry2;
}();

// node_modules/superjson/dist/esm/is.js
var getType = function(payload) {
  return Object.prototype.toString.call(payload).slice(8, -1);
};
var isUndefined = function(payload) {
  return typeof payload === "undefined";
};
var isNull = function(payload) {
  return payload === null;
};
var isPlainObject = function(payload) {
  if (typeof payload !== "object" || payload === null)
    return false;
  if (payload === Object.prototype)
    return false;
  if (Object.getPrototypeOf(payload) === null)
    return true;
  return Object.getPrototypeOf(payload) === Object.prototype;
};
var isEmptyObject = function(payload) {
  return isPlainObject(payload) && Object.keys(payload).length === 0;
};
var isArray = function(payload) {
  return Array.isArray(payload);
};
var isString = function(payload) {
  return typeof payload === "string";
};
var isNumber = function(payload) {
  return typeof payload === "number" && !isNaN(payload);
};
var isBoolean = function(payload) {
  return typeof payload === "boolean";
};
var isRegExp = function(payload) {
  return payload instanceof RegExp;
};
var isMap = function(payload) {
  return payload instanceof Map;
};
var isSet = function(payload) {
  return payload instanceof Set;
};
var isSymbol = function(payload) {
  return getType(payload) === "Symbol";
};
var isDate = function(payload) {
  return payload instanceof Date && !isNaN(payload.valueOf());
};
var isError = function(payload) {
  return payload instanceof Error;
};
var isNaNValue = function(payload) {
  return typeof payload === "number" && isNaN(payload);
};
var isPrimitive = function(payload) {
  return isBoolean(payload) || isNull(payload) || isUndefined(payload) || isNumber(payload) || isString(payload) || isSymbol(payload);
};
var isBigint = function(payload) {
  return typeof payload === "bigint";
};
var isInfinite = function(payload) {
  return payload === Infinity || payload === (-Infinity);
};
var isTypedArray = function(payload) {
  return ArrayBuffer.isView(payload) && !(payload instanceof DataView);
};
var isURL = function(payload) {
  return payload instanceof URL;
};

// node_modules/superjson/dist/esm/pathstringifier.js
var escapeKey = function(key) {
  return key.replace(/\./g, "\\.");
};
var stringifyPath = function(path) {
  return path.map(String).map(escapeKey).join(".");
};
var parsePath = function(string) {
  var result = [];
  var segment = "";
  for (var i = 0;i < string.length; i++) {
    var char = string.charAt(i);
    var isEscapedDot = char === "\\" && string.charAt(i + 1) === ".";
    if (isEscapedDot) {
      segment += ".";
      i++;
      continue;
    }
    var isEndOfSegment = char === ".";
    if (isEndOfSegment) {
      result.push(segment);
      segment = "";
      continue;
    }
    segment += char;
  }
  var lastSegment = segment;
  result.push(lastSegment);
  return result;
};

// node_modules/superjson/dist/esm/transformer.js
var simpleTransformation = function(isApplicable, annotation, transform, untransform) {
  return {
    isApplicable,
    annotation,
    transform,
    untransform
  };
};
var compositeTransformation = function(isApplicable, annotation, transform, untransform) {
  return {
    isApplicable,
    annotation,
    transform,
    untransform
  };
};
function isInstanceOfRegisteredClass(potentialClass, superJson) {
  if (potentialClass === null || potentialClass === undefined ? undefined : potentialClass.constructor) {
    var isRegistered = !!superJson.classRegistry.getIdentifier(potentialClass.constructor);
    return isRegistered;
  }
  return false;
}
var __assign = function() {
  __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length;i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __read2 = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m)
    return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === undefined || n-- > 0) && !(r = i.next()).done)
      ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"]))
        m.call(i);
    } finally {
      if (e)
        throw e.error;
    }
  }
  return ar;
};
var __spreadArray = function(to, from) {
  for (var i = 0, il = from.length, j = to.length;i < il; i++, j++)
    to[j] = from[i];
  return to;
};
var simpleRules = [
  simpleTransformation(isUndefined, "undefined", function() {
    return null;
  }, function() {
    return;
  }),
  simpleTransformation(isBigint, "bigint", function(v) {
    return v.toString();
  }, function(v) {
    if (typeof BigInt !== "undefined") {
      return BigInt(v);
    }
    console.error("Please add a BigInt polyfill.");
    return v;
  }),
  simpleTransformation(isDate, "Date", function(v) {
    return v.toISOString();
  }, function(v) {
    return new Date(v);
  }),
  simpleTransformation(isError, "Error", function(v, superJson) {
    var baseError = {
      name: v.name,
      message: v.message
    };
    superJson.allowedErrorProps.forEach(function(prop) {
      baseError[prop] = v[prop];
    });
    return baseError;
  }, function(v, superJson) {
    var e = new Error(v.message);
    e.name = v.name;
    e.stack = v.stack;
    superJson.allowedErrorProps.forEach(function(prop) {
      e[prop] = v[prop];
    });
    return e;
  }),
  simpleTransformation(isRegExp, "regexp", function(v) {
    return "" + v;
  }, function(regex) {
    var body = regex.slice(1, regex.lastIndexOf("/"));
    var flags = regex.slice(regex.lastIndexOf("/") + 1);
    return new RegExp(body, flags);
  }),
  simpleTransformation(isSet, "set", function(v) {
    return __spreadArray([], __read2(v.values()));
  }, function(v) {
    return new Set(v);
  }),
  simpleTransformation(isMap, "map", function(v) {
    return __spreadArray([], __read2(v.entries()));
  }, function(v) {
    return new Map(v);
  }),
  simpleTransformation(function(v) {
    return isNaNValue(v) || isInfinite(v);
  }, "number", function(v) {
    if (isNaNValue(v)) {
      return "NaN";
    }
    if (v > 0) {
      return "Infinity";
    } else {
      return "-Infinity";
    }
  }, Number),
  simpleTransformation(function(v) {
    return v === 0 && 1 / v === (-Infinity);
  }, "number", function() {
    return "-0";
  }, Number),
  simpleTransformation(isURL, "URL", function(v) {
    return v.toString();
  }, function(v) {
    return new URL(v);
  })
];
var symbolRule = compositeTransformation(function(s, superJson) {
  if (isSymbol(s)) {
    var isRegistered = !!superJson.symbolRegistry.getIdentifier(s);
    return isRegistered;
  }
  return false;
}, function(s, superJson) {
  var identifier = superJson.symbolRegistry.getIdentifier(s);
  return ["symbol", identifier];
}, function(v) {
  return v.description;
}, function(_, a, superJson) {
  var value = superJson.symbolRegistry.getValue(a[1]);
  if (!value) {
    throw new Error("Trying to deserialize unknown symbol");
  }
  return value;
});
var constructorToName = [
  Int8Array,
  Uint8Array,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
  Uint8ClampedArray
].reduce(function(obj, ctor) {
  obj[ctor.name] = ctor;
  return obj;
}, {});
var typedArrayRule = compositeTransformation(isTypedArray, function(v) {
  return ["typed-array", v.constructor.name];
}, function(v) {
  return __spreadArray([], __read2(v));
}, function(v, a) {
  var ctor = constructorToName[a[1]];
  if (!ctor) {
    throw new Error("Trying to deserialize unknown typed array");
  }
  return new ctor(v);
});
var classRule = compositeTransformation(isInstanceOfRegisteredClass, function(clazz, superJson) {
  var identifier = superJson.classRegistry.getIdentifier(clazz.constructor);
  return ["class", identifier];
}, function(clazz, superJson) {
  var allowedProps = superJson.classRegistry.getAllowedProps(clazz.constructor);
  if (!allowedProps) {
    return __assign({}, clazz);
  }
  var result = {};
  allowedProps.forEach(function(prop) {
    result[prop] = clazz[prop];
  });
  return result;
}, function(v, a, superJson) {
  var clazz = superJson.classRegistry.getValue(a[1]);
  if (!clazz) {
    throw new Error("Trying to deserialize unknown class - check https://github.com/blitz-js/superjson/issues/116#issuecomment-773996564");
  }
  return Object.assign(Object.create(clazz.prototype), v);
});
var customRule = compositeTransformation(function(value, superJson) {
  return !!superJson.customTransformerRegistry.findApplicable(value);
}, function(value, superJson) {
  var transformer = superJson.customTransformerRegistry.findApplicable(value);
  return ["custom", transformer.name];
}, function(value, superJson) {
  var transformer = superJson.customTransformerRegistry.findApplicable(value);
  return transformer.serialize(value);
}, function(v, a, superJson) {
  var transformer = superJson.customTransformerRegistry.findByName(a[1]);
  if (!transformer) {
    throw new Error("Trying to deserialize unknown custom value");
  }
  return transformer.deserialize(v);
});
var compositeRules = [classRule, symbolRule, customRule, typedArrayRule];
var transformValue = function(value, superJson) {
  var applicableCompositeRule = findArr(compositeRules, function(rule) {
    return rule.isApplicable(value, superJson);
  });
  if (applicableCompositeRule) {
    return {
      value: applicableCompositeRule.transform(value, superJson),
      type: applicableCompositeRule.annotation(value, superJson)
    };
  }
  var applicableSimpleRule = findArr(simpleRules, function(rule) {
    return rule.isApplicable(value, superJson);
  });
  if (applicableSimpleRule) {
    return {
      value: applicableSimpleRule.transform(value, superJson),
      type: applicableSimpleRule.annotation
    };
  }
  return;
};
var simpleRulesByAnnotation = {};
simpleRules.forEach(function(rule) {
  simpleRulesByAnnotation[rule.annotation] = rule;
});
var untransformValue = function(json, type, superJson) {
  if (isArray(type)) {
    switch (type[0]) {
      case "symbol":
        return symbolRule.untransform(json, type, superJson);
      case "class":
        return classRule.untransform(json, type, superJson);
      case "custom":
        return customRule.untransform(json, type, superJson);
      case "typed-array":
        return typedArrayRule.untransform(json, type, superJson);
      default:
        throw new Error("Unknown transformation: " + type);
    }
  } else {
    var transformation = simpleRulesByAnnotation[type];
    if (!transformation) {
      throw new Error("Unknown transformation: " + type);
    }
    return transformation.untransform(json, superJson);
  }
};

// node_modules/superjson/dist/esm/accessDeep.js
var validatePath = function(path) {
  if (includes(path, "__proto__")) {
    throw new Error("__proto__ is not allowed as a property");
  }
  if (includes(path, "prototype")) {
    throw new Error("prototype is not allowed as a property");
  }
  if (includes(path, "constructor")) {
    throw new Error("constructor is not allowed as a property");
  }
};
var getNthKey = function(value, n) {
  var keys = value.keys();
  while (n > 0) {
    keys.next();
    n--;
  }
  return keys.next().value;
};
var getDeep = function(object, path) {
  validatePath(path);
  for (var i = 0;i < path.length; i++) {
    var key = path[i];
    if (isSet(object)) {
      object = getNthKey(object, +key);
    } else if (isMap(object)) {
      var row = +key;
      var type = +path[++i] === 0 ? "key" : "value";
      var keyOfRow = getNthKey(object, row);
      switch (type) {
        case "key":
          object = keyOfRow;
          break;
        case "value":
          object = object.get(keyOfRow);
          break;
      }
    } else {
      object = object[key];
    }
  }
  return object;
};
var setDeep = function(object, path, mapper) {
  validatePath(path);
  if (path.length === 0) {
    return mapper(object);
  }
  var parent = object;
  for (var i = 0;i < path.length - 1; i++) {
    var key = path[i];
    if (isArray(parent)) {
      var index = +key;
      parent = parent[index];
    } else if (isPlainObject(parent)) {
      parent = parent[key];
    } else if (isSet(parent)) {
      var row = +key;
      parent = getNthKey(parent, row);
    } else if (isMap(parent)) {
      var isEnd = i === path.length - 2;
      if (isEnd) {
        break;
      }
      var row = +key;
      var type = +path[++i] === 0 ? "key" : "value";
      var keyOfRow = getNthKey(parent, row);
      switch (type) {
        case "key":
          parent = keyOfRow;
          break;
        case "value":
          parent = parent.get(keyOfRow);
          break;
      }
    }
  }
  var lastKey = path[path.length - 1];
  if (isArray(parent)) {
    parent[+lastKey] = mapper(parent[+lastKey]);
  } else if (isPlainObject(parent)) {
    parent[lastKey] = mapper(parent[lastKey]);
  }
  if (isSet(parent)) {
    var oldValue = getNthKey(parent, +lastKey);
    var newValue = mapper(oldValue);
    if (oldValue !== newValue) {
      parent["delete"](oldValue);
      parent.add(newValue);
    }
  }
  if (isMap(parent)) {
    var row = +path[path.length - 2];
    var keyToRow = getNthKey(parent, row);
    var type = +lastKey === 0 ? "key" : "value";
    switch (type) {
      case "key": {
        var newKey = mapper(keyToRow);
        parent.set(newKey, parent.get(keyToRow));
        if (newKey !== keyToRow) {
          parent["delete"](keyToRow);
        }
        break;
      }
      case "value": {
        parent.set(keyToRow, mapper(parent.get(keyToRow)));
        break;
      }
    }
  }
  return object;
};

// node_modules/superjson/dist/esm/plainer.js
var traverse = function(tree, walker, origin) {
  if (origin === undefined) {
    origin = [];
  }
  if (!tree) {
    return;
  }
  if (!isArray(tree)) {
    forEach(tree, function(subtree, key) {
      return traverse(subtree, walker, __spreadArray2(__spreadArray2([], __read3(origin)), __read3(parsePath(key))));
    });
    return;
  }
  var _a = __read3(tree, 2), nodeValue = _a[0], children = _a[1];
  if (children) {
    forEach(children, function(child, key) {
      traverse(child, walker, __spreadArray2(__spreadArray2([], __read3(origin)), __read3(parsePath(key))));
    });
  }
  walker(nodeValue, origin);
};
function applyValueAnnotations(plain, annotations, superJson) {
  traverse(annotations, function(type, path) {
    plain = setDeep(plain, path, function(v) {
      return untransformValue(v, type, superJson);
    });
  });
  return plain;
}
function applyReferentialEqualityAnnotations(plain, annotations) {
  function apply(identicalPaths, path) {
    var object = getDeep(plain, parsePath(path));
    identicalPaths.map(parsePath).forEach(function(identicalObjectPath) {
      plain = setDeep(plain, identicalObjectPath, function() {
        return object;
      });
    });
  }
  if (isArray(annotations)) {
    var _a = __read3(annotations, 2), root = _a[0], other = _a[1];
    root.forEach(function(identicalPath) {
      plain = setDeep(plain, parsePath(identicalPath), function() {
        return plain;
      });
    });
    if (other) {
      forEach(other, apply);
    }
  } else {
    forEach(annotations, apply);
  }
  return plain;
}
var addIdentity = function(object, path, identities) {
  var existingSet = identities.get(object);
  if (existingSet) {
    existingSet.push(path);
  } else {
    identities.set(object, [path]);
  }
};
function generateReferentialEqualityAnnotations(identitites, dedupe) {
  var result = {};
  var rootEqualityPaths = undefined;
  identitites.forEach(function(paths) {
    if (paths.length <= 1) {
      return;
    }
    if (!dedupe) {
      paths = paths.map(function(path) {
        return path.map(String);
      }).sort(function(a, b) {
        return a.length - b.length;
      });
    }
    var _a = __read3(paths), representativePath = _a[0], identicalPaths = _a.slice(1);
    if (representativePath.length === 0) {
      rootEqualityPaths = identicalPaths.map(stringifyPath);
    } else {
      result[stringifyPath(representativePath)] = identicalPaths.map(stringifyPath);
    }
  });
  if (rootEqualityPaths) {
    if (isEmptyObject(result)) {
      return [rootEqualityPaths];
    } else {
      return [rootEqualityPaths, result];
    }
  } else {
    return isEmptyObject(result) ? undefined : result;
  }
}
var __read3 = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m)
    return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === undefined || n-- > 0) && !(r = i.next()).done)
      ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"]))
        m.call(i);
    } finally {
      if (e)
        throw e.error;
    }
  }
  return ar;
};
var __spreadArray2 = function(to, from) {
  for (var i = 0, il = from.length, j = to.length;i < il; i++, j++)
    to[j] = from[i];
  return to;
};
var isDeep = function(object, superJson) {
  return isPlainObject(object) || isArray(object) || isMap(object) || isSet(object) || isInstanceOfRegisteredClass(object, superJson);
};
var walker = function(object, identities, superJson, dedupe, path, objectsInThisPath, seenObjects) {
  var _a;
  if (path === undefined) {
    path = [];
  }
  if (objectsInThisPath === undefined) {
    objectsInThisPath = [];
  }
  if (seenObjects === undefined) {
    seenObjects = new Map;
  }
  var primitive = isPrimitive(object);
  if (!primitive) {
    addIdentity(object, path, identities);
    var seen = seenObjects.get(object);
    if (seen) {
      return dedupe ? {
        transformedValue: null
      } : seen;
    }
  }
  if (!isDeep(object, superJson)) {
    var transformed_1 = transformValue(object, superJson);
    var result_1 = transformed_1 ? {
      transformedValue: transformed_1.value,
      annotations: [transformed_1.type]
    } : {
      transformedValue: object
    };
    if (!primitive) {
      seenObjects.set(object, result_1);
    }
    return result_1;
  }
  if (includes(objectsInThisPath, object)) {
    return {
      transformedValue: null
    };
  }
  var transformationResult = transformValue(object, superJson);
  var transformed = (_a = transformationResult === null || transformationResult === undefined ? undefined : transformationResult.value) !== null && _a !== undefined ? _a : object;
  var transformedValue = isArray(transformed) ? [] : {};
  var innerAnnotations = {};
  forEach(transformed, function(value, index) {
    var recursiveResult = walker(value, identities, superJson, dedupe, __spreadArray2(__spreadArray2([], __read3(path)), [index]), __spreadArray2(__spreadArray2([], __read3(objectsInThisPath)), [object]), seenObjects);
    transformedValue[index] = recursiveResult.transformedValue;
    if (isArray(recursiveResult.annotations)) {
      innerAnnotations[index] = recursiveResult.annotations;
    } else if (isPlainObject(recursiveResult.annotations)) {
      forEach(recursiveResult.annotations, function(tree, key) {
        innerAnnotations[escapeKey(index) + "." + key] = tree;
      });
    }
  });
  var result = isEmptyObject(innerAnnotations) ? {
    transformedValue,
    annotations: transformationResult ? [transformationResult.type] : undefined
  } : {
    transformedValue,
    annotations: transformationResult ? [transformationResult.type, innerAnnotations] : innerAnnotations
  };
  if (!primitive) {
    seenObjects.set(object, result);
  }
  return result;
};

// node_modules/is-what/dist/index.js
var getType2 = function(payload) {
  return Object.prototype.toString.call(payload).slice(8, -1);
};
var isUndefined2 = function(payload) {
  return getType2(payload) === "Undefined";
};
var isNull2 = function(payload) {
  return getType2(payload) === "Null";
};
var isPlainObject2 = function(payload) {
  if (getType2(payload) !== "Object")
    return false;
  const prototype = Object.getPrototypeOf(payload);
  return !!prototype && prototype.constructor === Object && prototype === Object.prototype;
};
var isArray2 = function(payload) {
  return getType2(payload) === "Array";
};
var isOneOf = function(a, b, c, d, e) {
  return (value) => a(value) || b(value) || !!c && c(value) || !!d && d(value) || !!e && e(value);
};
var isNullOrUndefined = isOneOf(isNull2, isUndefined2);

// node_modules/copy-anything/dist/index.js
var assignProp = function(carry, key, newVal, originalObject, includeNonenumerable) {
  const propType = {}.propertyIsEnumerable.call(originalObject, key) ? "enumerable" : "nonenumerable";
  if (propType === "enumerable")
    carry[key] = newVal;
  if (includeNonenumerable && propType === "nonenumerable") {
    Object.defineProperty(carry, key, {
      value: newVal,
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
};
var copy = function(target, options = {}) {
  if (isArray2(target)) {
    return target.map((item) => copy(item, options));
  }
  if (!isPlainObject2(target)) {
    return target;
  }
  const props = Object.getOwnPropertyNames(target);
  const symbols = Object.getOwnPropertySymbols(target);
  return [...props, ...symbols].reduce((carry, key) => {
    if (isArray2(options.props) && !options.props.includes(key)) {
      return carry;
    }
    const val = target[key];
    const newVal = copy(val, options);
    assignProp(carry, key, newVal, target, options.nonenumerable);
    return carry;
  }, {});
};

// node_modules/superjson/dist/esm/index.js
var __assign2 = function() {
  __assign2 = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length;i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
    }
    return t;
  };
  return __assign2.apply(this, arguments);
};
var __read4 = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m)
    return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === undefined || n-- > 0) && !(r = i.next()).done)
      ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"]))
        m.call(i);
    } finally {
      if (e)
        throw e.error;
    }
  }
  return ar;
};
var __spreadArray3 = function(to, from) {
  for (var i = 0, il = from.length, j = to.length;i < il; i++, j++)
    to[j] = from[i];
  return to;
};
var SuperJSON = function() {
  function SuperJSON2(_a) {
    var _b = _a === undefined ? {} : _a, _c = _b.dedupe, dedupe = _c === undefined ? false : _c;
    this.classRegistry = new ClassRegistry;
    this.symbolRegistry = new Registry(function(s) {
      var _a2;
      return (_a2 = s.description) !== null && _a2 !== undefined ? _a2 : "";
    });
    this.customTransformerRegistry = new CustomTransformerRegistry;
    this.allowedErrorProps = [];
    this.dedupe = dedupe;
  }
  SuperJSON2.prototype.serialize = function(object) {
    var identities = new Map;
    var output = walker(object, identities, this, this.dedupe);
    var res = {
      json: output.transformedValue
    };
    if (output.annotations) {
      res.meta = __assign2(__assign2({}, res.meta), { values: output.annotations });
    }
    var equalityAnnotations = generateReferentialEqualityAnnotations(identities, this.dedupe);
    if (equalityAnnotations) {
      res.meta = __assign2(__assign2({}, res.meta), { referentialEqualities: equalityAnnotations });
    }
    return res;
  };
  SuperJSON2.prototype.deserialize = function(payload) {
    var { json, meta } = payload;
    var result = copy(json);
    if (meta === null || meta === undefined ? undefined : meta.values) {
      result = applyValueAnnotations(result, meta.values, this);
    }
    if (meta === null || meta === undefined ? undefined : meta.referentialEqualities) {
      result = applyReferentialEqualityAnnotations(result, meta.referentialEqualities);
    }
    return result;
  };
  SuperJSON2.prototype.stringify = function(object) {
    return JSON.stringify(this.serialize(object));
  };
  SuperJSON2.prototype.parse = function(string) {
    return this.deserialize(JSON.parse(string));
  };
  SuperJSON2.prototype.registerClass = function(v, options) {
    this.classRegistry.register(v, options);
  };
  SuperJSON2.prototype.registerSymbol = function(v, identifier) {
    this.symbolRegistry.register(v, identifier);
  };
  SuperJSON2.prototype.registerCustom = function(transformer2, name) {
    this.customTransformerRegistry.register(__assign2({ name }, transformer2));
  };
  SuperJSON2.prototype.allowErrorProps = function() {
    var _a;
    var props = [];
    for (var _i = 0;_i < arguments.length; _i++) {
      props[_i] = arguments[_i];
    }
    (_a = this.allowedErrorProps).push.apply(_a, __spreadArray3([], __read4(props)));
  };
  SuperJSON2.defaultInstance = new SuperJSON2;
  SuperJSON2.serialize = SuperJSON2.defaultInstance.serialize.bind(SuperJSON2.defaultInstance);
  SuperJSON2.deserialize = SuperJSON2.defaultInstance.deserialize.bind(SuperJSON2.defaultInstance);
  SuperJSON2.stringify = SuperJSON2.defaultInstance.stringify.bind(SuperJSON2.defaultInstance);
  SuperJSON2.parse = SuperJSON2.defaultInstance.parse.bind(SuperJSON2.defaultInstance);
  SuperJSON2.registerClass = SuperJSON2.defaultInstance.registerClass.bind(SuperJSON2.defaultInstance);
  SuperJSON2.registerSymbol = SuperJSON2.defaultInstance.registerSymbol.bind(SuperJSON2.defaultInstance);
  SuperJSON2.registerCustom = SuperJSON2.defaultInstance.registerCustom.bind(SuperJSON2.defaultInstance);
  SuperJSON2.allowErrorProps = SuperJSON2.defaultInstance.allowErrorProps.bind(SuperJSON2.defaultInstance);
  return SuperJSON2;
}();
var esm_default = SuperJSON;
var serialize = SuperJSON.serialize;
var deserialize = SuperJSON.deserialize;
var stringify = SuperJSON.stringify;
var parse = SuperJSON.parse;
var registerClass = SuperJSON.registerClass;
var registerCustom = SuperJSON.registerCustom;
var registerSymbol = SuperJSON.registerSymbol;
var allowErrorProps = SuperJSON.allowErrorProps;

// src/fail-code.ts
var failCode = {
  "network-error": () => "Network Error",
  "internal-server-error": () => "Internal Server Error",
  "not-found": () => "Not Found",
  "not-allow-method": () => "Not Allow Method",
  "general-type-safe-error": (p) => `Parameter Error: The current value is '${p.value}', which does not meet '${p.expected}' requirements`,
  "business-fail": (message) => `${message}`
};

// package/client/index.ts
function createClient(clientOptions) {
  const execute = async (path, data, headers = {}) => {
    const request = new Request(`${clientOptions.url}${path}`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        ...headers
      }),
      body: esm_default.stringify(data)
    });
    let result;
    try {
      console.warn(request);
      const response = await fetch(request);
      result = esm_default.parse(await response.text());
    } catch (e) {
      console.warn("[client] \u8BF7\u6C42\u5931\u8D25\uFF0C\u53EF\u80FD\u662F\u7F51\u7EDC\u539F\u56E0", e);
      result = {
        success: false,
        fail: {
          code: "network-error",
          message: failCode["network-error"](),
          data: undefined
        }
      };
    }
    return result;
  };
  return {
    execute
  };
}
var FailCode = failCode;
export {
  createClient,
  FailCode
};
