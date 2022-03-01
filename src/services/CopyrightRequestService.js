import {COPYRIGHT_REQUEST,COPYRIGHT_REQUEST_LIST} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 提交新的版权申请
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
 * 修改版权申请
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

export async function deleteCopyrightRequest(id, userId,email) {
    return request(COPYRIGHT_REQUEST, METHOD.DELTET, {
        id:id,
        userId:userId,
        email:email,
    });
}

/**
 * 获取所有请求
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getCopyrightRequestListByPage(page,size,{email,url,deleted}) {
    return request(COPYRIGHT_REQUEST_LIST, METHOD.GET,{
        page:page,
        size:size,
        email:email,
        url:url,
        deleted:deleted,
    })
}

export default {
    addCopyrightRequest,
    updateCopyrightRequest,
    deleteCopyrightRequest,
    getCopyrightRequestListByPage,
}
