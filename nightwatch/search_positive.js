var config = require('../nightwatch.conf.yamba');
var searchdata = require('../data/datasearch.js')
var login = require('../web/login_positive.js')

// Testing if the user is able to preform a search on the Yamba Platform
/* 
    xOffset - Offset from the top-left corner. A negative value means coordinates left from the element.
    yOffset - Offset from the top-left corner. A negative value means coordinates above the element.
*/

module.exports = {
    '@tags': ['all','search', 'positive'],
    'Yamba platform Search Positive Test': function(browser) {
        let search = browser.page.search();
        login['Yamba platform login positive attempt'](browser)
        
        search
            .isVisible('@searchNav')
            .click('@searchNav')
            .waitForElementVisible('@cancelSearch')
            .isVisible('@searchBar')
        browser
            .saveScreenshot(config.imgpath(browser) + 'Search.png')
    },
    'Attempting clicking on the search filter buttons' : function(browser) {
        let icons = searchdata.navBarIcons
        let search = browser.page.search();
        for (var i = 0; i < icons.length; i++) {
            iconsInactive = icons.filter(function(item) {
                return item !== icons[i]
            })
            // NOTE: Should consider replacing it with less fragile code for clicking (double the selectors count)
            search.moveToElement(icons[i], 10, 10) // 10 is X offset
            browser.mouseButtonClick(0)
            .pause(1000)
                search.expect.element(icons[i]).to.have.css('fill').which.equals(searchdata.activefield)
            for (var j = 0; j < iconsInactive.length; j++) {
                search.expect.element(iconsInactive[j]).to.have.css('fill').which.equals(searchdata.inactivefield);
            }  
        }
    },
    'Attempt to perform a search' : function(browser){
        let search = browser.page.search();
        search
            .isVisible('@cancelSearch')
            .click('@usersIcon')
            .setValue('@searchBar', searchdata.searchedTerm)
            .waitForElementVisible('@userSuggestion', 10000)
        browser
            .saveScreenshot(config.imgpath(browser) + 'Search.png')
            .keys(browser.Keys.ENTER);
        search
            .waitForElementVisible('@searchResult')    
    },
    'Attempting to check if the filter result buttons are clickable' : function(browser) {
        let search = browser.page.search();
        let resultIcons = searchdata.resIcons
        for (var i = 0; i < resultIcons.length; i++) {
            iconsInactive = resultIcons.filter(function(item) {
                return item !== resultIcons[i]
            })
            // NOTE: Should consider replacing it with less fragile code for clicking (double the selectors count)
            search.moveToElement(resultIcons[i], 10, 10) // 10 is X offset
            browser.mouseButtonClick(0)
            .pause(1000)
                search.expect.element(resultIcons[i]).to.have.css('fill').which.equals(searchdata.activefield)
            for (var j = 0; j < iconsInactive.length; j++) {
                search.expect.element(iconsInactive[j]).to.have.css('fill').which.equals(searchdata.inactivefield);
                }
            }
        },
    'Attempting to check if the clickable elements and functionality in user search results' : function(browser) {
        let search = browser.page.search();

        search
            .click('@userSearchedIcon')
            .waitForElementVisible('@userResultSpace')
            .waitForElementVisible('@userResultUser')
            .click('@userResultSpace')
            .waitForElementVisible('@newPageTitle')
            search.assert.attributeContains('@newPageTitle', 'title', searchdata.pageTitle)
        browser
             .saveScreenshot(config.imgpath(browser) + 'Search.png')
             .back()
        search
            .waitForElementVisible('@userResultSpace')
            search.expect.element('@userResultUser').to.be.visible;
            search.click('@userResultUser')
            .waitForElementVisible('@newPageTitle')
            search.assert.attributeContains('@newPageTitle', 'title', searchdata.pageTitle)
        browser
            .saveScreenshot(config.imgpath(browser) + 'Search.png')
            .back()
        search
            .pause(2000)
            .waitForElementVisible('@userResultSpace')
            search.expect.element('@userResultUser').to.be.visible;
            search.click('@boxIt')
            .waitForElementVisible('@addToBoxModal')
            search.expect.element('@addNewBox').to.be.visible;  
        browser
            .saveScreenshot(config.imgpath(browser) + 'Search.png')
        search
            .click('@addNewBox')
            .waitForElementVisible('@createNewBoxModalHashtag')
            search.expect.element('@createNewBoxModalHashtag').text.to.equal(`@${searchdata.searchedTerm}`);
            search.expect.element('@userResultUser').to.be.visible;
        search
            .click('@cancelBoxCreation')
    },   
    'Attempting to check if the clickable elements and functionality in boxes search results' : function(browser) {
        let search = browser.page.search();

        search
            .waitForElementVisible('@boxesSearchedIcon')
            .pause(2000)
            search.moveToElement('@boxesSearchedIcon', 10, 10) // 10 is X offset
            browser.mouseButtonClick(0)
        search
            .waitForElementVisible('@folllowInsideSearch')
            search.expect.element('@folllowInsideSearch').to.have.css('color').which.equals(searchdata.white)
            search.click('@folllowInsideSearch')
            search.expect.element('@folllowInsideSearch').to.have.css('color').which.equals(searchdata.purple)
            search.click('@folllowInsideSearch')
        browser
            .saveScreenshot(config.imgpath(browser) + 'Search.png')
        search
            .click('@boxInsideBoxResult')
            .waitForElementVisible('@newPageTitle')
            search.expect.element('@newPageTitle').text.to.equal(searchdata.searchedTerm);
        browser
            .saveScreenshot(config.imgpath(browser) + 'Search.png')
            .back()
        search
            .waitForElementVisible('@boxesSearchedIcon')
            .pause(2000)
            search.moveToElement('@boxesSearchedIcon', 10, 10) // 10 is X offset
            browser.mouseButtonClick(0)
        search
            .click('@userInsideBox')
            .waitForElementVisible('@newPageTitle')
            search.expect.element('@newPageTitle').text.to.equal(searchdata.userBox);
        browser
            .saveScreenshot(config.imgpath(browser) + 'Search.png')
            .back()
    },  
    'Attempting to check if the clickable elements and functionality in hashtag search results' : function(browser) {
        let search = browser.page.search();
        search
            .waitForElementVisible('@userSearchedIcon', 10000)
            search.moveToElement('@hashtagSearchedIcon', 10, 10) // 10 is X offset
            browser.mouseButtonClick(0)
            search.waitForElementVisible('@hastagSearchedResult')
            search.expect.element('@hastagSearchedResult').text.to.equal(`#${searchdata.searchedTerm}`.toLowerCase());
        search
            .click('@boxIt')
            .waitForElementVisible('@addNewBox')
            .click('@addNewBox')
            search.expect.element('@hashtagInsideBoxModal').text.to.equal(`#${searchdata.searchedTerm}`.toLowerCase());
        search
            .moveToElement('@cancelBoxCreation', 10, 10) // 10 is X offset
            browser.mouseButtonClick(0)
            search.waitForElementVisible('@hastagSearchedResult')
        search
            .pause(2000)
            .moveToElement('@hastagSearchedResult', 10, 10) // 30 is X offset
            browser.mouseButtonClick(0)
            search.waitForElementVisible('@newPageTitle')
            .pause(2000) // NOTE: Empty array inside function would fix this need for implicit wait
            search.expect.element('@newPageTitle').text.to.equal(`#${searchdata.searchedTerm}`.toLowerCase());
        browser
            .saveScreenshot(config.imgpath(browser) + 'Search.png')
            .back()
        search
            .waitForElementVisible('@userSearchedIcon')
    },
    'Attempting to check if the clickable elements and functionality in posts search results' : function(browser) {
        let search = browser.page.search();
            browser.refresh();
        search
            .waitForElementVisible('@postsSearchedIcon')
            .moveToElement('@postsSearchedIcon', 10, 10) // 10 is X offset
            browser.mouseButtonClick(0)
            search.waitForElementVisible('@searchResult')
            .setValue('@commentFieldInsideSearch', searchdata.searchedTerm)
            search.expect.element('@reactionsCounter').text.to.equal(searchdata.youInteracted);
        search            
            .click('@postCommentButton')
            search.expect.element('@reactionsCounter').text.to.contain(searchdata.youInteracted);
        search
            .click('@homeButton')
            
        login['We attempt Logout'](browser)

        browser
            .end();
        }
    }
