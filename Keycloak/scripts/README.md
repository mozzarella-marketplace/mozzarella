# Keycloak scripts

No provisioning or deployment scripts are implemented yet. Use the Docker Compose commands in [the infrastructure README](../README.md).

Future reviewed scripts may support realm configuration or provider maintenance. They must read credentials from the environment, never log secrets or student information, and never export users or commit generated client secrets. Existing realms require an explicit update procedure; startup import is not a migration mechanism.