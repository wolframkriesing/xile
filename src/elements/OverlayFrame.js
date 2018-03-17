import * as symbols from '../symbols.js';
import ElementBase from '../ElementBase.js';
import FocusCaptureMixin from '../mixins/FocusCaptureMixin.js';


const Base =
  FocusCaptureMixin(
    ElementBase
  );


class OverlayFrame extends Base {

  get [symbols.template]() {
    return `
      <style>
        :host {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          padding: 1em;
          position: relative;
        }
      </style>
      ${this[FocusCaptureMixin.inject](`
        <slot></slot>
      `)}
    `;
  }

}


customElements.define('elix-overlay-frame', OverlayFrame);
export default OverlayFrame;
