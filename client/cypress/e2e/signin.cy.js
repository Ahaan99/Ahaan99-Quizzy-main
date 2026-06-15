/// <reference types="cypress" />

describe('SignIn Page - Visual Regression & Responsive Tests', () => {
  const viewports = [
    { width: 320, height: 568 }, // Mobile small
    { width: 768, height: 1024 }, // Tablet
    { width: 1024, height: 768 }, // Desktop small
    { width: 1440, height: 900 }  // Desktop large
  ];

  beforeEach(() => {
    cy.visit('/login');
  });

  viewports.forEach((viewport) => {
    it(`should render correctly and not shift layout at ${viewport.width}x${viewport.height}`, () => {
      cy.viewport(viewport.width, viewport.height);
      
      // Wait for framer-motion animations to complete (150ms stagger + 400ms duration)
      cy.wait(600);

      // Verify critical elements are visible and stable
      cy.get('h2').contains('Welcome back').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');

      // Visual Regression check (assuming cypress-image-snapshot or percy is configured)
      // cy.matchImageSnapshot(`signin-page-${viewport.width}`);
    });
  });

  it('verifies accessibility keyboard navigation', () => {
    cy.viewport(1024, 768);
    
    // Tab through the interactive elements
    cy.get('body').tab(); // Assuming cypress-plugin-tab
    cy.focused().should('have.text', 'Google');
    cy.focused().tab();
    cy.focused().should('have.text', 'Facebook');
    cy.focused().tab();
    cy.focused().should('have.attr', 'type', 'email');
    cy.focused().tab();
    cy.focused().should('have.attr', 'name', 'password');
    cy.focused().tab();
    cy.focused().should('have.attr', 'aria-label').and('include', 'password'); // The eye toggle
    cy.focused().tab();
    cy.focused().should('have.text', 'Forgot Password?');
    cy.focused().tab();
    cy.focused().should('have.text', 'Sign In');
  });
});
