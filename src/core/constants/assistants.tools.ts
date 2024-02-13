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
      description: '取得客戶商品推薦名稱清單',
    },
  },
  //get_all_items
  {
    type: 'function',
    function: {
      name: 'get_all_items',
      description: '取得店家所有商品名稱清單',
      parameters: {
        type: 'object',
        properties: {
          count: {
            type: 'number',
            description: '取最新幾項商品資訊, 0為全部取得',
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
      description: '依提供的關鍵字查詢相關的商品清單',
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
      description: '取得購物車內商品資訊',
    },
  },
  //modify_shopping_cart
  {
    type: 'function',
    function: {
      name: 'modify_shopping_cart',
      description: '更新購物車內商品資訊',
      parameters: {
        type: 'object',
        properties: {
          detail: {
            type: 'array',
            description: '購物車商品資訊',
            items: {
              type: 'object',
              properties: {
                itemId: {
                  type: 'string',
                  description: '商品編號',
                },
                modifications: {
                  type: 'array',
                  description: '商品客製化選項',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        description: '客製化選項名稱',
                      },
                      options: {
                        type: 'array',
                        description: '客製化選項項目',
                        items: {
                          type: 'object',
                          additionalProperties: {
                            type: 'number',
                          },
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
                  description: '商品數量',
                },
                memo: {
                  type: 'string',
                  description: '商品備註',
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
