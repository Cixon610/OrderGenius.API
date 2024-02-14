export const assistantsTools = [
  //get_order_history
  {
    type: 'function',
    function: {
      name: 'get_order_history',
      description: '取得客戶的歷史訂單資訊',
      parameters: {
        type: 'object',
        properties: {
          count: {
            type: 'number',
            description: '取最新幾筆訂單資訊',
          },
        },
        required: ['count'],
      },
    },
  },
  //get_recommand
  {
    type: 'function',
    function: {
      name: 'get_recommand',
      description: '取得客戶餐點推薦名稱清單',
    },
  },
  //get_all_items
  {
    type: 'function',
    function: {
      name: 'get_all_items',
      description: '取得店家所有餐點名稱清單',
      parameters: {
        type: 'object',
        properties: {
          count: {
            type: 'number',
            description: '取最新幾項餐點資訊, 0為全部取得',
          },
        },
        required: ['count'],
      },
    },
  },
  //search_item_by_key
  {
    type: 'function',
    function: {
      name: 'search_item_by_key',
      description: '依提供的關鍵字查詢相關的餐點清單',
      parameters: {
        type: 'object',
        properties: {
          key: {
            type: 'string',
            description: '查詢關鍵字',
          },
        },
        required: ['key'],
      },
    },
  },
  //get_shopping_cart
  {
    type: 'function',
    function: {
      name: 'get_shopping_cart',
      description: '取得購物車內餐點資訊',
    },
  },
  //modify_shopping_cart
  {
    type: 'function',
    function: {
      name: 'modify_shopping_cart',
      description: '更新購物車內餐點資訊',
      parameters: {
        type: 'object',
        properties: {
          detail: {
            type: 'array',
            description: '購物車餐點資訊',
            items: {
              type: 'object',
              properties: {
                itemId: {
                  type: 'string',
                  description: '餐點編號',
                },
                modifications: {
                  type: 'array',
                  description: '餐點客製化選項',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        description: '客製化選項名稱',
                      },
                      options: {
                        type: 'object',
                        description:
                          '客製化選項項目key-value，key為選項名稱，value為價格，此型別為Map<string, number>',
                        additionalProperties: {
                          type: 'number',
                        },
                      },
                      maxChoices: {
                        type: 'number',
                        description: '最大選取數量',
                      },
                    },
                    required: [
                      'businessId',
                      'name',
                      'options',
                      'maxChoices',
                      'id',
                    ],
                  },
                },
                count: {
                  type: 'number',
                  description: '餐點數量',
                },
                memo: {
                  type: 'string',
                  description: '餐點備註',
                },
              },
              required: ['itemId', 'modifications', 'count', 'memo'],
            },
          },
          memo: {
            type: 'string',
            description: '購物車備註',
          },
        },
        required: ['detail', 'memo'],
      },
    },
  },
];
