import request from '../util/request';
import apiconfig from '../config/apiconfig'


const {searchChannelConfigs, searchChannelConfig,deleteChannelConfig, updateChannelConfig, createChannelConfig, saveChannelConfig} = apiconfig.api;


export async function findChannels(params) {
    return request({url: searchChannelConfigs, method: 'get', data: params,});
}

export async function findChannel(id) {
    return request({url: searchChannelConfig, method: 'get', data: {id: id},});
}


export async function modifyChannel(id, params) {
    return request({url: updateChannelConfig, method: 'post', data:  {id: id, ...params},});
}

export async function deleteChannel(id) {
    return request({url: deleteChannelConfig, method: 'post', data: {id: id},});
}

export async function createChannel(params) {
    return request({url: createChannelConfig, method: 'post', data: params,});
}