const renderForm = require("./form");
const renderBuilder = require("./builder");
const mkTable = require("./table");
const tabs = require("./tabs");
const { a, text } = require("./tags");

const link = (href, s) => a({ href: text(href) }, text(s));

const post_btn = (
  href,
  s,
  csrfToken,
  {
    btnClass = "primary",
    onClick,
    small,
    ajax,
    reload_on_done,
    reload_delay,
    klass = "",
    formClass,
    spinner,
    confirm,
  } = {}
) =>
  `<form action="${text(href)}" method="post"${
    formClass ? `class="${formClass}"` : ""
  }>
  <input type="hidden" name="_csrf" value="${csrfToken}">
<button ${ajax ? 'type="button"' : 'type="submit"'} ${
    onClick
      ? `onclick="${spinner ? "press_store_button(this);" : ""}${onClick}"`
      : ajax
      ? `onclick="${
          spinner ? "press_store_button(this);" : ""
        }ajax_post_btn(this, ${reload_on_done}, ${reload_delay})"`
      : ""
  } class="${klass} btn ${
    small ? "btn-sm" : ""
  } btn-${btnClass}">${s}</button></form>`;

const post_delete_btn = (href, csrfToken, what) =>
  `<form action="${text(href)}" method="post" >
    <input type="hidden" name="_csrf" value="${csrfToken}">
    <button type="submit" class="btn btn-danger btn-sm" 
      onclick="return confirm('Are you sure${
        what ? ` you want to delete ${what}` : ""
      }?')" />
      <i class="fas fa-trash-alt"></i>
    </button>
  </form>`;

const post_dropdown_item = (href, s, csrfToken, confirm, what) => {
  const id = href.split("/").join("");
  return `<a class="dropdown-item" onclick="${
    confirm
      ? `if(confirm('Are you sure${
          what ? ` you want to delete ${what}` : ""
        }?')) `
      : ""
  }$('#${id}').submit()">${s}</a>
  <form id="${id}" action="${text(href)}" method="post">
    <input type="hidden" name="_csrf" value="${csrfToken}">
  </form>`;
};
module.exports = {
  mkTable,
  renderForm,
  renderBuilder,
  link,
  post_btn,
  post_delete_btn,
  post_dropdown_item,
  tabs,
};
