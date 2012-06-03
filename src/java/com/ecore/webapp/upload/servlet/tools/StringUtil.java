package com.ecore.webapp.upload.servlet.tools;

public class StringUtil {
	public static final String EMPTY_STRING = "";

	/**
	 * 判断是否“不”为空串（null或空字符串）
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isNotNullEmptyStr(String str) {
		return !StringUtil.isNullOrEmptyStr(str);
	}

	/**
	 * 判断是否为空串（null或空字符串）
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isNullOrEmptyStr(String str) {
		return str == null || StringUtil.EMPTY_STRING.equals(str);
	}

	public static String getLeftString(String s1, String s2) {
		if (StringUtil.isNullOrEmptyStr(s1) || StringUtil.isNullOrEmptyStr(s2)) {
			return s1;
		}

		int p = s1.indexOf(s2);
		if (p == -1) {
			return StringUtil.EMPTY_STRING;
		}

		return s1.substring(0, p);
	}

	public static String getRightString(String s1, String s2) {
		if (StringUtil.isNullOrEmptyStr(s1) || StringUtil.isNullOrEmptyStr(s2)) {
			return s1;
		}

		int p = s1.indexOf(s2);
		int n = s2.length();

		if (p == -1) {
			return StringUtil.EMPTY_STRING;
		}

		return s1.substring(p + n);
	}

	/**
	 * 将null转换为空字符串,如果是非空字符串则返回原字符串
	 * 
	 * @param s
	 * @return
	 */
	public static String null2Empty(String s) {
		if (s == null)
			return "";
		return s;
	}
}
