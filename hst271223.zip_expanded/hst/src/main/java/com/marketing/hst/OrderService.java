package com.marketing.hst;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class OrderService {

    private final OrderDetailsRepository orderDetailsRepository;

    @Autowired
    public OrderService(OrderDetailsRepository orderDetailsRepository) {
        this.orderDetailsRepository = orderDetailsRepository;
    }

    public void saveProfileDetails(OrderDetails orderDetails) {
    	orderDetailsRepository.save(orderDetails);
    }
//    public List<ProfileDetails> findByloginMailAndNewPassword(ProfileDetails profileDetails) {
//    List<ProfileDetails>  pD=  profileDetailsRepository.findByloginMailAndNewPassword(profileDetails.getLoginMail(),profileDetails.getNewPassword());
//    
//    return pD;
//    }
    


}
