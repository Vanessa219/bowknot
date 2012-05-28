package com.ecore.webapp.upload.tools;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.text.DecimalFormat;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.multipart.FilePart;
import org.apache.commons.httpclient.methods.multipart.MultipartRequestEntity;
import org.apache.commons.httpclient.methods.multipart.Part;
import org.apache.commons.httpclient.methods.multipart.StringPart;


@SuppressWarnings("deprecation")
public class MiscUtil {
	public static String conventHtmlCode(String str) {
		if (str == null)
			return "";
		str = str.replaceAll("\"", "&quot;");
		return str;
	}

	public static boolean isNumber(String str) {
		boolean isNumber = true;
		char[] ch = str.toCharArray();
		for (int i = 0; i < ch.length; i++) {
			isNumber = Character.isDigit(ch[i]);
			if (isNumber) {
				return true;
			}
		}
		return false;
	}

	public static String customFormat(String pattern, double value) {
		DecimalFormat formatter = new DecimalFormat(pattern);
		String output = formatter.format(value);
		return output;
	}

	public static boolean isDouble(String value) {
		if (StringUtil.isNullOrEmptyStr(value))
			return false;

		try {
			Double.parseDouble(value);
			return true;
		} catch (NumberFormatException e) {
			return false;
		}
	}

	/**
	 * 复制单个文件
	 * 
	 * @param srcFilePathAndName
	 *            待复制的文件路径和文件名
	 * @param descFileName
	 *            目标文件路径和文件名
	 * @param uploadDir
	 * 			  目标服务器的文件上传目录
	 * @param ulUri
	 *            目标服务器的文件上传Action
	 * @param orgCode
	 *            当前人员所在的公司编码，用以获取下载路径
	 * @return 如果复制成功返回true，否则返回false
	 * @throws IOException
	 */
	public static boolean copyFile(String srcFilePathAndName, String destFileName, String uploadDir, String ulUri) throws IOException {
		boolean srcURL = srcFilePathAndName.startsWith("http://"); // 源文件地址是否是网络路径,true=是,false=否
		boolean destURL = destFileName.startsWith("http://"); // 目标文件地址是否是网络路径,true=是,false=否

		InputStream in = null;

		try {
			if (srcURL) { // 如果源文件是网络路径，则输入流使用url获得的输入流
				URL url = new URL(srcFilePathAndName);
				in = url.openStream();
			} else { // 源文件是本地文件，直接读取
				File srcFile = new File(srcFilePathAndName);
				in = new FileInputStream(srcFile);
			}
		} catch (IOException e) {
			if (in != null) {
				in.close();
				in = null;
			}
			throw new FileNotFoundException("复制文件失败，源文件：" + srcFilePathAndName + "不存在！");
		}

		if (!destURL) { // 目标文件是本地路径
			try {
				createFile(srcFilePathAndName, in, destFileName, false);
			} catch (Exception e) {
				throw new IOException("复制文件至：" + destFileName + " 失败");
			} finally {
				if (in != null) {
					in.close();
					in = null;
				}
			}
		} else { // 目标文件是网络路径，调用文件服务器上传方法进行上传
			try {
				String tempFile = srcFilePathAndName;
				if (srcURL) { // 源文件也是网络路径，需要先下载保存至临时路径
					tempFile = createTempFile(srcFilePathAndName, in, true);
				}
				
				String fileid = destFileName.substring(destFileName.lastIndexOf("/") + 1);
				File srcFile = new File(tempFile);

				//String ulUri = confUploadPath.substring(0, confUploadPath.lastIndexOf("/upload")) + "/uploadFile"; // 例如：http://oa.test.com/oaweb/uploadFile
				PostMethod post = new PostMethod(ulUri);
				Part[] parts = { 
									new StringPart("ID", fileid), 
									new StringPart("UPLOADDIR", uploadDir),
									new StringPart("folder", uploadDir), 
									new FilePart("FILE", srcFile),
								};
				post.setRequestEntity(new MultipartRequestEntity(parts, post.getParams()));
				HttpClient client = new HttpClient();
				client.getHttpConnectionManager().getParams().setConnectionTimeout(8000);
				int status = client.executeMethod(post);
				post.releaseConnection();

				if (srcURL) {
					// 如果源文件是网络路径，删除临时文件
					srcFile.delete();
				}

				if (status != HttpStatus.SC_OK)
					return false;
			} catch (Exception e) {
				System.out.println("上传文件至：" + destFileName + " 失败");
				throw new IOException("上传文件至：" + destFileName + " 失败");
			} finally {
				if (in != null) {
					in.close();
					in = null;
				}
			}
		}

		if (in != null) {
			in.close();
			in = null;
		}

		return true;
	}

	public static boolean createFile(String srcFileName, InputStream in, String destFileName, boolean overlay) throws Exception {
		OutputStream out = null; // 判断目标文件是否存在
		File destFile = new File(destFileName);

		if (destFile.exists()) {
			if (overlay) { // 如果目标文件存在并允许覆盖
				System.out.println("目标文件已存在，准备删除。。。。");
				if (!destFile.delete()) { // 删除已经存在的目标文件，无论目标文件是目录还是单个文件
					System.out.println("复制文件失败：删除目标文件" + destFileName + "失败！");
					return false;
				}
			} else {
				System.out.println("复制文件失败：目标文件" + destFileName + "已存在！");
				return false;
			}
		} else {
			// 如果目标文件所在目录不存在，则创建目录
			if (!destFile.getParentFile().exists()) {
				System.out.println("目标文件所在目录不存在，准备创建。。。");
				if (!destFile.getParentFile().mkdirs()) {
					System.out.println("复制文件失败：创建目标文件所在目录失败！");
					return false;
				}
			}
		}

		// 复制文件
		int byteread = 0; // 读取的字节数
		try {
			out = new FileOutputStream(destFile);
			byte[] buffer = new byte[1024];

			while ((byteread = in.read(buffer)) != -1) {
				out.write(buffer, 0, byteread);
			}
			System.out.println("复制单个文件" + srcFileName + "至" + destFileName + "成功！");
		} finally {
			try {
				if (out != null)
					out.close();
				if (in != null)
					in.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return true;
	}

	/**
	 * 创建临时文件
	 * 
	 * @param srcFile
	 *            源文件文件名
	 * @param in
	 *            源文件输入流
	 * @param overlay
	 *            是否覆盖
	 * @return 临时文件文件全路径
	 * @throws Exception
	 */
	public static String createTempFile(String srcFile, InputStream in, boolean overlay) throws Exception {
		RandomGUID myGUID = new RandomGUID();
		String tempPath = "C:/oatemp/" + myGUID.valueAfterMD5 + ".tmp";
		File destFile = new File(tempPath);
		if (!destFile.getParentFile().exists()) {
			if (!destFile.getParentFile().mkdirs()) {
				System.out.println("创建临时文件失败：创建目标文件所在目录失败！");
			}
		}
		if (createFile(srcFile, in, tempPath, true))
			return tempPath;
		else
			return null;
	}

	/**
	 * 删除文件或目录
	 */
	public static boolean deleteFileOrFolder(String diskPath) {
		if (StringUtil.isNotNullEmptyStr(diskPath)) {
			File f = new File(diskPath);
			if (f.isFile()) {
				return f.delete();
			} else if (f.isDirectory()) {
				File[] fList = f.listFiles();
				for (File tmp : fList) {
					if (tmp.isFile())
						tmp.delete();
					else if (tmp.isDirectory()) {
						deleteFileOrFolder(tmp.getAbsolutePath());
					}
				}
				return f.delete();
			}
		}
		return false;
	}
}
