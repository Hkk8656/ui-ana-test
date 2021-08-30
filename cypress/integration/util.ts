export function getRandomId(prefix?: string) {
  return (prefix || 'uat_test') + Math.floor(Math.random() * 1000) + '';
}
export function selectInSelectDropdown(text) {
  cy.get('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').contains(text).click();
}
