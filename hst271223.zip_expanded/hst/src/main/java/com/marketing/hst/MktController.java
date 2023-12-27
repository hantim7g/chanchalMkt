package com.marketing.hst;

import java.util.ArrayList;
import java.util.Date;
import java.util.Optional;
import java.util.TimeZone;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.tomcat.util.codec.binary.Base64;
import org.hibernate.mapping.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpSession;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Controller
public class MktController {

@Autowired
ProfileDetailsRepository repo;
@Autowired
OrderDetailsRepository orderRepo;
@Autowired
private BrandRepository brandRepository;  // Assuming you have a repository for Brand

@Autowired
private ProductRepository prodRepository;  // Assuming you have a repository for Brand


	@RequestMapping("/home")
	public ModelAndView home(HttpSession ht) throws JsonProcessingException {
//	String login=ht.getAttribute("login").toString();
//		if(login.equalsIgnoreCase("1")) {
//			return	profile(ht);
//			
//		}
		 Date today = new Date();
		
		ModelAndView mv = new ModelAndView("home");
		mv.addObject("productList", prodRepository.findActiveProducts(today));
		return mv;
		

	}
	@RequestMapping("/product")
	public ModelAndView product(HttpSession ht) throws JsonProcessingException {
		Product pdt= new Product();
		pdt.setSeller(ht.getAttribute("userName").toString());
		
		ModelAndView mv= new ModelAndView("product");
		brandRepository.findAll();
		
		mv.addObject("brandList", brandRepository.findAll());
		mv.addObject("mktJson", pdt);
		return mv;
		

	}

	@RequestMapping("/")
	public ModelAndView homeBasic(HttpSession ht) throws JsonProcessingException {
		String login=ht.getAttribute("login").toString();
		if(login.equalsIgnoreCase("1")) {
			return	profile(ht);
			
		}
		return new ModelAndView("login");
		

	}

	@RequestMapping("/howTo")
	public String howTo() {
		//return "test";
		//return "login";
		return "howTo";
	}
//	@RequestMapping("/manageUser")
//	public String manageUser() {
//		//return "test";
//		//return "login";
//		return "manageUser";
//	}
	
	
	@RequestMapping("/navBarTest")
	public String navBarTest() {
		//return "test";
		//return "login";
		return "navBar";
	}
	@RequestMapping("/testNew")
	public String testNew() {
		//return "test";
		//return "login";
		return "test";
//		return "orderForm";
	}
	
	
	@RequestMapping("/login")
	public String login() {
		//return "test";
		//return "login";
		return "login";
	}
	@RequestMapping("/profile")
	public ModelAndView profile(HttpSession ht) throws JsonProcessingException {
		String personProfileId=ht.getAttribute("loginUser").toString();
		String role=ht.getAttribute("userRole").toString();
				
		Optional<ProfileDetails> profileData=repo.findById(Long.parseLong(personProfileId));
		ModelAndView mv =new ModelAndView("profile");
		ProfileDetails pd=profileData.get();
		
		
		String base64PP=Base64.encodeBase64String(pd.getProfilePicture());
				pd.setProfilePicPath(base64PP);
	//	String json=getJsonFromObject(profileData.get());
		mv.addObject("mktJson",profileData.get());
		mv.addObject("role",role);
		
		return mv;
	}
	@RequestMapping("/fetchProfile")
    public ModelAndView fetchProfile(@RequestParam("profileId") String profileId, HttpSession ht) throws JsonProcessingException {
		String userRole=ht.getAttribute("userRole").toString();
		if(!userRole.equalsIgnoreCase("Admin")) {
			profile(ht);
		}
		Optional<ProfileDetails> profileData=repo.findById(Long.parseLong(profileId));
		ModelAndView mv =new ModelAndView("profile");
		ProfileDetails pd=profileData.get();
		
		
		String base64PP=Base64.encodeBase64String(pd.getProfilePicture());
				pd.setProfilePicPath(base64PP);
	//	String json=getJsonFromObject(profileData.get());
		mv.addObject("mktJson",profileData.get());
		mv.addObject("role",userRole);
		return mv;
	}
	
// for admin usermangement
	@RequestMapping("/manageUser")
	public ModelAndView manageUser(HttpSession ht) throws JsonProcessingException {
		String personProfileId=ht.getAttribute("loginUser").toString();
		ArrayList profileData=(ArrayList) repo.findAll();
		ModelAndView mv =new ModelAndView("manageUser");
		
	//	String json=getJsonFromObject(profileData.get());
		mv.addObject("mktJson",profileData);
		return mv;
	}

	@PostMapping("/loginSubmit")

	public @ResponseBody ApiResponse loginSubmit(@RequestBody ProfileDetails profile,HttpSession ht) {
		
		ArrayList<ProfileDetails> result=(ArrayList<ProfileDetails>) repo.findByloginMailAndNewPassword(profile.getLoginMail(),profile.getNewPassword());
     System.out.println(result);
     ApiResponse respo= new ApiResponse();
	if(result!=null && result.get(0).getProfileDtlsId()!=null) {
		respo.setValid(true);
		ht.setAttribute("loginUser",result.get(0).getProfileDtlsId());
		ht.setAttribute("userRole", result.get(0).getRole() );
		ht.setAttribute("userName", result.get(0).getFirstName() );
		ht.setAttribute("login","1" );
	}else {
		respo.setValid(false);
	}
	
	
     return respo;
	}
	
	@PostMapping("/saveUserData")
	public String updateProfile(@RequestBody ProfileDetails profile, HttpSession ht) throws IOException {
		String personProfileId=ht.getAttribute("loginUser").toString();
		String userRole=ht.getAttribute("userRole").toString();
		Optional<ProfileDetails> profileData=null;//repo.findById(Long.parseLong(personProfileId));
		
		if(!userRole.equalsIgnoreCase("Admin")) {
			profileData=repo.findById(Long.parseLong(personProfileId));
			
			profile.setRole(profileData.get().getRole());
			profile.setStatus(profileData.get().getStatus());
			profile.setProfileDtlsId(Long.parseLong(personProfileId));
		}
		if(userRole.equalsIgnoreCase("Admin")) {
			profileData=repo.findById(profile.getProfileDtlsId());
			
			profile.setProfileDtlsId(profile.getProfileDtlsId());
		}
		
		if(profile !=null &&profile.getProfilePicPath()!=null && !profile.getProfilePicPath().isBlank())
		{
		 byte[] imageData = readImageFile(profile.getProfilePicPath().toString());
		 profile.setProfilePicture(imageData);
		}
		else {
			profile.setJoinDate(profileData.get().getJoinDate());
			
			profile.setProfilePicture(profileData.get().getProfilePicture());
		}
		repo.save(profile);
		
		return "login";
	}
	 private byte[] readImageFile(String filePath) throws IOException {
	        Path path = Paths.get(filePath);
	        return Files.readAllBytes(path);
	    }
	 @RequestMapping("/orderForm")
		public String orderForm() {
			//return "test";
			//return "login";
//			return "test";
			return "orderForm";
		}
	 @RequestMapping("/logout")
		public String logout(HttpSession ht) {
		 	ht.setAttribute("loginUser","");
			ht.setAttribute("userRole", "" );
			ht.setAttribute("login","" );
			ht.setAttribute("userName", "" );
			return "login";
		}
	 @RequestMapping("/saveOrder")
	  @ResponseBody
	    public String saveOrder(@RequestBody OrderDetails order) {
		 orderRepo.save(order);
	        return "Order saved successfully!";
	    }
	 
	 
	@RequestMapping("/reg")
	public ModelAndView reg(String s) throws JsonProcessingException {
		System.out.println(s);
		ModelAndView mv = new ModelAndView();
		TestBean t=new TestBean();
		t.setBrother("ram");
		t.setFather("fatre");
		t.setMother("werwe");
		t.setName("werqad");
		getJsonFromObject(t);
		mv.addObject("mktJson", t);
	//		mv.addObject("mktJson", StringEscapeUtils.escapeHtml(getJsonFromObject(t)));
		
		mv.setViewName("navBar");
		return mv;
	}

	@RequestMapping("/test")
	public ModelAndView test(@RequestBody TestBean person) throws JsonProcessingException {
		ModelAndView mv = new ModelAndView();
		TestBean t=new TestBean();
		t.setBrother("ram");
		t.setFather("fatre");
		t.setMother("werwe");
		t.setName("werqad");
		getJsonFromObject(t);
		mv.addObject("mktJson", t);
	//	mv.addObject("mktJson", StringEscapeUtils.escapeHtml(getJsonFromObject(t)));
		
		mv.setViewName("navBar");
		return mv;
	}

	
	@PostMapping("/api/endpoint") // Replace with your actual endpoint
    @ResponseBody
    public String handleJson(@RequestBody TestBean person) {
        // Process the received Person object
        System.out.println("Received Person: " + person.toString());

        // You can perform any logic with the received data here

        // Return a response (you can customize this based on your needs)
        return "Data received successfully!";
    }
	
	public String getJsonFromObject(Object object) throws JsonProcessingException {
		ObjectMapper oM = new ObjectMapper();
		oM.setTimeZone(TimeZone.getDefault());
		return oM.writeValueAsString(object);
	}



	    public static <T> T getJsonToObject(String jsonString, Class<T> valueType) {
	        try {
	            ObjectMapper objectMapper = new ObjectMapper();
	            return objectMapper.readValue(jsonString, valueType);
	        } catch (Exception e) {
	            e.printStackTrace(); // Handle the exception based on your needs
	            return null;
	        }
	    }

	  //Method to handle image upload in your service or controller
	    public String uploadImage(MultipartFile file) {
	     try {
	         String fileName = StringUtils.cleanPath(file.getOriginalFilename());
	         Path path = Paths.get("/path/to/your/directory/" + fileName);
	         Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
	         return fileName;
	     } catch (IOException e) {
	         throw new RuntimeException("Failed to store image", e);
	     }
	    }

}
