const Router = require("express-promise-router");

const View = require("@saltcorn/data/models/view");
const { div, text, i, a } = require("@saltcorn/markup/tags");
const { renderForm, link } = require("@saltcorn/markup");
const { setTenant, error_catcher } = require("../routes/utils.js");

const router = new Router();
module.exports = router;

router.get(
  "/:viewname",
  setTenant,
  error_catcher(async (req, res) => {
    const { viewname } = req.params;

    const view = await View.findOne({ name: viewname });
    const role = req.isAuthenticated() ? req.user.role_id : 10;

    if (!view) {
      req.flash("danger", req.__(`No such view: %s`, text(viewname)));
      res.redirect("/");
    } else if (role > view.min_role) {
      req.flash("danger", req.__("Not authorized"));
      res.redirect("/");
    } else {
      const state = view.combine_state_and_default_state(req.query);
      const resp = await view.run(state, { res, req });
      const state_form = await view.get_state_form(state);
      const rendered = div(
        state_form ? renderForm(state_form, req.csrfToken()) : "",
        resp
      );
      const showThis =
        role === 1 && !req.xhr
          ? {
              type: "card",
              title: [
                view.name,

                a(
                  {
                    class: "ml-4",
                    href: `/viewedit/edit/${encodeURIComponent(view.name)}`,
                  },
                  "Edit&nbsp;",
                  i({ class: "fas fa-edit" })
                ),
              ],
              contents: rendered,
            }
          : rendered;
      res.sendWrap(view.name, showThis);
    }
  })
);
router.post(
  "/:viewname/:route",
  setTenant,
  error_catcher(async (req, res) => {
    const { viewname, route } = req.params;
    const role = req.isAuthenticated() ? req.user.role_id : 10;

    const view = await View.findOne({ name: viewname });
    if (!view) {
      req.flash("danger", req.__(`No such view: %s`, text(viewname)));
      res.redirect("/");
    } else if (role > view.min_role) {
      req.flash("danger", req.__("Not authorized"));
      res.redirect("/");
    } else {
      await view.runRoute(route, req.body, res, { res, req });
    }
  })
);

router.post(
  "/:viewname",
  setTenant,
  error_catcher(async (req, res) => {
    const { viewname } = req.params;
    const role = req.isAuthenticated() ? req.user.role_id : 10;

    const view = await View.findOne({ name: viewname });
    if (!view) {
      req.flash("danger", req.__(`No such view: %s`, text(viewname)));
      res.redirect("/");
    } else if (role > view.min_role) {
      req.flash("danger", req.__("Not authorized"));
      res.redirect("/");
    } else {
      await view.runPost(req.query, req.body, { res, req });
    }
  })
);
