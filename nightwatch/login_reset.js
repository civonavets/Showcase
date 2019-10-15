var config = require('../nightwatch.conf.yamba');
var data = require('../data/datalogin.js')

// Testing if the user is able to register to the Yamba platform

module.exports = {
    '@tags': ['all', 'login', 'positive'], 
    'Yamba platform Forgot Password Positive': function(browser) {
            let login = browser.page.login();

            login
                .navigate()
                .waitForElementVisible('@loginButton')
                .assert.title('Login Page')
                .click('@forgotPassword')          
            browser
                .saveScreenshot(config.imgpath(browser) + 'Login.png')
            login
                .waitForElementVisible('@forgotEmail')
                .assert.title('Forgot password Page')
            login
                .getAttribute('@forgotButton', 'disabled', function(result) {this.verify.equal(result.value, 'true');}) 
                .clearValue('@forgotEmail')
                .setValue('@forgotEmail', data.email)
                .getAttribute('@forgotButton', 'disabled', function(result) {this.verify.equal(result.value, null);}) 
                .click('@forgotButton')
                .waitForElementVisible('@modalWindow')
                .verify.containsText('@modalWindow', data.resetmessage)
                .waitForElementNotPresent('@modalWindow')
                .verify.elementNotPresent("@modalWindow")
                .waitForElementVisible('@loginButton')
                .assert.title('Login Page')
            browser
                .saveScreenshot(config.imgpath(browser) + 'Login.png')
                .end();
        }
    }

