import { selectInSelectDropdown, getRandomId } from '../../util';

const TAG_TYPE = 'crossTag';
const VALUES = ['111', '222'];
enum DimType {
  NORMAL = 'normal',
  RANGE = 'range',
  VALUE = 'value',
}
interface CrossDimensionType {
  tagId: string;
  tagName: string;
  category: string;
  valueType: string;
  refObjId?: string;
  dimType: DimType;
  values?: (string | null)[];
}
const textTag = {
  tagName: '活跃度模型标签',
  tagId: '991986871506622464',
  category: 'model_tag',
  valueType: 'Text',
  refObjId: null,
};
const numTag = {
  tagName: '数值(名称勿改)',
  tagId: '997126951070300160',
  category: 'static_tag',
  valueType: 'Number',
  refObjId: null,
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
    onSettingClick(0);
    cy.contains('区间范围自定义').find('input').should('be.disabled');
  });

  it('数值 支持区间', () => {
    addTag('number');
    onSettingClick(0);
    cy.contains('区间范围自定义').find('input').should('not.be.disabled');
  });

  it('文本、数值类型 默认离散 查询', () => {
    addTag('text');
    addTag('number');
    onSearch();
    injectSearchApi();
    checkSaveApi([
      {
        ...textTag,
        dimType: DimType.NORMAL,
      },
      {
        ...numTag,
        dimType: DimType.NORMAL,
      },
    ]);
    showBar();
  });

  it('文本 特定值 查询', () => {
    addTag('text');
    onSettingClick(0);
    cy.get('.ant-checkbox-wrapper').click();
    VALUES.map((v) => {
      cy.get('.ant-select-selection--multiple').click().type(`${v}{enter}`);
    });
    onSearch();
    injectSearchApi();
    checkSaveApi([
      {
        ...textTag,
        dimType: DimType.VALUE,
        values: VALUES,
      },
    ]);
    showBar();
  });

  it('数值 特定值 查询', () => {
    addTag('number');
    onSettingClick(0);
    cy.get('.ant-checkbox-wrapper').click();
    VALUES.map((v) => {
      cy.get('.ant-select-selection--multiple').click().type(`${v}{enter}`);
    });
    onSearch();
    injectSearchApi();
    checkSaveApi([
      {
        ...numTag,
        dimType: DimType.VALUE,
        values: VALUES,
      },
    ]);
    showBar();
  });

  it('数值 区间 查询', () => {
    addTag('number');
    onSettingClick(0);
    cy.contains('区间范围自定义').click();
    cy.contains('添加区间').click();
    VALUES.map((v, index) => {
      cy.get('.ant-input-number-input-wrap').eq(index).clear().type(v);
    });
    onSearch();
    injectSearchApi();
    checkSaveApi([
      {
        ...numTag,
        dimType: DimType.RANGE,
        values: VALUES,
      },
    ]);
    showBar();
  });
});

function addTag(type: 'number' | 'text') {
  const tagName = (type === 'number' ? numTag : textTag).tagName;
  if (dimensionLength) {
    // cy.get('.anticon-plus-circle-o').click();
    cy.get('.ant-col-20').find('.ant-btn').click();
  }
  cy.get('.eachItem').eq(dimensionLength).click().type(tagName);
  selectInSelectDropdown(tagName);
  dimensionLength = dimensionLength + 1;
}

function onSettingClick(index: number) {
  cy.get('.eachItem-icon').eq(index).click();
}

function showBar() {
  cy.get('.chart-type>button').eq(3).click();
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

function checkSaveApi(crossDimensions: CrossDimensionType[]) {
  cy.wait('@searchApiCheck', { timeout: 15000 }).then(({ request, response }) => {
    expect(request.body.crossDimensions).deep.equal(crossDimensions);
    expect(request.body.tagType).deep.equal(TAG_TYPE);
    expect(response.body.error).to.equal(undefined);
  });
}
