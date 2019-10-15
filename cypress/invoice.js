const login = require('../../../pom/login.js')
const random = require('../../../pom/randomWord.js')
const personalisedURI = ((login.userName).substring(0, login.userName.lastIndexOf("@"))+'.invoicely.com')

describe('Invoice', function() {
// Just checking for a modal text, found no need to do additional assert/expect. Also, modal title is only logical choice
  it('Visits the Login Page', function() {
    cy.visit(personalisedURI)
    cy.contains(login.loginModalText)
    cy.get('.default')
  })
  it('Inputs the user credentials and logs in', function(){  
    cy.login({ email: login.userName, password: login.passWord }); 
  })
  // Checking for the title of the page, as it is most easy to maintain if changed
  it('Navigates to the predefined invoice', function() {
    cy.get('h1')
    cy.contains(login.titletextDash)
    cy.get('.connections').click()
  })
  // Checking for the name of the page, as it is most easy to maintain if changed
  it('Searches for existing Invoice', function(){
    cy.login({ email: login.userName, password: login.passWord }); 
    cy.get('.invoices').click()
    cy.contains('h1', login.titletextInvoice)  
    cy.contains('Draft').click()
    cy.get('.standard-table')
    cy.contains(login.invoiceNumber).click()
    cy.contains('Edit').click()
    cy.contains(login.editTitle, login.editTitleText)  
})
// Checking if the input actually took place and there is value in the field
    it('Should update date by a year', () => {
        cy.get('input[class=datepicker]')
          .invoke('val') 
          .then(date => {
            cy.date({ date }); 
    })
})  
// Checking if the input actually took place and there is value in the field
    it('Should update word fields', () => {
        let words = login.words
        for (var i = 0; i < words.length; i++) {
        cy.get(words[i]).clear()
        cy.get(words[i]).type(random.createRandomWord(10))
        expect(words[i]).not.to.be.empty
        }  
    })  
// Checking if the input actually took place and there is value in the field
    it('Should update number fields', () => {
        let numbers = login.numbers
        for (var i = 0; i < numbers.length; i++) {
        var number = Math.floor(Math.random() * 99)
        cy.get(numbers[i]).type(`{selectall}{backspace}`)
        cy.get(numbers[i]).type(number)
        expect(numbers[i]).not.to.be.empty
        }
    })
    // Clicking on the "Save draft" bugs out the application as it will not save the Draft, it will be stuck in loader indefinetly
    // Checking if the confirmation is displayed.
    it('Should save the draft', () => {
        cy.get('.save-button').click()
        cy.get('.alert').contains('Invoice edited') 
    })  
})          
