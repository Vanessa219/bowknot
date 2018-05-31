/*
 * Copyright (c) 2012, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
package com.yxtech.marketing;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 页面渲染 & 静态页面生成.
 *
 * @author <a href="http://vanessa.b3log.org">Liyuan Li</a>
 * @version 1.0.0.1, Jan 30, 2014
 */
public class RequestServlet extends HttpServlet {

    public RequestServlet() {
        super();
    }

    //负责管理FreeMarker模板的Configuration实例  
    private Configuration cfg = null;

    @Override
    public void init() throws ServletException {
        //创建一个FreeMarker实例  
        cfg = new Configuration();
        //指定FreeMarker模板文件的位置  
        cfg.setServletContextForTemplateLoading(getServletContext(), "/WEB-INF/view");
        cfg.setDefaultEncoding("UTF-8");
    }

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doPost(request, response);
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        //建立数据模型  
        Map root = new HashMap();

        // 模版处理
        String urlPath = request.getServletPath();
        Template t = cfg.getTemplate(urlPath.replace(".html", ".ftl"));
        t.setEncoding("UTF-8");
        response.setContentType("text/html; charset=UTF-8");
        Writer writer = response.getWriter();
        try {
            t.process(root, writer);
        } catch (TemplateException ex) {
            Logger.getLogger(RequestServlet.class.getName()).log(Level.SEVERE, null, ex);
        }

        // 静态页面生成
        String genPath = "E:/Pro/marketing/src/main/webapp" + urlPath.replace("\\", "/");
        File flie = new File(genPath);
        File dir = new File(genPath.replaceAll("(/\\w*.html)", ""));
        if (!flie.exists()) {
            dir.mkdirs();
            flie.createNewFile();
        }
        
        OutputStreamWriter out = new OutputStreamWriter(new FileOutputStream(genPath), "UTF-8");
        try {
            t.process(root, out);
        } catch (TemplateException ex) {
            Logger.getLogger(RequestServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
        out.flush();
        out.close();
    }

    @Override
    public void destroy() {
        super.destroy();
    }
}
