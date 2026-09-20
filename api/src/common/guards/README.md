# Guards

Add the global JWT guard here when authentication is introduced. Register it as
an `APP_GUARD` so protected endpoints are the default, and use the provided
`@Public()` decorator for login, registration, refresh, and health endpoints.
