import cognitoConfig from '../../cognito-credentials.json';

//AWS Imports
// import { Config, CognitoIdentityCredentials } from "aws-sdk";
import { CognitoUserPool, CognitoUserAttribute, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";

/**
 * Based on official docs
 * @see https://docs.aws.amazon.com/en_us/cognito/latest/developerguide/using-amazon-cognito-user-identity-pools-javascript-examples.html
 */
export default class Auth {
  constructor(storage, config = cognitoConfig) {
    this.storage = storage;
    this.cognitoConfig = {...config};
  }
  /**
   * Creates new UserPool
   */
  getNewUserPool() {
    return new CognitoUserPool({
      UserPoolId: this.cognitoConfig.UserPoolId,
      ClientId: this.cognitoConfig.ClientId,
      Storage: this.storage
    });
  }

  createUserWithName(username) {
    const userPool = this.getNewUserPool(),
      userData = {
        Username : username,
        Pool : userPool,
        Storage: userPool.storage
      };

    return new CognitoUser(userData);
  }
  logIn(username, password) {
    const authenticationDetails = new AuthenticationDetails({
        Username : username,
        Password : password,
      }),
      me = this,
      cognitoUser = this.createUserWithName(username);

    me.storage.setLoadingState(true);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (session) {
          me.storage.setLoadingState(false);
          me.storage.updatePayload(session.getIdToken().payload);
          resolve({status: 'SUCCESS', cognitoUser, session});
        },

        onFailure: function(err) {
            me.storage.setLoadingState(false);
            reject(err);
        },

        newPasswordRequired: function (userAttributes, requiredAttributes) {
          me.storage.setLoadingState(false);
          resolve({status: 'newPasswordRequired', cognitoUser, userAttributes, requiredAttributes});
        }
      });
    });
  }

  /**
   * SignOut
   */
  logOut(user) {
    return this.getUser(user).then((user) => {
      if (user) {
        user.signOut();
        this.storage.clearPayload();
      }

      return true;
    });
  }

  /**
   * SignUp new User
   * @param {*} username
   * @param {*} password
   * @param {*} attributes
   */
  signUp(username, password, attributes = {}) {
    const userPool = this.getNewUserPool(),
      me = this;
    let attributeList = [];

    for (let key in attributes) {
      attributeList.push(new CognitoUserAttribute({
        Name: key,
        Value: attributes[key]
      }));
    }
    me.storage.setLoadingState(true);

    return new Promise((resolve, reject) => {
      userPool.signUp(username, password, attributeList, null, function(err, result) {
        me.storage.setLoadingState(false);
        if (err) {
            reject(err);
            return;
        }
        resolve(result.user);
      });
    });
  }

  /**
   * Return Active User (not authenticated entity)
   */
  getUser(user) {
    const userPool = this.getNewUserPool();

    if (user) {
      return Promise.resolve(user);
    }

    return new Promise((resolve) => {
      resolve(userPool.getCurrentUser());
    });
  }

  /**
   * Return User Session to check valid/invalid
   */
  getSession(user) {
    const me = this;
    return new Promise((resolve) => {
      this.getUser(user).then((cognitoUser) => {
        if (cognitoUser) {
          const idToken = this.storage.getItem(`CognitoIdentityServiceProvider.${cognitoUser.pool.getClientId()}.${cognitoUser.username}.idToken`);
          cognitoUser.getSession(function(err, session) {
            if (err) {
                resolve({err});
            }

            if (session) {
              if (session.getIdToken().jwtToken != idToken) {
                me.storage.updatePayload(session.getIdToken().payload);
              }
            } else {
              me.storage.clearPayload();
            }

            resolve({err: null, session});
          });
        } else {
          resolve({err: null});
        }
      });
    });
  }
/**
 * Fully authenticated user
 * @param {*} user 
 */
  getAuthUser(user) {
    return new Promise((resolve) => {
      this.getUser(user).then((cognitoUser) => {
        if (cognitoUser) {
          this.getSession(cognitoUser).then(({session}) => {
            if (session && session.isValid()) {
              resolve(cognitoUser);
            } else {
              resolve(null);
            }
          });
        } else {
          resolve(null);
        }
      });
    });
  }
/**
 * Return current user attributes
 * @param {*} user 
 */
  getUserAttributes(user) {
    const me = this;

    me.storage.setLoadingState(true);
    return new Promise((resolve, reject) => {
      this.getAuthUser(user).then((cognitoUser) => {
        cognitoUser.getUserAttributes((err, result) => {
          me.storage.setLoadingState(false);
            const data = {};
            if (err) {
              resolve(data);
            }
            for (var i = 0; i < result.length; i++) {
              if (result[i].getName() === "custom:company_title") {
                data.company_title = result[i].getValue();
              } else {
                data[`${result[i].getName()}`] = result[i].getValue();
              }
            }

            resolve(data);
          }
        );
      });
    });
  }
  /**
   * Update user attributes
   */
  updateAttributes(attributes = {}, user = null) {
    const me = this;

    me.storage.setLoadingState(true);

    return new Promise((resolve, reject) => {
      this.getAuthUser(user).then((cognitoUser) => {
        const attributeList = [];
        let name;

        if (!cognitoUser) {
          me.storage.setLoadingState(false);

          return resolve(false);
        }

        for (let key in attributes) {
          if (attributes.hasOwnProperty(key)) {
            name = (key == 'company_title') ? 'custom:company_title' : key;
            attributeList.push(new CognitoUserAttribute({
              Name: name,
              Value: attributes[key]
            }));
          }
        }
        cognitoUser.updateAttributes(attributeList, (err, result) => {
          me.storage.setLoadingState(false);
          resolve({err, result});
        });
      });
    });
  }

  /**
   * Update password
   */
  passwChange(oldPassword, newPassword, user) {
    const me = this;

    me.storage.setLoadingState(true);

    return new Promise((resolve, reject) => {
      this.getAuthUser(user).then((cognitoUser) => {
        me.storage.setLoadingState(false);
        if (cognitoUser) {
          cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
            resolve({ err, success: !!result });
          });
        } else {
          reject();
        }
      });
    });
  }

  /**
   * Send 'forgot password' request
   * @param {*} user 
   */
  forgotPassword(user) {
    const me = this;

    me.storage.setLoadingState(true);

    return new Promise((resolve, reject) => {
      this.getUser(user).then((cognitoUser) => {
        cognitoUser.forgotPassword({
          onSuccess: (result) => { me.storage.setLoadingState(false); resolve(result); },
          onFailure: (result) => { me.storage.setLoadingState(false); reject(result); }
        });
      });
    });
  }
/**
 * Confirm password
 * @param {*} confirmationCode 
 * @param {*} newPassword 
 * @param {*} user 
 */
  confirmPassword(confirmationCode, newPassword, user) {
    const me = this;

    me.storage.setLoadingState(true);

    return new Promise((resolve, reject) => {
      this.getUser(user).then((cognitoUser) => {
        cognitoUser.confirmPassword(confirmationCode, newPassword, {
          onSuccess: () => { me.storage.setLoadingState(false); resolve()},
          onFailure: (err) => { me.storage.setLoadingState(false); reject(err)},
        });
      });
    });
  }
/**
 * Remove user
 * @param {*} user 
 */
  deleteUser(user) {
    const me = this;

    me.storage.setLoadingState(true);

    return new Promise((resolve, reject) => {
      this.getUser(user).then((cognitoUser) => {
        cognitoUser.deleteUser((err) => {
          me.storage.setLoadingState(false)
          if (err) {
            reject();
          } else {
            resolve();
          }
        });
      });
    });
  }

  /**
   * Is not used at the moment
   * This gets access to AWS services
   * @param {*} cognitoUser
   */
  // setCredentials(cognitoUser) {
  //   return new Promise((resolve) => {
  //     this.getSession(cognitoUser).then((error, session) => {
  //       if (!session) {
  //         resolve(false);
  //         return;
  //       }

  //       Config.credentials.region = this.cognitoConfig.region;
  //       Config.credentials = new CognitoIdentityCredentials({
  //         IdentityPoolId: this.cognitoConfig.IdentityPoolId,
  //         Logins: {
  //           [`cognito-idp.${this.cognitoConfig.region}.amazonaws.com/${this.cognitoConfig.UserPoolId}`]: session.getIdToken().getJwtToken()
  //         }
  //       });

  //       Config.credentials.get(() => resolve());
  //     });
  //   });
  // }
}