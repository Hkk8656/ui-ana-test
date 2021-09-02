import {
  selectInSelectDropdown,
  clickInPopoverWithText,
  clickInPopoverWithTagName,
} from '../../util';
//TODO: .eq(1) ,should refine, how to confirm target element
const TAG_TYPE = 'crossTag';
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
const textTagValues = ['活跃度(排名前15%-20%)', '活跃度(排名前15%)', '活跃度(排名前20%-3333%)'];

const textTag2 = {
  tagName: '商品标签',
  tagId: '1060105031874889728',
  category: 'model_tag',
  valueType: 'Text',
  refObjId: null,
};
const textTag2Values = ['尿布十片装', 'DMhub纪念徽章', '白色T恤'];

const numTag = {
  tagName: '数值(名称勿改)',
  tagId: '997126951070300160',
  category: 'static_tag',
  valueType: 'Number',
  refObjId: null,
};
const numTagValues1 = ['111', '222'];

const numTag2 = {
  tagName: '数值192',
  tagId: '1039751863970447360',
  category: 'external_tag',
  valueType: 'Number',
  refObjId: null,
};
const numTagValues2 = ['1000', '1200'];

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

  it('至多支持三个维度', () => {
    cy.get('.ant-col-20').find('.ant-btn').click();
    cy.get('.ant-col-20').find('.ant-btn').click();
    cy.get('.ant-col-20').get('button>.anticon-plus-circle-o').should('not.exist');
  });

  it('文本、数值类型 默认离散 查询', () => {
    addTag(numTag);
    addTag(textTag);
    onSearch();
    injectSearchApi();
    checkSaveApi([
      {
        ...numTag,
        dimType: DimType.NORMAL,
      },
      {
        ...textTag,
        dimType: DimType.NORMAL,
      },
    ]);
    showBar();
  });

  describe('数值类型', () => {
    it('支持离散、特定值、区间', () => {
      addTag(numTag);
      onSettingClick(0);
      cy.contains('区间范围自定义').find('input').should('not.be.disabled');
      cy.contains('离散统计').find('input').should('not.be.disabled');
      cy.contains('选择特定值').find('input').should('not.be.disabled');
    });

    it('离散 查询', () => {
      addTag(numTag);
      onSearch();
      injectSearchApi();
      checkSaveApi([
        {
          ...numTag,
          dimType: DimType.NORMAL,
        },
      ]);
      showBar();
    });

    it('特定值 查询', () => {
      addTag(numTag);
      onSettingClick(0);
      cy.get('.ant-checkbox-wrapper').click();
      numTagValues1.map((v) => {
        cy.get('.ant-select-selection--multiple').click().type(`${v}{enter}`);
      });
      onSearch();
      injectSearchApi();
      checkSaveApi([
        {
          ...numTag,
          dimType: DimType.VALUE,
          values: numTagValues1,
        },
      ]);
      showBar();
    });

    it('区间 查询', () => {
      addTag(numTag);
      onSettingClick(0);
      cy.contains('区间范围自定义').click();
      cy.contains('添加区间').click();
      numTagValues1.map((v, index) => {
        cy.get('.ant-input-number-input-wrap').eq(index).clear().type(v);
      });
      onSearch();
      injectSearchApi();
      checkSaveApi([
        {
          ...numTag,
          dimType: DimType.RANGE,
          values: numTagValues1,
        },
      ]);
      showBar();
    });

    it('离散 + 离散 查询', () => {
      addTag(numTag);
      addTag(numTag2);
      onSearch();
      injectSearchApi();
      checkSaveApi([
        {
          ...numTag,
          dimType: DimType.NORMAL,
        },
        {
          ...numTag2,
          dimType: DimType.NORMAL,
        },
      ]);
      showBar();
    });

    it('离散 + 特定值 查询', () => {
      addTag(numTag);
      addTag(numTag2);
      onSettingClick(1);
      cy.get('.ant-checkbox-wrapper').click();
      numTagValues2.map((v) => {
        cy.get('.ant-select-selection--multiple').click().type(`${v}{enter}`);
      });
      onSearch();
      injectSearchApi();
      checkSaveApi([
        {
          ...numTag,
          dimType: DimType.NORMAL,
        },
        {
          ...numTag2,
          dimType: DimType.VALUE,
          values: numTagValues2,
        },
      ]);
      showBar();
    });

    it('离散 + 区间 查询', () => {
      addTag(numTag);
      addTag(numTag2);
      onSettingClick(1);
      cy.contains('区间范围自定义').click();
      cy.contains('添加区间').click();
      numTagValues2.map((v, index) => {
        cy.get('.ant-input-number-input-wrap').eq(index).clear().type(v);
      });
      onSearch();
      injectSearchApi();
      checkSaveApi([
        {
          ...numTag,
          dimType: DimType.NORMAL,
        },
        {
          ...numTag2,
          dimType: DimType.RANGE,
          values: numTagValues2,
        },
      ]);
      showBar();
    });

    it('特定值 + 特定值 查询', () => {
      addTag(numTag);
      onSettingClick(0);
      cy.get('.ant-checkbox-wrapper').eq(0).click();
      numTagValues1.map((v) => {
        cy.get('.ant-select-selection--multiple').click().type(`${v}{enter}`);
      });
      hidePopover();
      addTag(numTag2);
      onSettingClick(1);
      cy.get('.ant-checkbox-wrapper').eq(1).click();
      numTagValues2.map((v) => {
        cy.get('.ant-select-selection--multiple').eq(1).click().type(`${v}{enter}`);
      });
      onSearch();
      injectSearchApi();
      checkSaveApi([
        {
          ...numTag,
          dimType: DimType.VALUE,
          values: numTagValues1,
        },
        {
          ...numTag2,
          dimType: DimType.VALUE,
          values: numTagValues2,
        },
      ]);
      showBar();
    });

    it('特定值 + 区间 查询', () => {
      addTag(numTag);
      onSettingClick(0);
      cy.get('.ant-checkbox-wrapper').eq(0).click();
      numTagValues1.map((v) => {
        cy.get('.ant-select-selection--multiple').click().type(`${v}{enter}`);
      });
      hidePopover();
      addTag(numTag2);
      onSettingClick(1);
      clickInPopoverWithText('区间范围自定义');
      clickInPopoverWithText('添加区间');
      numTagValues2.map((v, index) => {
        clickInPopoverWithTagName('.ant-input-number-input-wrap').eq(index).clear().type(v);
      });
      hidePopover();
      onSearch();
      injectSearchApi();
      checkSaveApi([
        {
          ...numTag,
          dimType: DimType.VALUE,
          values: numTagValues1,
        },
        {
          ...numTag2,
          dimType: DimType.RANGE,
          values: numTagValues2,
        },
      ]);
      showBar();
    });

    it('区间 + 区间 查询', () => {
      addTag(numTag);
      onSettingClick(0);
      cy.contains('区间范围自定义').click();
      cy.contains('添加区间').click();
      numTagValues1.map((v, index) => {
        cy.get('.ant-input-number-input-wrap').eq(index).clear().type(v);
      });
      addTag(numTag2);
      onSettingClick(1);
      clickInPopoverWithText('区间范围自定义');
      clickInPopoverWithText('添加区间');
      numTagValues2.map((v, index) => {
        clickInPopoverWithTagName('.ant-input-number-input-wrap')
          .eq(index + 2)
          .clear()
          .type(v);
      });
      onSearch();
      injectSearchApi();
      checkSaveApi([
        {
          ...numTag,
          dimType: DimType.RANGE,
          values: numTagValues1,
        },
        {
          ...numTag2,
          dimType: DimType.RANGE,
          values: numTagValues2,
        },
      ]);
      showBar();
    });
  });

  describe('文本类型', () => {
    it('不支持区间', () => {
      addTag(textTag);
      onSettingClick(0);
      cy.contains('区间范围自定义').find('input').should('be.disabled');
    });
    it('离散 查询', () => {
      addTag(textTag);
      onSearch();
      injectSearchApi();
      checkSaveApi([
        {
          ...textTag,
          dimType: DimType.NORMAL,
        },
      ]);
      showBar();
    });
    it('特定值 查询', () => {
      addTag(textTag);
      onSettingClick(0);
      cy.get('.ant-checkbox-wrapper').click();
      textTagValues.map((v) => {
        cy.get('.ant-select-selection--multiple').click().type(`${v}{enter}`);
      });
      onSearch();
      injectSearchApi();
      checkSaveApi([
        {
          ...textTag,
          dimType: DimType.VALUE,
          values: textTagValues,
        },
      ]);
      showBar();
    });
    it('离散 + 离散 查询', () => {
      addTag(textTag);
      addTag(textTag2);
      onSearch();
      injectSearchApi();
      checkSaveApi([
        {
          ...textTag,
          dimType: DimType.NORMAL,
        },
        {
          ...textTag2,
          dimType: DimType.NORMAL,
        },
      ]);
      showBar();
    });

    it('离散 + 特定值 查询', () => {
      addTag(textTag);
      addTag(textTag2);
      onSettingClick(1);
      cy.get('.ant-checkbox-wrapper').click();
      textTag2Values.map((v) => {
        cy.get('.ant-select-selection--multiple').click().type(`${v}{enter}`);
      });
      onSearch();
      injectSearchApi();
      checkSaveApi([
        {
          ...textTag,
          dimType: DimType.NORMAL,
        },
        {
          ...textTag2,
          dimType: DimType.VALUE,
          values: textTag2Values,
        },
      ]);
      showBar();
    });

    it('特定值 + 特定值 查询', () => {
      addTag(textTag);
      onSettingClick(0);
      cy.get('.ant-checkbox-wrapper').eq(0).click();
      textTagValues.map((v) => {
        cy.get('.ant-select-selection--multiple').click().type(`${v}{enter}`);
      });
      hidePopover();
      addTag(textTag2);
      onSettingClick(1);
      cy.get('.ant-checkbox-wrapper').eq(1).click();
      textTag2Values.map((v) => {
        cy.get('.ant-select-selection--multiple').eq(1).click().type(`${v}{enter}`);
      });
      onSearch();
      injectSearchApi();
      checkSaveApi([
        {
          ...textTag,
          dimType: DimType.VALUE,
          values: textTagValues,
        },
        {
          ...textTag2,
          dimType: DimType.VALUE,
          values: textTag2Values,
        },
      ]);
      showBar();
    });
  });
});

function addTag(tag) {
  const { tagName } = tag;
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

function hidePopover() {
  cy.get('.ana-block').click();
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
