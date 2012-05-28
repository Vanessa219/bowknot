package com.ecore.webapp.upload.ext.impl;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;
import javax.servlet.ServletException;
import org.apache.commons.fileupload.FileItem;

import com.ecore.webapp.upload.ext.IUpLoadAndRemove;
import com.ecore.webapp.upload.tools.MiscUtil;
import com.ecore.webapp.upload.tools.RandomGUID;

/** 
 * @author Ran Ke E-mail: 213539@qq.com
 * @version ����ʱ�䣺2010-12-24 ����09:36:54 
 * �ϴ��齨�ϴ���ɾ���Ĭ��ʵ����,ɾ���ʵ�� 
 */
public class UpLoadAndRemoveImpl implements IUpLoadAndRemove {

    /**
     * ���ظ�ʽ: JSON�ַ� {saveStat : "saved", url : "http://...", fileName : "name.xxx", errMsg : "errMsg"}
     * saveStat ֵ: saved, err   ���ֵΪ err,��url, fileName����ֵΪ��
     */
    public String doUpLoadFile(String forder, String remoteUploadRootFolder, String localUploadPath, List<FileItem> fileItemList, String ulUri, String appRootUrl) throws ServletException, IOException {


        String returnStr = "[";
        for (int i = 0; i < fileItemList.size(); i++) {
            FileItem item2 = fileItemList.get(i);
            String fileName = item2.getName().replace("/", "\\");//new String(item.getName().getBytes(),"UTF-8").replace("/", "\\");
            if (fileName.lastIndexOf("\\") != -1) {
                fileName = fileName.substring(fileName.lastIndexOf("\\"));
            }

            File saved = new File(localUploadPath, this.fileRename(fileName));
            saved.getParentFile().mkdirs();

            InputStream ins = item2.getInputStream();
            OutputStream ous = new FileOutputStream(saved);

            byte[] tmp = new byte[1024];
            int len = -1;

            while ((len = ins.read(tmp)) != -1) {
                ous.write(tmp, 0, len);
            }

            ous.close();
            ins.close();

            if (remoteUploadRootFolder != null && remoteUploadRootFolder.startsWith("http://")) {
                if (MiscUtil.copyFile(saved.getPath(), remoteUploadRootFolder + "/" + saved.getName(), forder, ulUri)) {
                    returnStr += "{saveStat : \"saved\", url : \"" + remoteUploadRootFolder + "/" + saved.getName() + "\", fileName : \"" + fileName + "\", errMsg : \"\"}";
                } else {
                    returnStr += "{saveStat : \"err\", url : \"\", fileName : \"\", errMsg : \"�ϴ���Զ�̷�����ʧ��\"}";
                }
                saved.delete();
            } else {
                returnStr += "{saveStat : \"saved\", url : \"" + appRootUrl + forder + "/" + saved.getName() + "\", fileName : \"" + fileName + "\", errMsg : \"\"}";
            }
            if ((i + 1) != fileItemList.size()) {
                returnStr += ",";
            }
        }
        returnStr += "]";

        return returnStr;
    }

    public boolean doRemoveFile(String fileUrl, String remoteFileUrl) {
        return false;
    }

    public String fileRename(String fileName) {
        RandomGUID myGuid = new RandomGUID();
        return myGuid.valueAfterMD5 + fileName.substring(fileName.lastIndexOf("."));
        //  return fileName;
    }
}
