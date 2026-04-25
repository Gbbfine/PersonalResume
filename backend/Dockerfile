FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /workspace

COPY maven-settings.xml ./maven-settings.xml
COPY pom.xml ./
RUN mvn -s maven-settings.xml -B -ntp -DskipTests dependency:go-offline

COPY src ./src
RUN mvn -s maven-settings.xml -B -ntp -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /workspace/target/*.jar /app/app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
