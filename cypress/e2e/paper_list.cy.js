describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5000/')
    // 1. This selector was generated by Cypress app, suggested selector
    // (Minus points: it should not use nth-child, which is flaky. It should suggest we add data-cy="paper-list" to the element)
    cy.get('#paperList > .rel_paper:nth-child(1)').within(() => {
      // 2. This was generated with a prompt like "Suggest how to find elements in [filename]"
      // (it gave one selector that is out of scope, .rel_paper, ideally it would have access to rendered DOM to suggest test body.
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