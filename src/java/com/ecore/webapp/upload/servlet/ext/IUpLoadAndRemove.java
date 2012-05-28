package com.ecore.webapp.upload.servlet.ext;

import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import org.apache.commons.fileupload.FileItem;

/** 
 * @author Ran Ke E-mail: 213539@qq.com
 * @version 创建时间：2010-12-24 上午09:36:54 
 * 上传组件的上传和删除的接口 
 */


public interface IUpLoadAndRemove {

	
	/**
	 * 文件上传实现
	 * @param forder  上传的目标文件夹
	 * @param remoteUploadRootFolder  上传的目标文件服务器上传根目录,如 http://test.com/uploads
	 * @param fileItemList
	 * @param localUploadPath 本地文件保存路径
	 * @param ulUri 目标服务器的文件上传Action
	 * @param appRootUrl 应用根url
	 * @return JSON字符串 JSON字符串,可自定义格式在组件客户端作相应解析,默认格式 {saveStat : "saved", url : "http://...", fileName : "name.xxx", errMsg : "errMsg"}
	 * saveStat 值: saved, err 如果值为 err,则后面2个返回值为空
	 * @throws ServletException
	 * @throws IOException
	 */
	public String doUpLoadFile(String forder, String remoteUploadRootFolder, String localUploadPath, List<FileItem> fileItemList, String ulUri, String appRootUrl) throws ServletException, IOException;
	
	/**
	 * 文件删除实现
	 * @param fileUrl
	 * @param remoteFileUrl
	 * @return boolean
	 */
	public boolean doRemoveFile(String fileUrl, String remoteFileUrl);
	
	/**
	 * 文件命名实现
	 * @param fileName 原文件名
	 * @return 新文件名
	 */
	public String fileRename(String fileName);
}
