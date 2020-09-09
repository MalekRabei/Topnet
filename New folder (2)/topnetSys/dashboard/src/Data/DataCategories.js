export default [
  {
    value: "creditcard",
    productType: "Credit Card",
    productSubtype: [
      {
        value: "creditcard_main",
        name: "Main Credit Card ",
        properties: [
          { value: "annual_fee_credit_card", name: "Annual" },
          { value: "credit_limit_credit_card", name: "Limit Credit" },
          { value: "atm_fee_credit_card", name: "Atm Fee" },
          { value: "foreign_exchange_fee_credit_card", name: "Foreign Exchange Fee" },
          { value: "nominal_interest_rate_credit_card", name: "Nominal Interest Rate" }
        ]
      },
      {
        value: "creditcard_student",
        name: " Student Credit card",
        properties: [
          { value: "annual_fee_credit_card", name: "" },
          { value: "credit_limit_credit_card", name: "" },
          { value: "revolving_credit_card", name: "" },
          { value: "atm_fee_credit_card", name: "" },
          { value: "foreign_exchange_fee_credit_card", name: "" }
        ]
      },
      { value: "creditcard_business", name: " Business Credit card" },
      { value: "creditcard_virtual", name: " Virtual Credit card" }
    ]
  },
  {
    value: "bank_account",
    productType: "Bank Account",
    productSubtype: [
      { value: "bank_account_main", name: "Main Bank Account" },
      { value: "bank_account_youth", name: "Youth Bank Account " },
      { value: "bank_account_business", name: "Business Bank Account", properties:[
        {value:"annual_fee_online_banking", name:"Annual Fee"}, 
        {value:"annual_fee_extra_bank_card", name:"Annual Fee Extra"}, 
        {value:"deposit_protection_scheme", name:"Deposit Protection Scheme"}, 
        {value:"credit_card_type", name:"Credit Card Type"}, 
      ] }
    ]
  }
];
