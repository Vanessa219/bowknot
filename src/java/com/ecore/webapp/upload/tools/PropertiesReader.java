package com.ecore.webapp.upload.tools;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.util.Properties;


public class PropertiesReader {

	private Properties prop;
	
	public PropertiesReader(){
        try{
        	String PropertiesReaderPath = PropertiesReader.class.getProtectionDomain().getCodeSource().getLocation().getPath();
        	String path = PropertiesReaderPath.substring(0,PropertiesReaderPath.indexOf("PropertiesReader.class")) + "upload.properties";
            BufferedInputStream inBuff = new BufferedInputStream(new FileInputStream(path));
            prop = new Properties();
          
            prop.load(inBuff);
            inBuff.close();
        }catch(Exception e){
            e.printStackTrace();
        }
	}
	
	public String getUpLoadAndRemoveImpl(){
		return prop.getProperty("upLoadAndRemoveImpl");
	}
	
	/**
	 * 获取request的字符集配制
	 * @return
	 */
	public String getRequestCharacterEncoding(){
		return prop.getProperty("requestCharacterEncoding");
	}
	
	/**
	 * 获取上传组件的字符集配制
	 * @return
	 */
	public String getUploaderCharacterEncoding(){
		return prop.getProperty("uploaderCharacterEncoding");
	}
	
	/**
	 * 获取response的字符集配制
	 * @return
	 */
	public String getResponseCharacterEncoding(){
		return prop.getProperty("responseCharacterEncoding");
	}
	
	/**
	 * 获取基于应用根目录的上传文件目录,类似  "/oaweb"
	 * @return
	 */
	public String getLocalUploadPath(){
		return "/" + prop.getProperty("localUploadPath");
	}
	
	
	
	
}
