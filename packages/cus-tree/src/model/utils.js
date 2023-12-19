export const getNodeKey = function (key, data) {
    if (!key) return data[NODE_KEY];
    return data[key];
};