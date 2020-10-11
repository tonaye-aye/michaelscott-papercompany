const { Router } = require("express");

const router = Router();

router.get("/about", (req, res) => {
  res.render("about", {
    heading: "about"
  });
});

module.exports = router;
