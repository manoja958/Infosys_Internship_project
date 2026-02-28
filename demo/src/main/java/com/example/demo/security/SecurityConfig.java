//package com.example.demo.security;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//public class SecurityConfig {
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//
//        http
//                .csrf(csrf -> csrf.disable())
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/auth/**").permitAll()
//                        .anyRequest().authenticated()
//                );
//
//        return http.build();
//    }
//}
//
//
//package com.example.demo.security;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//import org.springframework.beans.factory.annotation.Autowired;
//
//@Configuration
//public class SecurityConfig {
//
//    @Autowired
//    private JWTFilter jwtFilter;
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//
//        http
//                .csrf(csrf -> csrf.disable())
//                .cors(cors -> {})
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/auth/**").permitAll()
//                                        .requestMatchers("/auth/**").permitAll()
//                                        .requestMatchers("/admin/**").hasRole("ADMIN")
//                                .requestMatchers("/product/**").authenticated()
//
////                                .requestMatchers("/auth/admin-signup").permitAll()
////                                .requestMatchers("/auth/login").permitAll()
////                                .requestMatchers("/auth/**").permitAll()
////                                .requestMatchers("/admin/**").hasRole("ADMIN")
////                                .requestMatchers("/admin/**").hasRole("ADMIN")
//////                        .requestMatchers("/admin/**").hasAuthority("ADMIN")
//                     //   .requestMatchers("/user/**").hasAnyAuthority("USER", "ADMIN")
//                        .anyRequest().authenticated()
//                )
//                .formLogin(form -> form.disable())   // 🔥 disable default login
//                .httpBasic(basic -> basic.disable()) // 🔥 disable basic auth
//                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }
//}


package com.example.demo.security;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;
import org.springframework.beans.factory.annotation.Autowired;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @Autowired
    private JWTFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .authorizeHttpRequests(auth -> {
                            auth
                                    .requestMatchers("/auth/**").permitAll()
                                    .requestMatchers("/auth/login").permitAll()
                                    .requestMatchers("/auth/request").permitAll()
                                    .requestMatchers("/auth/forgot").permitAll()
                                    .requestMatchers("/auth/reset").permitAll()
                                    // .requestMatchers("/auth/change-password").permitAll()
                                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                                    // ADMIN endpoints
                                    .requestMatchers("/admin/**").hasRole("ADMIN")
                                    // .requestMatchers("/admin/**").permitAll()
                                    .requestMatchers("/product/add").hasRole("ADMIN")
                                    .requestMatchers("/product/update/**").hasRole("ADMIN")
                                    .requestMatchers("/product/delete/**").hasRole("ADMIN")
                                    .requestMatchers("/product/stock-in").hasRole("ADMIN")
                                    .requestMatchers("/product/stock-out").hasRole("ADMIN")

                                    .requestMatchers("/product/pending-requests").hasRole("ADMIN")
                                    .requestMatchers("/product/approve-stock/**").hasRole("ADMIN")
                                    .requestMatchers("/product/reject-stock/**").hasRole("ADMIN")

                                    // USER endpoints
                                    .requestMatchers("/product/request-stock").hasRole("USER")
                                    .requestMatchers("/product/my-requests").hasRole("USER")
                                    // Shared
                                    .requestMatchers("/product/all").authenticated()
                                    .requestMatchers("/product/low-stock").hasRole("ADMIN")

                                    .anyRequest().authenticated();
                        }
                )
//
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/auth/**").permitAll()
//                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//                        .requestMatchers("/admin/**").hasRole("ADMIN")
//                        //.requestMatchers("/admin/delete-user").hasRole("ADMIN")
//
//                        .requestMatchers("/product/add").hasRole("ADMIN")
//                        .requestMatchers("/product/update/**").hasRole("ADMIN")
//                        .requestMatchers("/product/delete/**").hasRole("ADMIN")
//                        .requestMatchers("/product/stock-in").hasRole("ADMIN")
//                        .requestMatchers("/product/stock-out").hasRole("ADMIN")
//
//                        .requestMatchers("/product/all").authenticated()
//                        .requestMatchers("/product/low-stock").authenticated()
//                        .requestMatchers("/product/all").authenticated()
//                        .anyRequest().authenticated()
               // )
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}


//package com.example.demo.security;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//import org.springframework.beans.factory.annotation.Autowired;
//
//@Configuration
//public class SecurityConfig {
//
//    @Autowired
//    private JWTFilter jwtFilter;
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//
//        http
//                .cors(cors -> {})   // ✅ correct for Spring Boot 3
//                .csrf(csrf -> csrf.disable())
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/auth/**").permitAll()
//                        .requestMatchers("/admin/**").hasAuthority("ADMIN")
//                        .requestMatchers("/user/**").hasAnyAuthority("USER", "ADMIN")
//                        .anyRequest().authenticated()
//                )
//                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }
//
//}
//
