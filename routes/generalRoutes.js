const { Router } = require("express");

const router = Router();

router.get("/reviews", (req, res) => {
  res.render("template", {
    heading: "reviews"
  });
});
router.get("/team", (req, res) => {
  res.render("template", {
    heading: "Team"
  });
});
router.get("/help", (req, res) => {
  res.render("template", {
    heading: "Help"
  });
});

module.exports = router;
