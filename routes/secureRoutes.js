const { Router } = require("express");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

router.get("/paper", requireAuth, (req, res) => {
  res.render("paper", {
    heading: "Paper"
  });
});

module.exports = router;
