var express = require("express");
var router = express.Router();
ProductProperties = require("../../models/ProductProperties");
Product = require("../../models/Product");
Subcategory = require("../../models/Subcategory");
Category = require("../../models/Category");
const puppeteer = require("puppeteer");
const CronJob = require("cron").CronJob;

//get all product properties
router.get("/", async (req, res, next) => {
  await ProductProperties.find({})
    .populate("subcategory product")
    .then((data) => {
      res.status(202).json(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
//get properties with activated cron
async function UpdateProductPropertiesCron() {
  await ProductProperties.find({}, { _id: true, properties: true }).then(
    (AllProductProperties) => {
      AllProductProperties.filter((prop, index) => {
        prop.properties.filter(async (p, index) => {
          if (p.scrape.value === true) {
            let updatedPropValue = await ScrapeData(
              p.scrape.link,
              p.scrape.property
            );

            //mettre a j l'element
            let element = p;
            element.value = updatedPropValue + "2"; //2 pour le test

            //mettre a jour la liste des prop avec le nouvel element
            let list = prop.properties;
            list = prop.properties.map((x) => {
              if (x.key == element.key) {
                return element;
              } else {
                return x;
              }
            });
            await ProductProperties.findOneAndUpdate(
              { _id: prop._id },
              { $set: { properties: list } }
            );
          }
        });
      });
    }
  );
}

//add product properties
router.post("/add", async (req, res) => {
  const product = await Product.findById(req.body.idProduct.id);
  const subcategory = await Subcategory.findById(req.body.idSubcategory);
  ProductProperties.create({
    product: product,
    subcategory: subcategory,
    path: req.body.path.split(" ").join("-"),
    properties: req.body.properties,
  })
    .then(async (data) => {
      await Subcategory.update(
        { _id: req.body.idSubcategory },
        { $push: { products: data } }
      );
      res.status(202).json(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
});

//update product properties
router.put("/update", async (req, res) => {
  let product = await Product.find({ _id: req.body.idProduct });
  let subcategory = await Subcategory.find({ _id: req.body.idSubcategory });
  try {
    let updateProductProperties = {
      product: product[0],
      subcategory: subcategory[0],
      properties: req.body.properties,
      path: req.body.path,
    };
    productProperties = await ProductProperties.findOneAndUpdate(
      { _id: req.body.idProductProp },
      updateProductProperties
    );
    return res.json({
      productProperties,
      msg: "Properties Updated Successfully",
    });
  } catch (err) {
    res.status(500).send("server error");
  }
});

//delete product properties
router.delete("/delete/:id", async (req, res) => {
  ProductProperties.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(202).send("Product properties Deleted Successfully !");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
//get properties of product
router.get("/:idproduct", async (req, res, next) => {
  let product = await Product.find({ _id: req.params.idProduct });
  await ProductProperties.find({ product: req.params.idproduct })
    .populate("product")
    .populate([
      {
        path: "subcategory",
        model: Subcategory,
        populate: {
          path: "category",
          model: Category,
        },
      },
    ])
    .then((data) => {
      res.status(202).json(data[0]);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
});
//scrape properties
router.post("/scrapetxt", async (req, res) => {
  try {
    res.status(202).json(await ScrapeData(req.body.link, req.body.property));
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({
      errors: [
        {
          msg: "invalid",
        },
      ],
    });
  }
});

async function ScrapeData(link, property) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link.toString()); //url

  const [el] = await page.$x(property.toString()); // destructuring
  const src = await el.getProperty("textContent");
  const txt = await src.jsonValue();
  console.log({ txt });
  return txt;
}

async function cronFunction() {
  var job = new CronJob(
    "0 0 * * *",
    async function () {
      console.log("You will see this message once a week");
      await UpdateProductPropertiesCron();
    },
    null,
    true,
    "America/Los_Angeles"
  );
  job.start();
}
cronFunction();
module.exports = router;
