import localForage from "localforage";

/**
 * 清除本地缓存
 * @returns {Promise<void>}
 */
export const clearLocalCache = () => {
    return localForage.clear()
}


/**
 * axios 默认方式 post 方式的 body 是 json 结构, 此方法可以将其转换为常规 post 数据结构
 */
export const transformRequest = (data, headers) => {
    const serializedData = []
    for (const k in data) {
        if (data[k]) {
            serializedData.push(`${k}=${encodeURIComponent(data[k])}`)
        }
    }
    return serializedData.join('&')
}
export const paramsSerializer = (params) => {
    const qs = require('qs');
    return qs.stringify(params, {arrayFormat: 'repeat'})
}
