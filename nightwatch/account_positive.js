var config = require('../nightwatch.conf.yamba');
var accountdata = require('../data/dataaccount.js')
var login = require('../web/login_positive.js')
require('dotenv').config()  
var assert = require('assert') 

// Testing if the user is able to preform a search on the Yamba Platform

module.exports = {
    '@tags': ['all','account', 'positive'],
    'Yamba platform Account Positive Test': function(browser) {
        let login = browser.page.login();
        let account = browser.page.account();

        login
            .navigate()
            .waitForElementVisible('@loginButton')
            .assert.title('Login Page')
        account.assert.visible('@facebookButton', accountdata.loginFacebookButtonMessage)
        account.assert.visible('@googleButton', accountdata.loginGoogleButtonMessage)
            .getLocationInView('@googleAppButton')
        account.assert.visible('@googleAppButton')
        account.assert.visible('@iosAppButton')
    },
  // NOTE: Remove "!" if runin non-headless
  // TODO: Find a workaround
    'Check links and pages to mobile applications': !function(browser) {
        let login = browser.page.login();
        let account = browser.page.account();
        account
         // TODO: Reasearch a way around google redirect in headless mode
            .click('@googleAppButton')
                browser.windowHandles(function (result) {
                // 0 == current main window, 1 == new tab
                var handle = result.value[1];
                browser.switchWindow(handle);
            });
        account.api.elements('@googlePageElement', function(result){
                if (result.value && result.value.ELEMENT) {
                    // Element is present, do the appropriate tests
                    browser.assert.urlContains(accountdata.googleAppPageURL)
                    account.verify.containsText('@googlePageElement', accountdata.googleAppPageMessage)
                    browser
                        .saveScreenshot(config.imgpath(browser) + 'Account.png')
                        browser.windowHandles(function (result) {
                            // 0 == current main window, 1 == new tab
                            var handle = result.value[0];
                            browser.switchWindow(handle);
                            
                        });
                } else {
                    // Element is not present
                    browser.assert.urlContains(accountdata.googleAppPageURL)
                    account.assert.visible('@googleNext', accountdata.loginGoogleButtonMessage)
                    browser
                        .saveScreenshot(config.imgpath(browser) + 'Account.png')
                        browser.windowHandles(function (result) {
                            // 0 == current main window, 1 == new tab
                            var handle = result.value[0];
                            browser.switchWindow(handle);
                        });
                    }
                });
        login
            .waitForElementVisible('@loginButton')
            .assert.title('Login Page')
        account
            .getLocationInView('@iosAppButton')
            .click('@iosAppButton')
                browser.windowHandles(function (result) {
                // 0 == current main window, 1 == new tab
                var handle = result.value[2];
                browser.switchWindow(handle);
            });
            browser.assert.urlContains(accountdata.iosAppPageURL)
            account.waitForElementVisible('@iosAppPageElement', accountdata.iosAppPageMessage)
            browser.windowHandles(function (result) {
                // 0 == current main window, 1 == new tab
                var handle = result.value[0];
                browser.switchWindow(handle);
            });
        browser
            .saveScreenshot(config.imgpath(browser) + 'Account.png')
            .end()
    },
    'Attempt to perform a login via Facebook' : function(browser){
        this["Yamba platform Account Positive Test"](browser)
        let account = browser.page.account();
        
        account
            .click('@facebookButton')
            browser.windowHandles(function (result) {
                // 0 == current main window, 1 == new tab
                var handle = result.value[1];
                browser.switchWindow(handle);
            });
        account
            .waitForElementVisible('@facebookLogin', 5000, accountdata.logingFacebookWindowMessage)
        browser
            .saveScreenshot(config.imgpath(browser) + 'Account.png')
        account
            .setValue('@facebookUser', process.env.FACEBOOK_USER)
            .setValue('@facebookPassword', process.env.FACEBOOK_PASS)
            .click('@facebookLogin')
            // NOTE: chromedriver@74.0.0 issue with the headless mode
            // .waitForElementNotPresent('@facebookButton', 5000, accountdata.closedWindow)
        
        browser.windowHandles(function (result) {
            // 0 == current main window, 1 == new tab
            var handle = result.value[0];
            browser.switchWindow(handle);
        });
        account
             //NOTE: chromedriver@74.0.0 issue with the headless mode
             .waitForElementNotPresent('@facebookButton', 5000, accountdata.closedWindow)
        account        
            .waitForElementVisible('@existingModal')
            .verify.containsText('@existingModal', accountdata.successfulFacebookLoginExisting)
            .waitForElementNotPresent('@existingModal')
        browser
            .saveScreenshot(config.imgpath(browser) + 'Account.png')
            login["We attempt Logout"](browser)
    },
    'Attempt to perform a login via Google' : !function(browser){
        // NOTE: Remove "!" when the OAuth with Google is fixed
        this["Yamba platform Account Positive Test"](browser)
        let account = browser.page.account();
        account
            .click('@googleButton')
            browser.windowHandles(function (result) {
                // 0 == current main window, 1 == new tab
                var handle = result.value[1];
                browser.switchWindow(handle);
            });
        account
            .waitForElementVisible('@googleNext', 5000, accountdata.loginGoogleWindowMessage)
        browser
            .saveScreenshot(config.imgpath(browser) + 'Account.png')
        account
            .waitForElementVisible('@googleNext', 5000, )
            .setValue('@googleUser', process.env.GOOGLE_USER)
            .click('@googleNext')
            .waitForElementVisible('@googleLogin')
            .pause(3000)
            .setValue('@googlePassword', process.env.GOOGLE_PASS)    
            .click('@googleLogin')
            .waitForElementNotPresent('@googleLogin', 5000, accountdata.closedWindow)
        browser.windowHandles(function (result) {
            // 0 == current main window, 1 == new tab
            var handle = result.value[0];
            browser.switchWindow(handle);
        });
        account        
            .waitForElementVisible('@existingModal')
            .verify.containsText('@existingModal', accountdata.successfulGoogleLoginExisting)
            .waitForElementNotPresent('@existingModal')
        browser
            .saveScreenshot(config.imgpath(browser) + 'Account.png')
            login["We attempt Logout"](browser)

        }  
    } 

