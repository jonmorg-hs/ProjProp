const router = require("express").Router();
const {
  Post,
  User,
  Comment,
  Properties,
  Events,
  Eventtypes,
  savedProperties,
} = require("../models");
const sequelize = require("../config/connection");
const withAuth = require("../utils/auth");

router.get("/", withAuth, (req, res) => {
  savedProperties
    .findAll({
      where: {
        user_id: req.session.user_id,
      },
      attributes: ["id", "user_id", "property_id"],
      include: [
        {
          model: Properties,
          attributes: ["id", "address", "latitude", "longitude"],
          include: {
            model: Events,
            attributes: [
              "event_id",
              "event_start_dt",
              "event_end_dt",
              "event_start_time",
              "event_end_time",
            ],
            include: {
              model: Eventtypes,
              attributes: ["title"],
            },
          },
        },
      ],
    })
    .then((results) => {
      const posts = results.map((post) => post.get({ plain: true }));
      res.render("dashboard", {
        posts,
        loggedIn: true,
        registered: req.session.registered,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/edit/:id", withAuth, (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "created_at", "post_content"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }

      const post = dbPostData.get({ plain: true });

      res.render("edit-post", {
        post,
        loggedIn: true,
        registered: req.session.registered,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/find/:id", withAuth, (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "created_at", "post_content"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }

      const post = dbPostData.get({ plain: true });

      res.render("find-property", {
        post,
        loggedIn: true,
        registered: req.session.registered,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/create/", withAuth, (req, res) => {
  Properties.findAll({
    where: {
      user_id: req.session.user_id,
    },
  })
    .then((registerData) => {
      const register = registerData.map((reg) => reg.get({ plain: true }));
      if (register.length > 0) {
        res.render("create-event", {
          register,
          loggedIn: true,
          registered: req.session.registered,
        });
      } else {
        res.render("create-post", {
          register,
          loggedIn: true,
          registered: req.session.registered,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/search/", withAuth, (req, res) => {
  Post.findAll({
    where: {
      user_id: req.session.user_id,
    },
    attributes: ["id", "title", "created_at", "post_content"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      res.render("search-post", {
        posts,
        loggedIn: true,
        registered: req.session.registered,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/event/", withAuth, (req, res) => {
  Events.findAll({
    where: {
      property_id: 1,
    },
  })
    .then((eventsData) => {
      const events = eventsData.map((event) => event.get({ plain: true }));
      res.render("create-event", {
        events,
        loggedIn: true,
        registered: req.session.registered,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:id", withAuth, (req, res) => {
  savedProperties
    .destroy({
      where: {
        property_id: req.params.id,
        user_id: req.session.user_id,
      },
    })
    .then((deleteData) => {
      const posts = deleteData.map((post) => post.get({ plain: true }));
      res.render("dashboard", {
        posts,
        loggedIn: true,
        registered: req.session.registered,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
