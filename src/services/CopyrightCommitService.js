import {COPYRIGHT_REQUEST,COPYRIGHT_REQUEST_LIST} from '@/services/api'
import {request, METHOD} from '@/utils/request'


/**
 * 获取版权信息申请
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getCopyrightRequest(id) {
    return request(COPYRIGHT_REQUEST, METHOD.GET,{id:id});
}

/**
 * 提交新的版权信息申请
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function addCopyrightRequest(userId,url,platform,platformHash,comment) {
    let formdata=new FormData();
    formdata.append("userId",userId);
    formdata.append("url",url);
    formdata.append("platform",platform);
    formdata.append("platformHash",platformHash);
    formdata.append("comment",comment);

    return request(COPYRIGHT_REQUEST, METHOD.POST, formdata);
}

/**
 * 修改版权信息申请
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function updateCopyrightRequest(id,userId,email,platform,platformHash,comment) {
    let formdata=new FormData();
    formdata.append("id",id);
    formdata.append("userId",userId);
    formdata.append("email",email);
    formdata.append("platform",platform);
    formdata.append("platformHash",platformHash);
    formdata.append("comment",comment);
    return request(COPYRIGHT_REQUEST, METHOD.PUT, formdata);
}

export async function deleteCopyrightRequest(id, userId) {
    return request(COPYRIGHT_REQUEST, METHOD.DELTET, {
        id:id,
        userId:userId,
    });
}

/**
 * 获取所有请求
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getCopyrightRequestListByPage(page,size,{url,email,userId,status,deleted}) {
    return request(COPYRIGHT_REQUEST_LIST, METHOD.GET,{
        page:page,
        size:size,
        email:email,
        userId:userId,
        url:url,
        status:status,
        deleted:deleted,
    })
}

export default {
    getCopyrightRequest,
    addCopyrightRequest,
    updateCopyrightRequest,
    deleteCopyrightRequest,
    getCopyrightRequestListByPage,
}
