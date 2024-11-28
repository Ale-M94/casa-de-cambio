const URL = 'http://192.168.56.1:8080';

describe('casa-de-cambio', () => {
  beforeEach(() => {
    cy.visit(URL);
  });

  describe('Prueba los campos y el botón consultar', () => {
    it('No realiza la consulta si no hay fecha seleccionada', () => {
      cy.get('#boton-consultar').click();
      cy.get('#selector-fecha').should('have.class', 'rojo');
    });

    it('Se asegura que la lista de divisas se completó', () =>{
      cy.get('#selector-divisa').find('option').should('have.length', 31);
    });

    it('Selecciona una fecha y realiza la consulta', () =>{
      cy.get('#selector-fecha').invoke('val', '2024-11-28');
      cy.get('#boton-consultar').click();
      cy.get('#selector-fecha').should('not.have.class', 'rojo');
      cy.get('#tbody-cotizaciones').should('be.visible');
      cy.get('#tbody-cotizaciones').find('tr').should('have.length', 30);
    });
  });

  describe('Prueba realizar otra consulta', () =>{

    it('Elige otra divisa, una fecha anterior y realiza la consulta', () =>{
      cy.wait(500)
      cy.get('#selector-divisa').select('USD');
      cy.get('#selector-fecha').invoke('val', '2024-11-26');
      cy.get('#boton-consultar').click();
      cy.get('#selector-fecha').should('not.have.class', 'rojo');
      cy.get('#tbody-cotizaciones').should('be.visible');
    });

    it('Prueba el botón para realizar otra consulta', () =>{
      cy.get('#selector-fecha').invoke('val', '2024-11-28');
      cy.get('#boton-consultar').click();
      cy.get('#boton-reiniciar').click();
      cy.get('#tbody-cotizaciones').should('not.be.visible');
    });

    it('Realiza una consulta, luego otra con distinta divisa y fecha', () =>{
      cy.get('#selector-fecha').invoke('val', '2024-11-28');
      cy.get('#boton-consultar').click();
      cy.get('#boton-reiniciar').click();
      cy.get('#selector-divisa').select('USD');
      cy.get('#selector-fecha').invoke('val', '2024-11-26');
      cy.get('#boton-consultar').click();
      cy.get('#tbody-cotizaciones').should('be.visible');
      cy.get('#tbody-cotizaciones').find('tr').should('have.length', 30);
    });
  });
});
