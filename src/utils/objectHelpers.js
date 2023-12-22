exports.pick = (obj, keys) =>
  Object.fromEntries(
    keys.filter((key) => key in obj).map((key) => [key, obj[key]]),
  );

exports.inclusivePick = (obj, keys) =>
  Object.fromEntries(keys.map((key) => [key, obj[key]]));

exports.omit = (obj, keys) =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key)),
  );
