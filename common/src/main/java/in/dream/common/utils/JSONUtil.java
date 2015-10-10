package in.dream.common.utils;

import java.text.SimpleDateFormat;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.module.afterburner.AfterburnerModule;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class JSONUtil {
	private static final Logger log = LoggerFactory.getLogger(JSONUtil.class);
	private static final ObjectMapper mapper;
	private static final Gson gson = new Gson();
	private static final Gson prettyGson = new GsonBuilder().setPrettyPrinting().create();
	
	static{
		mapper = new ObjectMapper();
		mapper.registerModule(new AfterburnerModule());
		mapper.setDateFormat(new SimpleDateFormat("yyyy MM dd HH:mm:ss"));
	}
	public static <T> T getObjectUsingGson(String content, Class<T> c) throws Exception{
		return gson.fromJson(content, c);
	}
	public static <T> T getObject(String content, Class<T> c) throws Exception{
		return mapper.readValue(content, c);
	}
	public static <T, O> T getObject(String content, TypeReference<O> typeRef) throws Exception{
		return mapper.readValue(content, typeRef);
	}
	
	public static <T> String writeFullPretty(T object){
		try {
			return prettyGson.toJson(object);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
		return null;
	}
	
	public static <T> String writeFull(T object){
		try {
			return gson.toJson(object);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
		return null;
	}
	/*
	public static <T> String writeFull(T object){
		try {
			return mapper.writeValueAsString(object);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
		return null;
	}
	*/
	public static <T> String write(T object){
		try {
			return mapper.writeValueAsString(object);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}
		return null;
	}
	
	public static <T> String render(T object){
		return write(object);
	}
}
