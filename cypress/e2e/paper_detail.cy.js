describe('template spec', () => {
    it('passes', () => {
        cy.visit('http://127.0.0.1:5000/inspect?pid=2112.09726')
        cy.get('[data-cy="img_thumb"]').should('exist');
    })
})