package com.ecore.webapp.upload.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ecore.webapp.upload.servlet.ext.IUpLoadAndRemove;
import com.ecore.webapp.upload.servlet.tools.PropertiesReader;

public class RemoveFile  extends HttpServlet{

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

    	PropertiesReader pr = new PropertiesReader();
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
		String fileUrl = request.getParameter("fileUrl");
		String remoteFileUrl = request.getParameter("remoteFileUrl");
		response.getWriter().print(ular.doRemoveFile(fileUrl, remoteFileUrl));
	}

    @Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
    	doPost(request, response);
	}
	
}
