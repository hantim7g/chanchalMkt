package com.marketing.hst;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.JsonProcessingException;

import jakarta.servlet.http.HttpSession;

@Controller
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
	public ModelAndView home(HttpSession ht) throws JsonProcessingException {
	
		return new ModelAndView("home");
		

	}
	/*
	 * @Override public String getErrorPath() { return "/error"; }
	 */
}
