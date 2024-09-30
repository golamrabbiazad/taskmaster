package io.golamrabbiazad.taskmasterbackend.repository;

import io.golamrabbiazad.taskmasterbackend.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
}
