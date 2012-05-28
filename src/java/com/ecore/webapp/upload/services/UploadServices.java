package com.ecore.webapp.upload.services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.ecore.webapp.upload.ext.IUpLoadAndRemove;
import com.ecore.webapp.upload.tools.PropertiesReader;

/** 
 * @author Ran Ke E-mail: 213539@qq.com
 * @version 创建时间：2010-12-28 下午01:42:26 
 *  
 */

public class UploadServices {

	public void doServletOrFilter(HttpServletRequest request, HttpServletResponse response,ServletContext servletContext)throws ServletException, IOException {
		PropertiesReader pr = new PropertiesReader();
    	String operate = request.getParameter("operate");
    	if(operate == null){
    		operate = "unknow";
    	}
    	if(operate.equals("flashUpload")){
    		request.setCharacterEncoding("UTF-8");
    		response.setCharacterEncoding("UTF-8");
    	}else{
    		request.setCharacterEncoding(pr.getUploaderCharacterEncoding());
    		response.setCharacterEncoding(pr.getResponseCharacterEncoding());
    	}
    	
    	
    	IUpLoadAndRemove ular = null;
    	try {
    		ular = (IUpLoadAndRemove)Class.forName(pr.getUpLoadAndRemoveImpl()).newInstance();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InstantiationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		//删除
		String fileUrl = request.getParameter("fileUrl");
		String remoteFileUrl = request.getParameter("remoteFileUrl");
		
		
		if(operate.equals("removeFile") && fileUrl != null && remoteFileUrl != null){
			response.getWriter().print(ular.doRemoveFile(fileUrl, remoteFileUrl));
		}else if(operate.equals("flashUpload") || operate.equals("upload")){
			
			// Apache 上传工具
			ServletFileUpload upload = new ServletFileUpload(new DiskFileItemFactory());
			
			//上传
			String forder = null;
			String remoteUploadRootFolder  = null;
			List<FileItem> fileList = new ArrayList<FileItem>();
			List itemList = null;
			String ulUri = null;
			
			try {
				itemList = upload.parseRequest(request);
				Iterator iterator = itemList.iterator();
				while (iterator.hasNext()) {
					FileItem item = (FileItem) iterator.next();
					if (item.isFormField()) {
						if(item.getFieldName().equals("folder")){
							forder = item.getString();
							if(forder == null) forder = "";
							forder = forder.replaceAll(request.getContextPath(), "");
						}else if(item.getFieldName().equals("remoteUploadRootFolder")){
							remoteUploadRootFolder = item.getString();
						}else if(item.getFieldName().equals("ulUri")){
							ulUri = item.getString();
						}
					} else {
						fileList.add(item);
					}
				}
				
			} catch (Exception e) {
				e.printStackTrace();
			}
	
			String localUploadPath = servletContext.getRealPath(pr.getLocalUploadPath() + forder);
			String appRootUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath() + "/";;
			response.getWriter().print(ular.doUpLoadFile(forder, remoteUploadRootFolder, localUploadPath, fileList, ulUri, appRootUrl));
			
		}else{
			response.getWriter().print("参数错误!!");
		}
	}
	
}
