import jwt from 'jsonwebtoken';

export default {
  getToken() {
    var timestamp = Date.now() / 1000 - 30;
    var expiration = timestamp + 60 * 1440;

    var token = jwt.sign(
      {
        system: "CUSTOMER_PORTAL",
        iat: timestamp,
        exp: expiration
      },
      "qpalzmXNSKWOeidjcnvbfhRU",
      {
        // expiresIn: "1h"
      }
    );

    return token;
  },
  getUserToken() {
    var timestamp = Date.now() / 1000 - 30;
    var expiration = timestamp + 60 * 1440;

    var token = jwt.sign(
      {
        system: "CUSTOMER_PORTAL",
        user: "af2e487e-729e-4ec6-a1b5-1caec490e1f9",
        iat: timestamp,
        exp: expiration
      },
      "qpalzmXNSKWOeidjcnvbfhRU",
      {
        //expiresIn: "24h"
      }
    );

    return token;
  }
};
