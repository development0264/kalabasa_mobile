'use strict'

export default class JsonTyped
{
  static stringifyTyped(value)
  {
    var typedReplacer = (key, value) => {
      if (key !== '_v' && value && value.constructor) {
        var alias = value.constructor.alias ? value.constructor.alias : value.constructor.name;
        if (alias && ['Object', 'Array', 'String', 'Number', 'Boolean'].indexOf(alias) === -1) {
          return {_n: alias, _v: value};
        }
      }
      return value;
    }

    return JSON.stringify(typedReplacer(null, value), typedReplacer);
  }

  static parseTyped(text, types)
  {
    var typesByName = {};
    if (Array.isArray(types) && types.length) {
      types.forEach(function(type){
        if (type.type && type.reviver) {
          typesByName[type.alias ? type.alias : type.name] = type;
        } else {
          typesByName[type.alias ? type.alias : type.name] = {
            type: type,
            reviver: (origValue) => {
              return Object.assign(new type(), origValue);
            }
          }
        };
      });
    }

    var typedReviver = (key, value) => {
      if (value) {
        var name = value._n;
        var origValue = value._v;
        if (name) {
          if (typesByName[name]) {
            var type = typesByName[name].type;
            var reviver = typesByName[name].reviver;
            if (reviver) {
              return reviver(origValue);
            }
          }
          if (origValue) return origValue;
        } else {
          // Revive Date strings
          if (typeof value === 'string') {
            var dateRegex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/i;
            if (dateRegex.test(value)) {
              return new Date(value);
            }
          }
        }
      }
      return value;
    }

    return typedReviver(null, JSON.parse(text, typedReviver));
  }
}
