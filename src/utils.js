export function removeNull(obj) {
    return Object.keys(obj).forEach(key => obj[key] == null && delete obj[key]);
}