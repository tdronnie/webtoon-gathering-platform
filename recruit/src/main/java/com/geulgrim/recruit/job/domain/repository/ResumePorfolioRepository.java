package com.geulgrim.recruit.job.domain.repository;

import com.geulgrim.recruit.job.domain.entity.PositionJob;
import com.geulgrim.recruit.job.domain.entity.Resume;
import com.geulgrim.recruit.job.domain.entity.ResumePortfolio;
import com.geulgrim.recruit.job.domain.entity.ResumePosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumePorfolioRepository extends JpaRepository<ResumePortfolio, Long>{
}