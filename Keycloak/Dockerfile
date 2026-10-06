FROM quay.io/keycloak/keycloak:26.8.0 AS builder

ENV KC_DB=postgres \
    KC_HEALTH_ENABLED=true \
    KC_METRICS_ENABLED=true

WORKDIR /opt/keycloak
COPY --chown=keycloak:keycloak providers/ /opt/keycloak/providers/
RUN for providerJar in /opt/keycloak/providers/*.jar; do \
    if [ -f "$providerJar" ]; then touch -m --date=@1743465600 "$providerJar"; fi; \
    done && /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:26.8.0

ENV KC_DB=postgres \
    KC_HEALTH_ENABLED=true \
    KC_METRICS_ENABLED=true

COPY --from=builder /opt/keycloak/ /opt/keycloak/
COPY --chown=keycloak:keycloak realm/ /opt/keycloak/data/import/

EXPOSE 8080
ENTRYPOINT ["/bin/bash", "-c"]
CMD ["exec /opt/keycloak/bin/kc.sh start --optimized --http-port=\"${PORT:-8080}\""]