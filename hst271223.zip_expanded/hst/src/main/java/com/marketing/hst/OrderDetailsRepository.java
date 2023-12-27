package com.marketing.hst;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderDetailsRepository extends JpaRepository<OrderDetails, Long> {
	
//	 List<ProfileDetails> findByloginMailAndNewPassword(String loginMail, String newPassword);

}
