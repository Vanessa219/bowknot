package com.ecore.webapp;

import net.sf.json.JSONArray;

/**
 * Tabs
 *
 * @author Liyuan Li
 * @version 1.0.0.1, 2011-03-05
 */
public class BaseTable {

    private class ColModel {

        private String text;
        private String style;
        private String index;
        private int width;
        private int minWidth;
        private String textAlign;
        private String type;

        public ColModel() {
        }

        public String getIndex() {
            return index;
        }

        public void setIndex(String index) {
            this.index = index;
        }

        public int getMinWidth() {
            return minWidth;
        }

        public void setMinWidth(int minWidth) {
            this.minWidth = minWidth;
        }

        public String getStyle() {
            return style;
        }

        public void setStyle(String style) {
            this.style = style;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }

        public String getTextAlign() {
            return textAlign;
        }

        public void setTextAlign(String textAlign) {
            this.textAlign = textAlign;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public int getWidth() {
            return width;
        }

        public void setWidth(int width) {
            this.width = width;
        }
    }

    private class TableData {

        private String groupName;
        /**
         * Table ���
         *
         * e.g: [{key: value}, ...]
         */
        private JSONArray groupData;

        public TableData() {
        }

        public JSONArray getGroupData() {
            return groupData;
        }

        public void setGroupData(JSONArray groupData) {
            this.groupData = groupData;
        }

        public String getGroupName() {
            return groupName;
        }

        public void setGroupName(String groupName) {
            this.groupName = groupName;
        }
    }
    private String id;
    private String theme;
    private int height;
    /**
     * �û��Զ��帽������
     * 
     * e.g: [{key: value}, ...]
     */
    private JSONArray attributes;
    private boolean isExpend;
    private TableData data;
    private ColModel colModel;

    public JSONArray getAttributes() {
        return attributes;
    }

    public void setAttributes(JSONArray attributes) {
        this.attributes = attributes;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public boolean isIsExpend() {
        return isExpend;
    }

    public void setIsExpend(boolean isExpend) {
        this.isExpend = isExpend;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }
}
