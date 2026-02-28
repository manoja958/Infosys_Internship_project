package com.example.demo.repository;

import com.example.demo.entity.UserRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRequestRepository extends JpaRepository<UserRequest, Long> {

    List<UserRequest> findByStatus(String status);
}