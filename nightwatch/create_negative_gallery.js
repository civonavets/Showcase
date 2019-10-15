var config = require('../nightwatch.conf.yamba');
var data = require('../data/datalogin.js')
var info = require('../data/datacreate.js')
var picture = require('../data/pictures.js')
var random = require('../data/randomWord.js')

// Testing if the user is able to create a post on the Yamba platform

module.exports = {
    '@tags': ['all','create', 'negative'], 
    'Yamba platform Gallery Post Negative': function(browser) {
        let login = browser.page.login();
        var create = browser.page.create();

        login
            .navigate()
            .waitForElementVisible('@loginButton')
            .assert.title('Login Page')
            .setValue('@username', data.email)
            .setValue('@password', data.password)
            .click('@loginButton')
        browser
            .saveScreenshot(config.imgpath(browser) + 'Create.png');
        login
            .waitForElementVisible('@cogButton')
        browser
            .saveScreenshot(config.imgpath(browser) + 'Create.png')
        login
            .assert.title('Feed | The Yamba Experience')
        create
            .waitForElementVisible('@create')
            .click('@create')
            // .waitForElementVisible('@upload')
        browser
                .setValue('input[id="createPostGallery"]', picture.seven, function(result){
                  if(result.status !== 0){
                    console.log(result);
                 }
              });
        create
            .waitForElementVisible('@sevenError')
            .assert.containsText('@sevenError', info.seven) 
            // .verify.visible('@upload')
            .setValue('@title', random.randomSpecial(20))
            .setValue('@text', random.randomSpecial(20))
            .setValue('@hashtag', random.randomSpecial(20))
            browser.keys(browser.Keys.TAB)
            // Alpha Dash format Alert Box
            // NOTE: Bother the DEV team to fix this :D
            .acceptAlert()
            .saveScreenshot(config.imgpath(browser) + 'Create.png')
        create
            .getAttribute('@postButton', 'disabled', function(result) {
                this.verify.equal(result.value, 'true');
            })
        browser
            .saveScreenshot(config.imgpath(browser) + 'Create.png')
            .end();
    }
}