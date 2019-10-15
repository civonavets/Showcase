var config = require('../nightwatch.conf.yamba');
var data = require('../data/datalogin.js')
var random = require('../data/randomWord.js')

// Testing if the user is able to register to the Yamba platform

module.exports = {
    '@tags': ['all', 'register', 'login', 'positive'],
    'Yamba platform Register Positive': function(browser) {
        let login = browser.page.login();

        login
            .navigate()
            .waitForElementVisible('@loginButton')
            .assert.title('Login Page')
        browser
            .saveScreenshot(config.imgpath(browser) + 'Register.png')
        login
            .click('@registerButton')
            .waitForElementVisible('@nextButton')
            .expect.element('@nextButton').to.have.css('opacity').which.equals('0.25');
        login
            .assert.title('Register Page')
            .setValue('@registerUsername', random.createRandomWord(10))
            .setValue('@registerName', data.name)
            .setValue('@registerEmail', random.createRandomWord(10)+`@gmail.com`)
            .setValue('@registerPassword', data.password)
            .setValue('@registerRepeatPassword', data.password)
        browser
            .saveScreenshot(config.imgpath(browser) + 'Register.png');
    },
    'Next we fill out the next step in registration process': function(browser){
        let login = browser.page.login();

        login
            .click('@nextButton')
            .waitForElementVisible('@createAccount') 
            .getAttribute('@createAccount', 'disabled', function(result) {this.verify.equal(result.value, 'true');}) 
        login.expect.element('@datePicked').text.to.equals('YYYY/MMM/DD')
        login.expect.element('@registerFemale').to.have.css('fill').which.equals(data.inactivefield)
        login.expect.element('@registerMale').to.have.css('fill').which.equals(data.inactivefield)
        login.expect.element('@registerOther').to.have.css('fill').which.equals(data.inactivefield)
        browser
            .saveScreenshot(config.imgpath(browser) + 'Register.png');
        login
            .click('@registerFemale')
            login.expect.element('@registerFemale').to.have.css('fill').which.equals(data.activefield)
        login
            .click('@registerMale')
            login.expect.element('@registerMale').to.have.css('fill').which.equals(data.activefield)
        login
            .click('@registerOther')
            login.expect.element('@registerOther').to.have.css('fill').which.equals(data.activefield)
        browser
            .saveScreenshot(config.imgpath(browser) + 'Register.png');
        login
            .click('@registerYear')
            .click('@registerMonth')
            .click('@registerDay')
        login.expect.element('@datePicked').text.to.equals('2012/MAR/04')
        browser
            .saveScreenshot(config.imgpath(browser) + 'Register.png');
        login
            .click('@TOC')
        browser.windowHandles(function (result) {
            // 0 == current main window, 1 == new tab
            var handle = result.value[1];
            browser.switchWindow(handle);
        });
        browser
            .assert.title('Terms and Conditions | The Yamba Experience')
            .closeWindow(); 
        browser.windowHandles(function (result) {
            // 0 == current main window, 1 == new tab
            var handle = result.value[0];
            browser.switchWindow(handle);
            });
        login
            .click('@PP')
        browser.windowHandles(function (result) {
            // 0 == current main window, 1 == new tab
            var handle = result.value[1];
            browser.switchWindow(handle);
            });
        browser 
                .assert.title('Privacy Policy | The Yamba Experience')
                .closeWindow(); 
        browser.windowHandles(function (result) {
            // 0 == current main window, 1 == new tab
            var handle = result.value[0];
            browser.switchWindow(handle);
        });
        login
            .getAttribute('@createAccount', 'disabled', function(result) {this.verify.equal(result.value, null);}) 
            .click('@createAccount')
            .waitForElementVisible('@registerAlmostDone')
            .waitForElementVisible('@registerInterests')
        browser
            .saveScreenshot(config.imgpath(browser) + 'Register.png')
        login
            .pause(5000)
            .click('@registerInterests')
            .waitForElementVisible('@interestsPick')
            .assert.title('Interests | The Yamba Experience')
        browser
            .saveScreenshot(config.imgpath(browser) + 'Register.png')
        login
            .getAttribute('@registerSave', 'disabled', function(result) {this.verify.equal(result.value, 'true');}) 
            .click('@interestsPick')
            .getAttribute('@registerSave', 'disabled', function(result) {this.verify.equal(result.value, null);}) 
            .click('@registerSave')
            .waitForElementVisible('@cogButton')
            .assert.title('Feed | The Yamba Experience')
        browser
            .saveScreenshot(config.imgpath(browser) + 'Register.png')
            .end();
    
        }
    }

