# Multi-stage build for Spring Boot on Render
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

# Copy Maven wrapper and project files
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# Build the application (skip tests for faster container builds)
# Make mvnw executable and run it
RUN chmod +x ./mvnw && ./mvnw -DskipTests clean package

# Runtime image
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Render injects PORT; Spring Boot reads server.port=${PORT:8080}
ENV PORT=8080
EXPOSE 8080

# Start the application
CMD ["java","-jar","app.jar"]
