/*
 * All routes for Item-listings are defined here
 * Since this file is loaded in server.js into /f,
 *   these routes are mounted onto /f
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

const feed = require('../db/queries/feeds');
const { getFavouriteByUserIdAndItemId } = require('../db/queries/favourites');

router.get('/feeds', (req, res) => {
  const userId = req.session.userId ? req.session.userId : 1;
  const results = [];
  feed.getFeeds()
    .then(feeds => {
      // const templateVars = { username: req.session.username, userId: req.session.userId, feeds };
      // res.render('feeds', templateVars);

      feeds.forEach(element => {
        if (userId === element.user_id) {
          element['isSoldBtnActive'] = true;
          element['isDelBtnActive'] = true;
        }

        getFavouriteByUserIdAndItemId(userId, element.id)
          .then(tempVal => {
            if (tempVal.length > 0) {
              element['isFavBtnActive'] = true;
            }
          });
        results.push(element);
      });

      const templateVars = { username: req.session.username, userId: req.session.userId, results };
      res.render('myfeeds', templateVars);
    });
});

router.get('/new', (req, res) => {
  res.render('newFeed');
});

router.get('/myfeeds', (req, res) => {
  const userId = req.session.userId ? req.session.userId : 1;
  const results = [];
  feed.getFeedsByUser(userId)
    .then(feeds => {
      feeds.forEach(element => {
        if (userId === element.user_id) {
          element['isSoldBtnActive'] = true;
          element['isDelBtnActive'] = true;
        }

        getFavouriteByUserIdAndItemId(userId, element.id)
          .then(tempVal => {
            if (tempVal.length > 0) {
              element['isFavBtnActive'] = true;
            }
          });
        results.push(element);
      });

      const templateVars = { username: req.session.username, userId: req.session.userId, results };
      res.render('myfeeds', templateVars);
    });
});

module.exports = router;
