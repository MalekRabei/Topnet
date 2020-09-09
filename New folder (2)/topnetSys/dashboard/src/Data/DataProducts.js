export default [
    {
        _id:0, 
        coutry_code :"France-FR", 
        title:"Carte du monde visa", 
        active:true , 
        productImg:"product1.png", 
        alt_pic:"Carte_du_monde_visa", 
        category:{
            value: "Creditcard", 
            subcategory:{value:"creditcard_main", name:"Main Credit Card"}
        }, 
        properties:[
            {name:"annual fee", type:"annual_fee_credit_card", description:"100"}, 
            {name:"limit credit", type:"credit_limit_credit_card", description:"200"}, 
        ]
    }, 
    {
        _id:1, 
        coutry_code :"France-FR", 
        title:"Carte CLASSIQUE de visa ANWB", 
        active:false, 
        productImg:"product2.png", 
        alt_pic:"Carte_CLASSIQUE_de_visa_ANWB", 
        category:{
            value: "Creditcard", 
            subcategory:{value:"creditcard_student", name:"Student Credit card"}
        }, 
        properties:null
        
    }
]