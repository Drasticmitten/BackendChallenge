import 'dotenv/config';

import { get } from 'env-var';

export const envs = {
    PORT                : get('PORT').required().asPortNumber(),
    DATABASE_URL        : get('DATABASE_URL').required().asString(),
    DATABASE_NAME       : get('DATABASE_NAME').required().asString(),
    USER_DATABASE       : get('USER_DATABASE').required().asString(),
    DATABASE_PASSWORD   : get('DATABASE_PASSWORD').required().asString(),
    JWT_SEED            : get('JWT_SEED').required().asString(),
    SEND_EMAIL          : get('SEND_EMAIL').default('false').asBool(),
    MAILER_SERVICE      : get('MAILER_SERVICE').required().asString(),
    MAILER_EMAIL        : get('MAILER_EMAIL').required().asString(),
    MAILER_SECRET_KEY   : get('MAILER_SECRET_KEY').required().asString(),
    WEBSERVICE_URL      : get('WEBSERVICE_URL').required().asString(),
};