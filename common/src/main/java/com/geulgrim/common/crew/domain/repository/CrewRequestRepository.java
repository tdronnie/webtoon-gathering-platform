package com.geulgrim.common.crew.domain.repository;

import com.geulgrim.common.crew.domain.entity.CrewRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CrewRequestRepository extends JpaRepository<CrewRequest, Long> {


    List<CrewRequest> findByCrew_CrewId(Long crewId);


    @Query("SELECT cr FROM CrewRequest cr WHERE cr.user.userId = :userId AND cr.crew.crewId = :crewId")
    CrewRequest findByUserIdAndCrewId(Long userId, Long crewId);
}