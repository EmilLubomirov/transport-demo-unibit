package com.logistics.transport.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String TELEMETRY_EXCHANGE      = "telemetry.exchange";
    public static final String COORDINATES_QUEUE       = "telemetry.coordinates.queue";
    public static final String SENSORS_QUEUE           = "telemetry.sensors.queue";
    public static final String COORDINATES_ROUTING_KEY = "telemetry.coordinates.#";
    public static final String SENSORS_ROUTING_KEY     = "telemetry.sensors.#";

    // Spring AMQP automatically declares these in RabbitMQ on startup if they don't exist
    @Bean
    public TopicExchange telemetryExchange() {
        return new TopicExchange(TELEMETRY_EXCHANGE, true, false);
    }

    @Bean
    public Queue coordinatesQueue() {
        return QueueBuilder.durable(COORDINATES_QUEUE).build();
    }

    @Bean
    public Queue sensorsQueue() {
        return QueueBuilder.durable(SENSORS_QUEUE).build();
    }

    @Bean
    public Binding coordinatesBinding(Queue coordinatesQueue, TopicExchange telemetryExchange) {
        return BindingBuilder.bind(coordinatesQueue)
                .to(telemetryExchange)
                .with(COORDINATES_ROUTING_KEY);
    }

    @Bean
    public Binding sensorsBinding(Queue sensorsQueue, TopicExchange telemetryExchange) {
        return BindingBuilder.bind(sensorsQueue)
                .to(telemetryExchange)
                .with(SENSORS_ROUTING_KEY);
    }

    @Bean
    public MessageConverter messageConverter(ObjectMapper objectMapper) {
        return new Jackson2JsonMessageConverter(objectMapper);
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory,
                                          MessageConverter messageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter);
        return template;
    }
}
