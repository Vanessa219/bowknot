package com.ecore.webapp;

/**
 * Table
 *
 * @author Liyuan Li
 * @version 1.0.0.1, 2011-03-05
 */
public class BaseTabs {

    private class Tab {

        private String text;
        private int altCount;
        private String content;
        private String alt;
        private String url;
        private String id;
        private boolean isClose;
        private boolean isRefresh;

        public Tab() {
        }

        public String getAlt() {
            return alt;
        }

        public void setAlt(String alt) {
            this.alt = alt;
        }

        public int getAltCount() {
            return altCount;
        }

        public void setAltCount(int altCount) {
            this.altCount = altCount;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public boolean isIsClose() {
            return isClose;
        }

        public void setIsClose(boolean isClose) {
            this.isClose = isClose;
        }

        public boolean isIsRefresh() {
            return isRefresh;
        }

        public void setIsRefresh(boolean isRefresh) {
            this.isRefresh = isRefresh;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }
    private String id;
    private String theme;
    private boolean closeSyn;
    private int size;
    private int height;
    private Tab tab;

    public boolean isCloseSyn() {
        return closeSyn;
    }

    public void setCloseSyn(boolean closeSyn) {
        this.closeSyn = closeSyn;
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

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }
}
