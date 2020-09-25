const { Router } = require("express");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

router.get("/paper", requireAuth, (req, res) => {
  res.render("template", {
    heading: "Paper"
  });
});

module.exports = router;
