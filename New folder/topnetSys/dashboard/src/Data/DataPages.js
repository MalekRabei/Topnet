export default [
  {
    id: 1,
    site: {
      title: "test site",
      design: "azur",
      categories: ["creditcard", "bank_account"],
      currency: "Dt"
    },
    type: "azurListing",
    description :"page 1", 
    widgets: [
      { name: "navbar", design: "azur" },
      { name: "products", design: "azur" }
    ],
    Products: [{ titre: "produit 1", prix: "20" }]
  },

  {
    id: 2,
    site: {
      title: "test site",
      design: "azur",
      categories: ["creditcard", "bank_account"],
      currency: "Dt"
    },
    type: "singleProduct",
    description :"page 2", 
    widgets: [
      { name: "navbar", design: "azur" },
      { name: "products", design: "azur" }
    ],
    Products: [{ titre: "produit 1", prix: "20" }]
  }
];
