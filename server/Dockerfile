FROM maven:3.8.5-openjdk-17

WORKDIR /server

COPY . ./

RUN mvn clean install -DskipTests

COPY . ./

CMD mvn spring-boot:run
