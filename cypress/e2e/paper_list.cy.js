describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5000/')
    cy.get('#paperList > .rel_paper:nth-child(1)').within(() => {
      cy.get('.rel_score').should('exist')
      cy.get('.rel_title').should('exist')
      cy.get('.rel_authors').should('exist')
      cy.get('.rel_time').should('exist')
      cy.get('.rel_tags').should('exist')
      cy.get('.rel_abs').should('exist')
      cy.get('.rel_more').should('exist')
      cy.get('.rel_inspect').should('exist')
    })
  })
})