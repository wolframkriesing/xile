import * as symbols from '../symbols.js';

const slotchangeFiredKey = Symbol('slotchangeFired');

export class SlotContent {

  constructor(shadowRoot) {
    this.shadowRoot = shadowRoot;

    // Listen to changes on the default slot.
    const slot = this._contentSlot;
    if (slot) {
      slot.addEventListener('slotchange', () => {

        // Although slotchange isn't generally a user-driven event, it's
        // impossible for us to know whether a change in slot content is going
        // to result in effects that the host of this element can predict.
        // To be on the safe side, we raise any change events that come up
        // during the processing of this event.
        this[symbols.raiseChangeEvents] = true;

        // Note that the event has fired. We use this flag in the
        // normalization promise below.
        this[slotchangeFiredKey] = true;

        // The polyfill seems to be able to trigger slotchange during
        // rendering, which shouldn't happen in native Shadow DOM. We try to
        // defend against this by deferring updating state. This feels hacky.
        if (!this[symbols.rendering]) {
          assignedNodesChanged(this);
        } else {
          Promise.resolve().then(() => {
            assignedNodesChanged(this);
          });
        }

        this[symbols.raiseChangeEvents] = false;
      });

      // Chrome and the polyfill will fire slotchange with the initial content,
      // but Safari won't. We wait to see whether the event fires. (We'd prefer
      // to synchronously call assignedNodesChanged, but then if a subsequent
      // slotchange fires, we won't know whether it's an initial one or not.)
      // We do our best to normalize the behavior so the component always gets
      // a chance to process its initial content.
      Promise.resolve().then(() => {
        if (!this[slotchangeFiredKey]) {
          // The event didn't fire, so we're most likely in Safari.
          // Update our notion of the component content.
          this[slotchangeFiredKey] = true;
          assignedNodesChanged(this);
        }
      });

    }
  }

  get _contentSlot() {
    const slot = this.shadowRoot && this.shadowRoot.querySelector('slot:not([name])');
    if (!this.shadowRoot || !slot) {
      /* eslint-disable no-console */
      console.warn(`SlotContentMixin expects ${this.constructor.name} to define a shadow tree that includes a default (unnamed) slot.\nSee https://elix.org/documentation/SlotContentMixin.`);
    }
    return slot;
  }

  onContentChange(cb) {
    const handlers = this._onContentChangeHandlers || [];
    this._onContentChangeHandlers = [...handlers, cb];
  }
  contentChanged(content) {
    const handlers = this._onContentChangeHandlers || [];
    handlers.map(fn => fn(content));
  }
  // TODO there is no unregistering of `onContentChange` handlers

  onSlotChange(cb) {
    this._contentSlot.addEventListener('slotchange', cb);
  }
}

// The nodes assigned to the given component have changed.
// Update the component's state to reflect the new content.
function assignedNodesChanged(component) {

  const slot = component._contentSlot;
  const content = slot ?
    slot.assignedNodes({ flatten: true }) :
    null;

  // Make immutable.
  Object.freeze(content);

  component.contentChanged(content);
  // component.setState({ content });
}
