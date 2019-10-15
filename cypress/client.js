const login = require('../../../pom/login.js')
const random = require('../../../pom/randomWord.js')
const personalisedURI = ((login.userName).substring(0, login.userName.lastIndexOf("@"))+'.invoicely.com')

describe('Client', function() {
// Just checking for a modal text, found no need to do additional assert/expect. Also, modal title is only logical choice
  it('Visits the Login Page', function() {
    cy.visit(personalisedURI)
    cy.contains(login.loginModalText)
    cy.get('.default')
})
// Asserting API response, as if it fails, the user will not be able to log in, in favor of some HTML elements' text
  it('Inputs the user credentials and logs in', function(){  
    cy.server()
    cy.route('POST', login.loginXHREndpoint).as('login')
    cy.login({ email: login.userName, password: login.passWord });
    cy.wait('@login')
    //XHR assertation
    cy.get('@login').then(function (xhr) {
      expect(xhr.status).to.eq(200)
      expect(xhr.requestHeaders).to.have.property('Content-Type')
      expect(xhr.method).to.eq('POST')
    })
})
// Checking for the name of the page, as it is most easy to maintain if changed
  it('Navigates to the predefined clients', function() {
    cy.get('h1')
    cy.contains(login.titletextDash)
    cy.get('.connections').click()
})
// Checking if the confirmation is displayed. Did not check anything regarding values, since they are random
  it('Searches for existing Client and edits it', function(){
    cy.login({ email: login.userName, password: login.passWord }); 
    cy.get('.connections').click()
    cy.contains('h1', login.titletextClient)  
    cy.get('.edit')
    .should('have.attr', 'href').should('contain', login.userProfileEndpoint)
    .then((href) => {
      cy.visit(personalisedURI+ href)
    })
    cy.get(login.addressOne).clear().type(random.createRandomWord(10), { delay: 10 })
    cy.contains('Save').click()
    cy.get('.alert').should('contain', login.clientEdited)
})

})
