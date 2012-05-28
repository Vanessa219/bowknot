package com.ecore.webapp.upload.servlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.ecore.webapp.upload.ext.IUpLoadAndRemove;
import com.ecore.webapp.upload.services.UploadServices;
import com.ecore.webapp.upload.tools.PropertiesReader;

/** 
 * @author Ran Ke E-mail: 213539@qq.com
 * @version 创建时间：2010-12-24 上午09:36:54 
 * 上传组件的servlet 
 */


public class UploadOrRemoveFile  extends HttpServlet{
	private static final long serialVersionUID = -4935921396709035718L;

    @Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
    	UploadServices upload = new UploadServices();
    	upload.doServletOrFilter(request, response, this.getServletContext());
	}

    @Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
    	PropertiesReader pr = new PropertiesReader();
    	request.setCharacterEncoding(pr.getRequestCharacterEncoding());
    	response.setCharacterEncoding(pr.getResponseCharacterEncoding());
    	String fileUrl = request.getParameter("fileUrl");
		String remoteFileUrl = request.getParameter("remoteFileUrl");
		if(fileUrl == null && remoteFileUrl == null){
			response.getWriter().print("参数错误!!");
		}else{
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
			response.getWriter().print(ular.doRemoveFile(fileUrl, remoteFileUrl));
		}
    	
	}
}
