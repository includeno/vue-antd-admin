import {COPYRIGHT_REQUEST,COPYRIGHT_REQUEST_LIST,COPYRIGHT_REQUEST_AUDIT} from '@/services/api'
import {request, METHOD} from '@/utils/request'


/**
 * 获取版权信息申请
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getCopyrightCommit(id) {
    return request(COPYRIGHT_REQUEST, METHOD.GET,{id:id});
}

/**
 * 提交新的版权信息申请
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function addCopyrightCommit(userId,url,comment) {
    let formdata=new FormData();
    formdata.append("userId",userId);
    formdata.append("url",url);
    formdata.append("comment",comment);

    return request(COPYRIGHT_REQUEST, METHOD.POST, formdata);
}

/**
 * 修改版权信息申请
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function updateCopyrightCommit(id,userId,status) {
    let formdata=new FormData();
    formdata.append("id",id);
    formdata.append("userId",userId);
    formdata.append("status",status);
    return request(COPYRIGHT_REQUEST, METHOD.PUT, formdata);
}

export async function deleteCopyrightCommit(id, userId) {
    return request(COPYRIGHT_REQUEST, METHOD.DELTET, {
        id:id,
        userId:userId,
    });
}

/**
 * 获取所有请求
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getCopyrightCommitListByPage(page,size,{url,status,deleted}) {
    return request(COPYRIGHT_REQUEST_LIST, METHOD.GET,{
        page:page,
        size:size,
        url:url,
        status:status,
        deleted:deleted,
    })
}

/**
 * 修改版权信息申请
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function audit(id,auditId,status) {
    let formdata=new FormData();
    formdata.append("id",id);
    formdata.append("auditId",auditId);
    formdata.append("status",status);
    return request(COPYRIGHT_REQUEST_AUDIT, METHOD.PUT, formdata);
}

export default {
    getCopyrightCommit,
    addCopyrightCommit,
    updateCopyrightCommit,
    deleteCopyrightCommit,
    getCopyrightCommitListByPage,
    audit,
}
