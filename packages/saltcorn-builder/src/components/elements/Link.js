import React, { Fragment, useContext } from "react";
import { useNode } from "@craftjs/core";
import { blockProps, BlockSetting, TextStyleSetting } from "./utils";
import optionsCtx from "../context";

export const Link = ({ text, block, isFormula, textStyle }) => {
  const {
    selected,
    connectors: { connect, drag },
  } = useNode((node) => ({ selected: node.events.selected }));
  return (
    <span
      className={`${textStyle} is-builder-link ${
        selected ? "selected-node" : ""
      } ${isFormula.text ? "text-monospace" : ""}`}
      {...blockProps(block)}
      ref={(dom) => connect(drag(dom))}
    >
      {isFormula.text ? `=${text}` : text}
    </span>
  );
};

const OrFormula = ({ setProp, isFormula, node, nodekey, children }) => {
  const { mode } = useContext(optionsCtx);

  return mode !== "show" ? (
    children
  ) : (
    <Fragment>
      <div className="input-group  input-group-sm w-100">
        {isFormula[nodekey] ? (
          <input
            type="text"
            className="form-control text-to-display"
            value={node[nodekey]}
            onChange={(e) =>
              setProp((prop) => (prop[nodekey] = e.target.value))
            }
          />
        ) : (
          children
        )}
        <div className="input-group-append">
          <button
            className={`btn activate-formula ${
              isFormula[nodekey] ? "btn-secondary" : "btn-outline-secondary"
            }`}
            title="Calculated formula"
            type="button"
            onClick={(e) =>
              setProp((prop) => (prop.isFormula[nodekey] = !isFormula[nodekey]))
            }
          >
            <i className="fas fa-calculator"></i>
          </button>
        </div>
      </div>
      {isFormula[nodekey] && (
        <div style={{ marginTop: "-5px" }}>
          <small className="text-muted text-monospace">FORMULA</small>
        </div>
      )}
    </Fragment>
  );
};

export const LinkSettings = () => {
  const node = useNode((node) => ({
    text: node.data.props.text,
    url: node.data.props.url,
    block: node.data.props.block,
    isFormula: node.data.props.isFormula,
    textStyle: node.data.props.textStyle,
  }));
  const {
    actions: { setProp },
    text,
    url,
    block,
    isFormula,
    textStyle,
  } = node;

  return (
    <div>
      <label>Text to display</label>
      <OrFormula nodekey="text" {...{ setProp, isFormula, node }}>
        <input
          type="text"
          className="form-control text-to-display"
          value={text}
          onChange={(e) => setProp((prop) => (prop.text = e.target.value))}
        />
      </OrFormula>
      <label>URL</label>
      <OrFormula nodekey="url" {...{ setProp, isFormula, node }}>
        <input
          type="text"
          className="form-control "
          value={url}
          onChange={(e) => setProp((prop) => (prop.url = e.target.value))}
        />
      </OrFormula>
      <BlockSetting block={block} setProp={setProp} />
      <TextStyleSetting textStyle={textStyle} setProp={setProp} />
    </div>
  );
};

Link.craft = {
  defaultProps: {
    text: "Click here",
    url: "https://saltcorn.com/",
    block: false,
    isFormula: {},
    textStyle: "",
  },
  displayName: "Link",
  related: {
    settings: LinkSettings,
  },
};
