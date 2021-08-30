import { selectInSelectDropdown, getRandomId } from '../../util';

const textTag = {
  label: '活跃度模型标签',
  tagId: '991986871506622464',
  category: 'model_tag',
  valueType: 'Text',
};
const numTag = {
  label: '数值(名称勿改)',
  tagId: '997126951070300160',
  category: 'static_tag',
  valueType: 'Number',
};
let dimensionLength = 0;
describe('值标签交叉 - 查询', () => {
  before(() => {});
  beforeEach(() => {
    cy.login();
    cy.contains('标签分析').click();
    cy.contains('值标签交叉').click();
    dimensionLength = 0;
  });

  afterEach(() => {});

  it('文本 不支持区间', () => {
    addTag('text');
    cy.get('.eachItem-icon').eq(0).click();
    cy.contains('区间范围自定义').find('input').should('be.disabled');
    clearSelect();
  });

  it('数值 支持区间', () => {
    addTag('number');
    cy.get('.eachItem-icon').first().click();
    cy.contains('区间范围自定义').find('input').should('not.be.disabled');
    clearSelect();
  });

  it('文本、数值类型 默认离散 查询', () => {
    addTag('text');
    addTag('number');
    onSearch();
    injectSearchApi();
    checkSaveApi({
      tagType: 'crossTag',
      crossDimensions: [
        {
          tagId: textTag.tagId,
          tagName: textTag.label,
          category: textTag.category,
          dimType: 'normal',
        },
        {
          tagId: numTag.tagId,
          tagName: numTag.label,
          category: numTag.category,
          dimType: 'normal',
        },
      ],
    });
    clearSelect();
  });

  it.skip('文本 特定值 查询', () => {
    cy.get('.eachItem').eq(0).click().type(textTag.label);
    selectInSelectDropdown(textTag.label);
    // onSearch();
    // injectSearchApi();
    // checkSaveApi([
    //   {
    //     tagId: textTag.tagId,
    //     category: textTag.category,
    //     dimParameter: {
    //       type: 'normal',
    //       value: [],
    //     },
    //   },
    // ]);
    // clearSelect();
  });
});

function addTag(type: 'number' | 'text') {
  const label = (type === 'number' ? numTag : textTag).label;
  if (dimensionLength) {
    // cy.get('.anticon-plus-circle-o').click();
    cy.get('.ant-col-20').find('.ant-btn').click();
  }
  cy.get('.eachItem').eq(dimensionLength).click().type(label);
  selectInSelectDropdown(label);
  dimensionLength = dimensionLength + 1;
}

function clearSelect() {
  // cy.get('.ant-radio-wrapper').eq(0).click();
  // cy.contains('值标签交叉').click();
}

function onSearch() {
  cy.contains('查 询').click();
}

function injectSearchApi() {
  cy.intercept({
    method: 'POST',
    url: '/impala/query_tag',
  }).as('searchApiCheck');
}

function checkSaveApi({ tagType, crossDimensions }) {
  cy.wait('@searchApiCheck', { timeout: 15000 }).then(({ request, response }) => {
    expect(request.body.crossDimensions).deep.equal(crossDimensions);
    expect(request.body.tagType).deep.equal(tagType);
    expect(response.body.error).to.equal(undefined);
  });
}
