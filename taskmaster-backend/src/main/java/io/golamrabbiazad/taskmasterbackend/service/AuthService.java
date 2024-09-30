package io.golamrabbiazad.taskmasterbackend.service;

import io.golamrabbiazad.taskmasterbackend.controller.AuthenticationRequest;
import io.golamrabbiazad.taskmasterbackend.controller.AuthenticationResponse;
import io.golamrabbiazad.taskmasterbackend.controller.RegisterRequest;
import io.golamrabbiazad.taskmasterbackend.entity.User;
import io.golamrabbiazad.taskmasterbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        userRepository.save(user);
        var  jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse
                .builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse login(AuthenticationRequest request) {
       authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

       var user = userRepository.findByEmail(request.getEmail()).orElseThrow();
       var jwtToken = jwtService.generateToken(user);

       return AuthenticationResponse
               .builder()
               .token(jwtToken)
               .build();
    }
}
