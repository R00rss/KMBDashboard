export const isEmpty = (obj) => Object.keys(obj).length === 0;

export const mergeArraysFromId2 = (data, keys_exections = [], keys_change = {}) => {
    console.log("data_________", data);
    let keys = []
    const array = data
    var size = 1;
    const result = []

    for (let index = 0; index < array.length; index += size) {
        const element = array[index];
        const auxName = element[0];
        const itemsThatMatch = array.filter((item) => (item[0] === auxName))
        const itemMixed = {}
        size = itemsThatMatch.length
        for (let i = 0; i < size; i++) {
            if (i === 0) {
                itemMixed["id"] = itemsThatMatch[i][0]
            }
            let aux = String(itemsThatMatch[i][1])
            itemMixed[aux] = itemsThatMatch[i][1]
            if (!keys_exections.includes(String(aux))) {
                if (aux in keys_change) {
                    aux = keys_change[`${aux}`]
                }
                if (!keys.includes("Cantidad " + aux + "s")) {
                    keys.push("Cantidad " + aux + "s");
                }
            }
            itemMixed["Cantidad " + aux + "s"] = itemsThatMatch[i][2]
        }
        result.push(itemMixed)
    }
    return [result, keys]
}
export const sliceIntoChunks = (arr, chunkSize) => {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    console.log(res)
    return res;
}